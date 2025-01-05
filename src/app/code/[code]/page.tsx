"use client";
import React from "react";
import { useEffect } from "react";

function page() {
  const getQrDetailes = async () => {
    const data = await fetch(
      `https://7c63-2401-4900-1c9b-b6ae-d8a1-e8f8-d218-4e0.ngrok-free.app/api/code/${bountCode}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const response = await data.json();
    console.log(response);
  };

  useEffect(() => {
    getQrDetailes();
  }, []);

  return <div>Heelo</div>;
}

export default page;
