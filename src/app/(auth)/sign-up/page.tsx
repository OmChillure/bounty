"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import clsx from "clsx";
import { LoadingButton } from "@/components/globals/buttons";
import { signIn } from "next-auth/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

const SignupUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  mobileNumber: z.string().min(10, "Mobile number must be at least 10 digits"),
  typeOfUser: z.enum(["brand-admin", "customer"]),
  upiId: z.string().optional(),
  companyId: z.string().optional(),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignupFormData = z.infer<typeof SignupUserSchema>;

const Signup = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const form = useForm<SignupFormData>({
    defaultValues: {
      name: "",
      mobileNumber: "",
      typeOfUser: "customer",
      upiId: "",
      companyId: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: SignupFormData) {
    setLoading(true);
    try {
      const payload = {
        name: values.name,
        mobileNumber: values.mobileNumber,
        typeOfUser: values.typeOfUser,
        email: values.email,
        password: values.password,
        ...(values.upiId && { upiId: values.upiId }),
        ...(values.companyId && { companyId: values.companyId }),
      };

      let response: Response;
      try {
        response = await fetch("https://bounty.33solutions.dev/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(payload),
        });
      } catch (networkError) {
        throw new Error("Network error. Please check your connection.");
      }

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error("Response parsing error:", response);
        throw new Error(
          `Server returned invalid response (Status: ${response.status} ${response.statusText}). ` +
          "Please contact support if this persists."
        );
      }
      router.push("/sign-in");

    } catch (error) {
      console.error("Signup error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
      });
    } finally {
      setLoading(false);
    }
  }

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await signIn("google", {
        callbackUrl: "/create-company",
      });
    } catch (error) {
      console.error("Google signin error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Unable to sign in with Google. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full text-white">
      <div className="w-full flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-4xl text-white font-semibold">Sign Up</h2>
          <span className="text-base text-purple-300">
            Enter your information to create an account
          </span>
        </div>

        <Button
          className={clsx("flex items-center w-full gap-3 rounded-md bg-gray-800 text-white")}
          onClick={handleGoogle}
          type="button"
          disabled={loading}
        >
          <Image
            src="/svgs/google.svg"
            width={20}
            height={20}
            alt="google logo"
          />
          Sign Up with Google
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white text-sm">Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Snow" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mobileNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white text-sm">Mobile Number</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="918779780352" 
                      {...field}
                      type="tel"
                      pattern="[0-9]*"
                      inputMode="numeric"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
              control={form.control}
              name="typeOfUser"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white text-sm">User Type</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select user type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="customer">Customer</SelectItem>
                      <SelectItem value="brand-admin">Brand Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            
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
                      {...field}
                      minLength={6}
                      autoComplete="new-password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* {form.watch("typeOfUser") === "customer" && (
              <FormField
                control={form.control}
                name="upiId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white text-sm">UPI ID (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="username@upi" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )} */}

            {/* {form.watch("typeOfUser") === "brand-admin" && (
              <FormField
                control={form.control}
                name="companyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white text-sm">Company ID (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Company ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )} */}

            <LoadingButton
              type="submit"
              text="Sign Up"
              className="mt-3"
              loading={loading}
            />
          </form>
        </Form>

        <div className="text-sm text-white -mt-2">
          Account already exists? &nbsp;
          <Link
            className="font-bold cursor-pointer rounded-3xl text-[#7371FC]"
            href="/sign-in"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;