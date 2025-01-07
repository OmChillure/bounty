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

  useEffect(() => {
    getQrDetailes();
  }, []);

  return <div>Heelo</div>;
}

export default page;
