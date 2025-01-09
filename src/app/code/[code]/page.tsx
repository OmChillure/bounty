"use client";
import { useRouter } from "next/navigation";
import React, { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function page() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    upiId: "",
  });

  const getQrDetailes = async () => {

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
      const response = await fetch("http://localhost:5001/external/registerCustomer", {
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

  const submitForm = async () => {
    await registerCustomer();
    await getQrDetailes();
  }


  return <div>
    <form onSubmit={submitForm} action="">
    <div>
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="upiId">UPI ID</Label>
          <Input
            type="text"
            id="upiId"
            name="upiId"
            value={formData.upiId}
            onChange={handleInputChange}
            required
          />
        </div>
        <Button type="submit" className="w-full">
          Register and Proceed
        </Button>
    </form>
  </div>;
}

export default page;
