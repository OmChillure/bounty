"use client";

import { useRouter } from "next/navigation";
import React, { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Page() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    upiId: "",
  });

  const getQrDetails = async () => {
    const bountyCode = window.location.pathname.split("/").pop();
    const data = await fetch(
      `http://localhost:5001/api/code/${bountyCode}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const response = await data.json();
    if(!response.action){
      alert("Code Scan Successful")
    }else{
      router.push(response.redirectUrl);
    }
    console.log(response);
  };

  const registerCustomer = async () => {
    try {
      const response = await fetch("http://localhost:5001/external/registercustomer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to register customer");
      }

      const data = await response.json();
      console.log("Customer registered successfully:", data);
    } catch (error) {
      console.error("Error registering customer:", error);
      alert("Failed to register customer. Please try again.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await registerCustomer();
    await getQrDetails();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 text-white">
      <Card className="w-full max-w-lg border-gray-700 bg-gray-700/20">
        <CardHeader>
          <CardTitle className="text-2xl">Customer Registration</CardTitle>
          <CardDescription>Please fill in your details to proceed</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter your full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
                placeholder="Enter your phone number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="Enter your email address"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="upiId">UPI ID</Label>
              <Input
                type="text"
                id="upiId"
                name="upiId"
                value={formData.upiId}
                onChange={handleInputChange}
                required
                placeholder="Enter your UPI ID"
              />
            </div>
            <Button type="submit" className="w-full mt-6 bg-black">
              Register and Proceed
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
