"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input"
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import clsx from "clsx";
import { LoadingButton } from "@/components/globals/buttons";
import { signIn, signOut, useSession } from 'next-auth/react';

const SignInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInFormData = z.infer<typeof SignInSchema>;

const Page: React.FC = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const getNextAuthToken = () => {
    // Get all cookies
    const cookies = document.cookie.split(';');
    // Find the next-auth.session-token cookie
    const sessionCookie = cookies.find(cookie => 
      cookie.trim().startsWith('next-auth.session-token=')
    );
    // Return the token value if found
    return sessionCookie ? sessionCookie.split('=')[1].trim() : null;
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setMessage('');
    console.log('Starting Google sign-in...');

    try {
      // First initiate Google sign in
      const result = await signIn('google', {
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      // Wait a bit for the cookie to be set
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Get the session token from cookies
      const sessionToken = getNextAuthToken();
      
      if (!sessionToken) {
        throw new Error('No session token available');
      }

      console.log('Session token found:', sessionToken);

      // Send the session token to your backend
      const response = await fetch('http://localhost:5001/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idToken: sessionToken
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Store the received token and user data
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }

        // Redirect to check-company page
        router.replace('/check-company');
      } else {
        throw new Error(data.message || 'Failed to process Google authentication');
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
      setMessage('Failed to sign in with Google');
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to sign in with Google",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const form = useForm<SignInFormData>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: SignInFormData) {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5001/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });
      const data = await response.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }

        if (data.user?.hasCompany) {
          router.replace("/dashboard");
        } else {
          router.replace("/check-company");
        }
      } else {
        throw new Error("Invalid response from server");
      }

    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to login. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center w-full text-white">
      <div className="w-full flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-4xl text-white font-semibold">Sign In</h2>
          <span className="text-base text-purple-300">
            Enter your email and password to sign in!
          </span>
        </div>

        <Button
          className={clsx(
            "flex items-center w-full gap-3 text-white bg-gray-800 hover:bg-gray-700"
          )}
          onClick={handleGoogleSignIn}
          type="button"
          disabled={isLoading}
        >
          <Image
              src="/svgs/google.svg"
              width={20}
              height={20}
              alt="google logo"
            />
          Sign in with Google
        </Button>

        <div className="w-full flex items-center gap-4">
          <div className="h-[1px] bg-[#FFFFFF26] flex-1"></div>
          <span className="text-sm text-textPurple01">or</span>
          <div className="h-[1px] bg-[#FFFFFF26] flex-1"></div>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white text-sm">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="m@example.com"
                      autoComplete="email"
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white text-sm">Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password"
                      autoComplete="current-password"
                      disabled={loading}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <LoadingButton
              type="submit"
              text="Sign In"
              className="mt-3"
              loading={loading}
            />
          </form>
        </Form>

        <div className="text-sm text-white -mt-2">
          Not registered yet? &nbsp;
          <Link
            className="font-bold cursor-pointer rounded-3xl text-[#7371FC] hover:text-[#5855fa]"
            href="/sign-up"
          >
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;