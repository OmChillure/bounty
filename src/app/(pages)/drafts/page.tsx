"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle, Award, Plus } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Campaign {
  id: string;
  name: string;
  description: string;
  totalAmount: number;
  tags: string[];
  createdAt: string;
  status: string;
}

const CampaignList = () => {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          router.push("/sign-in");
          return;
        }

        const response = await fetch("http://localhost:5001/api/campaigns", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch campaigns");
        }

        const data = await response.json();

        setCampaigns(
          data.campaigns.map((c: any) => ({
            id: c._id,
            name: c.name,
            description: c.description,
            totalAmount: c.totalAmount,
            tags: c.tags,
            createdAt: c.createdAt,
            status: c.status,
          }))
        );
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching campaigns");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaigns();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="p-6 min-h-screen text-white">
      <div className="mb-12">
        <div className="flex items-center space-x-4 mb-2">
          <div className="p-3 bg-blue-600 rounded-lg">
            <Award className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Campaigns
          </h1>
        </div>
        <p className="text-gray-400 ml-16">Manage and track your campaign performance</p>
      </div>

      <div className="flex justify-between items-center mb-8">
        <div className="flex space-x-2">
          <Button variant="outline" className="border-gray-700 text-gray-300 hover:text-white">
            All Campaigns ({campaigns.length})
          </Button>
          <Button variant="outline" className="border-gray-700 text-gray-300 hover:text-white">
            Active ({campaigns.filter(c => c.status === 'Active').length})
          </Button>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Link href="/campaigns/new" className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>New Campaign</span>
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {campaigns.map((campaign) => (
          <Card 
            key={campaign.id} 
            className="bg-gray-800/50 border border-gray-700 hover:border-blue-500/50 transition-all duration-300 rounded-lg"
          >
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <div className="flex-1 mb-4 md:mb-0">
                  <h2 className="text-xl font-semibold text-white mb-2">{campaign.name}</h2>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="cursor-pointer text-gray-400 hover:text-gray-300">
                        {campaign.description}
                      </TooltipTrigger>
                      <TooltipContent>{campaign.description}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="text-gray-400">
                      <div className="text-sm">Total Amount</div>
                      <div className="text-lg font-semibold text-white">
                        ${campaign.totalAmount.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-gray-400">
                      <div className="text-sm">Created On</div>
                      <div className="text-lg font-semibold text-white">
                        {new Date(campaign.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {campaign.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-gray-700/50 rounded-full text-xs text-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col items-start md:items-end space-y-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      campaign.status === "Active" 
                        ? "bg-green-400/10 text-green-400 border border-green-400/20"
                        : "bg-red-400/10 text-red-400 border border-red-400/20"
                    }`}
                  >
                    {campaign.status}
                  </span>
                  <Button 
                    variant="outline"
                    className="border-gray-700 text-gray-300 hover:text-white hover:border-blue-500"
                  >
                    <Link href={`/drafts/${campaign.id}`}>Pay To Publish</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CampaignList;