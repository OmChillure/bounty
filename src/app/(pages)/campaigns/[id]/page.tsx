"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import JSZip from "jszip";
import qrcode from "qrcode";
import { saveAs } from "file-saver";
import { z } from "zod";

interface Campaign {
  id: string;
  name: string;
  description: string;
  totalAmount: number;
  tags: string[];
  createdAt: string;
  status: string;
  triggerText: string;
  publishPin: string;
  reward_type: string;
  zipUrl: string;
}

const CampaignDetail = () => {
  const router = useRouter();
  const { id } = useParams();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeTab, setActiveTab] = useState("insights");

  const insightsData = [
    { title: "Total Revenue", value: "$45,678", change: "+12%" },
    { title: "Active Users", value: "2,345", change: "+8%" },
    { title: "Conversion Rate", value: "3.2%", change: "-1%" },
  ];

  const payoutData = [
    { method: "Bank Transfer", status: "Active", fee: "1.5%" },
    { method: "PayPal", status: "Inactive", fee: "2.9%" },
    { method: "Stripe", status: "Active", fee: "2.5%" },
  ];

  const dataTable = [
    {
      waNumber: "+91 90296...",
      name: "Vishal",
      phone: "+90 296362...",
      pincode: "400053",
      state: "hdhsbsv",
      address: "bsbsbs",
      city: "bsbsbs",
      landmark: "hdbsb",
    },
    // Add more rows as per your data
  ];

  const getCampaignQrs = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/sign-in");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BOUNTY_URL}/api/code/get-campaign-codes`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ campaignId: id }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch campaign QRs");
      }
      const zip = new JSZip();
      const data = await response.json();
      const urls = data.codes.map(async (codeObj: any) => {
        const qrDataUrl = await qrcode.toDataURL(codeObj.url);
        const base64Data = qrDataUrl.replace(/^data:image\/png;base64,/, "");
        zip.file(`${codeObj.code}.png`, base64Data, { base64: true });
      });
      await Promise.all(urls);
      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, "campaign_qrcodes.zip");
    } catch (err) {
      console.error(err);
      alert(err || "An error occurred while fetching the campaign QRs");
    }
  };

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          router.push("/sign-in");
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BOUNTY_URL}/api/campaigns/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch campaign");
        }

        const data = await response.json();
        const campaignData = data.campaign;

        setCampaign({
          id: campaignData._id,
          name: campaignData.name,
          description: campaignData.description,
          totalAmount: campaignData.totalAmount,
          tags: campaignData.tags,
          createdAt: campaignData.createdAt,
          status: campaignData.status,
          triggerText: campaignData.triggerText,
          publishPin: campaignData.publishPin,
          reward_type: campaignData.reward_type,
          zipUrl: campaignData.zipUrl,
        });
      } catch (err: any) {
        setError(
          err.message || "An error occurred while fetching the campaign"
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchCampaign();
    }
  }, [id, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-10 w-10 text-gray-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertCircle className="h-4 w-4 text-red-600" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!campaign) {
    return null;
  }

  return (
    <div className="p-6 min-h-screen text-white">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">{campaign.name}</h1>
      </div>
      <p className="mt-4 text-lg">{campaign.description}</p>
      <p className="mt-2">Total Amount: ${campaign.totalAmount}</p>
      <p className="mt-2">Tags: {campaign.tags.join(", ")}</p>
      <p className="mt-2">Status: {campaign.status}</p>
      <p className="mt-2">Reward Type: {campaign.reward_type}</p>
      <p className="mt-2">
        Created At: {new Date(campaign.createdAt).toLocaleDateString()}
      </p>
      <p className="mt-2">Trigger Text: {campaign.triggerText}</p>
      <button onClick={getCampaignQrs}>Get QR Codes</button>
      {/* <p className="mt-2">Publish Pin: {campaign.publishPin}</p>
      {campaign.zipUrl && (
        <a href={campaign.zipUrl} target="_blank" rel="noopener noreferrer" className="mt-4 text-blue-500 underline">
          Download Campaign Files
        </a>
      )} */}

      <div className="w-full max-w-8xl mx-auto p-6 space-y-6 text-gray-200">
        <div className="flex bg-white/10 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab("insights")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "insights"
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:text-white"
            }`}
          >
            Insights
          </button>
          <button
            onClick={() => setActiveTab("payout")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "payout"
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:text-white"
            }`}
          >
            Payout Config
          </button>
          <button
            onClick={() => setActiveTab("data")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "data"
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:text-white"
            }`}
          >
            Data
          </button>
        </div>

        {activeTab === "insights" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {insightsData.map((item, index) => (
              <div
                key={index}
                className="p-6 bg-gray-800/50 rounded-lg border border-gray-700"
              >
                <h3 className="text-sm text-gray-400">{item.title}</h3>
                <div className="flex items-baseline mt-2 space-x-2">
                  <span className="text-2xl font-semibold text-white">
                    {item.value}
                  </span>
                  <span
                    className={`text-sm ${
                      item.change.startsWith("+")
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {item.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "payout" && (
          <div className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left p-4 text-sm font-medium text-gray-400">
                      Payment Method
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">
                      Status
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">
                      Transaction Fee
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {payoutData.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-700/50 last:border-b-0 hover:bg-gray-700/30 transition-colors"
                    >
                      <td className="p-4 text-gray-200">{item.method}</td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs ${
                            item.status === "Active"
                              ? "bg-green-400/10 text-green-400 border border-green-400/20"
                              : "bg-gray-400/10 text-gray-400 border border-gray-400/20"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="p-4 text-gray-200">{item.fee}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "data" && (
          <div className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left p-4 text-sm font-medium text-gray-400">
                      WhatsApp Number
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">
                      Name
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">
                      Phone
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">
                      Pincode
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">
                      State
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">
                      Address
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">
                      City
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">
                      Landmark
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dataTable.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-700/50 last:border-b-0 hover:bg-gray-700/30 transition-colors"
                    >
                      <td className="p-4 text-gray-200">{item.waNumber}</td>
                      <td className="p-4 text-gray-200">{item.name}</td>
                      <td className="p-4 text-gray-200">{item.phone}</td>
                      <td className="p-4 text-gray-200">{item.pincode}</td>
                      <td className="p-4 text-gray-200">{item.state}</td>
                      <td className="p-4 text-gray-200">{item.address}</td>
                      <td className="p-4 text-gray-200">{item.city}</td>
                      <td className="p-4 text-gray-200">{item.landmark}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignDetail;
