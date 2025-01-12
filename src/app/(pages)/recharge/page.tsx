"use client";
import React from "react";
import { useState, useEffect } from "react";
import { Check, IndianRupee } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

const PricingPlans = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [companyId, setCompanyId] = useState<string>("");
  const [whatsappNumber, setWhatsappNumber] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    const storedCompanyId = localStorage.getItem('companyId');
    if (!storedCompanyId) {
      setError('No company ID found. Please create a company first.');
      toast({
        title: "Error",
        description: "No company ID found. Redirecting to company creation...",
        variant: "destructive",
      });
      setTimeout(() => {
        router.push('/create-company');
      }, 2000);
      return;
    }
    setCompanyId(storedCompanyId);
  }, [router]);

  type Plan = {
    name: string;
    price: number;
    qrLimit: number;
    setupFee: number;
    whatsappNumber?: boolean;
  };

  const plans: { [key: string]: Plan } = {
    "1K QRs": {
      name: "1K QRs",
      price: 5500,
      qrLimit: 1000,
      setupFee: 0,
    },
    "5K QRs": {
      name: "5K QRs",
      price: 15000,
      qrLimit: 5000,
      setupFee: 0,
    },
    "Elite Pro": {
      name: "Elite Pro",
      price: 20000,
      qrLimit: 6000,
      setupFee: 50000,
      whatsappNumber: true,
    },
  };

  const validatePlan = (planName: string): boolean => {
    return Object.keys(plans).includes(planName);
  };

  const handlePayment = async (planName: string, amount: number) => {
    setLoading(planName);
    setError("");

    try {
      if (!validatePlan(planName)) {
        throw new Error('Invalid plan selected');
      }

      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Please login to continue');
      }

      if (!companyId) {
        throw new Error('Company ID not found');
      }

      if (planName === 'Elite Pro' && (!whatsappNumber || whatsappNumber.length < 10)) {
        throw new Error('Please enter a valid WhatsApp number');
      }

      const selectedPlan = plans[planName as keyof typeof plans];
      // const expectedAmount = selectedPlan.price + selectedPlan.setupFee;
      // if (amount + selectedPlan.setupFee !== expectedAmount) {
      //   throw new Error('Invalid payment amount');
      // }

      const payload = {
        planName,
        // amount: expectedAmount,
        companyId,
        ...(planName === 'Elite Pro' && { whatsappNumber })
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_BOUNTY_URL}/api/payments/recharge`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to process payment');
      }

      const responseData = await response.json();
      toast({
        title: "Success!",
        description: `Successfully subscribed to ${planName} plan`,
        variant: "default",
      });
      console.log('Payment Successful', responseData);

    } catch (err: any) {
      const errorMessage = err.message || "Failed to process payment";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      console.error('Payment Error:', err);
    } finally {
      setLoading(null);
    }
  };

  if (error === 'No company ID found. Please create a company first.') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-white">
        <h2 className="text-2xl font-bold mb-4">Company Required</h2>
        <p className="text-gray-400 mb-4">Please create a company to view pricing plans.</p>
        <p className="text-gray-400">Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-8 mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-white mb-2">Pricing Plans</h2>
        <p className="text-gray-400">Choose the perfect plan for your needs</p>
      </div>

      {error && !error.includes('company') && (
        <div className="max-w-6xl mx-auto mb-6">
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {Object.entries(plans).map(([key, plan]) => (
          <Card
            key={plan.name}
            className="bg-gray-800 border-gray-700 hover:border-purple-500 transition-all duration-300"
          >
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white">
                {plan.name}
              </CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold text-white flex gap-1">
                  <IndianRupee width={30} height={30} className="mt-2"/>
                  {plan.price} 
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex items-center text-gray-300">
                  <Check className="h-5 w-5 text-purple-500 mr-2" />
                  Up to {plan.qrLimit} QR codes
                </li>
                <li className="flex items-center text-gray-300">
                  <Check className="h-5 w-5 text-purple-500 mr-2" />
                  {plan.setupFee === 0
                    ? "No setup fee"
                    : `Setup fee: ${plan.setupFee}`}
                 </li>
                <li className="flex items-center text-gray-300">
                  <Check className="h-5 w-5 text-purple-500 mr-2" />
                  24/7 Support
                </li>
              </ul>

              {plan.whatsappNumber && (
                <div className="mt-6">
                  <Label htmlFor="whatsappNumber" className="text-gray-300">WhatsApp Number</Label>
                  <Input
                    id="whatsappNumber"
                    type="tel"
                    placeholder="Enter WhatsApp number"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    className="mt-2 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                  />
                </div>
              )}

              <button 
                onClick={() => handlePayment(plan.name, plan.price)}
                disabled={loading === plan.name || !companyId || (plan.whatsappNumber && !whatsappNumber)}
                className="w-full mt-8 bg-gradient-to-r from-[#7371FC] to-[#A594F9] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
              >
                {loading === plan.name ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  `Choose ${plan.name}`
                )}
              </button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PricingPlans;