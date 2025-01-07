"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { useEffect } from "react";

function page() {
  const router = useRouter();
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

  const registerCustomer = async ()=>{
    // Call an API to register customer at route
    // http://localhost:5001/external/registerCustomer
  }

  const submitForm = async () => {
    await registerCustomer();
    await getQrDetailes();
  }


  return <div>
    <form onSubmit={submitForm} action="">
      {/* Create a form to take in Customer Details and call an API to register customer before proceeding To next Stage */}
    </form>
  </div>;
}

export default page;
