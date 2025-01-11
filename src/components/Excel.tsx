"use client";

import React, { useState, useEffect } from "react";
import { AlertCircle, Loader2, Upload } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateExcelCampaign() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    totalAmount: "",
    tags: "",
    triggerType: "Excel",
    numberOfCodes: "100",
    triggerText: "",
    qrStyle: "simple",
    reward_type: "gift",
    customFieldConfig: JSON.stringify([
      { fieldName: "size", required: true },
      { fieldName: "color", required: true },
    ]),
  });

  useEffect(() => {
    const storedCompanyId = localStorage.getItem("companyId");
    if (!storedCompanyId) {
      setError("No company ID found. Please create a company first.");
      setTimeout(() => {
        router.push("/create-company");
      }, 2000);
      return;
    }
    setCompanyId(storedCompanyId);
  }, [router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!companyId) {
      setError("Company ID is required. Please create a company first.");
      setIsLoading(false);
      return;
    }

    if (!file && formData.triggerType === "EXCEL") {
      setError("Please upload a CSV file");
      setIsLoading(false);
      return;
    }

    try {
      const formPayload = new FormData();
      formPayload.append("companyId", companyId);
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "tags") {
          formPayload.append(
            key,
            JSON.stringify(value.split(",").map((tag) => tag.trim()))
          );
        } else if (key === "totalAmount" || key === "numberOfCodes") {
          formPayload.append(key, String(Number(value)));
        } else {
          formPayload.append(key, value);
        }
      });

      if (file) {
        formPayload.append("file", file);
      }

      const response = await fetch(
        "http://localhost:5001/api/campaigns/create",
        {
          method: "POST",
          headers: {
            // 'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formPayload,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create campaign");
      }

      router.push("/campaigns");
    } catch (err: any) {
      setError(err.message || "Failed to create campaign");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-white">
          Create New Campaign
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300">
                Campaign Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter campaign name"
                required
                className="bg-[#1f2937] border-gray-700 text-gray-100 placeholder:text-gray-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-300">
                Description
              </Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter campaign description"
                className="bg-[#1f2937] border-gray-700 text-gray-100 placeholder:text-gray-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="totalAmount" className="text-gray-300">
                Total Amount
              </Label>
              <Input
                id="totalAmount"
                type="number"
                name="totalAmount"
                value={formData.totalAmount}
                onChange={handleChange}
                placeholder="Enter total amount"
                className="bg-[#1f2937] border-gray-700 text-gray-100 placeholder:text-gray-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags" className="text-gray-300">
                Tags (comma-separated)
              </Label>
              <Input
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="loyalty, gift"
                className="bg-[#1f2937] border-gray-700 text-gray-100 placeholder:text-gray-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="qrStyle" className="text-gray-300">
                QR Style
              </Label>
              <Select
                value={formData.qrStyle}
                onValueChange={(value) => handleSelectChange("qrStyle", value)}
              >
                <SelectTrigger
                  id="qrStyle"
                  className="bg-[#1f2937] border-gray-700 text-gray-100"
                >
                  <SelectValue placeholder="Select QR style" />
                </SelectTrigger>
                <SelectContent className="bg-[#1f2937] border-gray-700">
                  <SelectItem value="simple" className="text-gray-100">
                    Simple
                  </SelectItem>
                  <SelectItem value="stylized" className="text-gray-100">
                    Stylized
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="triggerType" className="text-gray-300">
                Trigger Type
              </Label>
              <Input
                id="triggerType"
                value="Excel"
                disabled
                className="bg-[#1f2937] border-gray-700 text-white cursor-not-allowed opacity-70"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="numberOfCodes" className="text-gray-300">
                Number of Codes
              </Label>
              <Input
                id="numberOfCodes"
                type="number"
                name="numberOfCodes"
                value={formData.numberOfCodes}
                onChange={handleChange}
                placeholder="Enter number of codes"
                className="bg-[#1f2937] border-gray-700 text-gray-100 placeholder:text-gray-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reward_type" className="text-gray-300">
                Reward Type
              </Label>
              <Select
                value={formData.reward_type}
                onValueChange={(value) =>
                  handleSelectChange("reward_type", value)
                }
              >
                <SelectTrigger
                  id="reward_type"
                  className="bg-[#1f2937] border-gray-700 text-gray-100"
                >
                  <SelectValue placeholder="Select reward type" />
                </SelectTrigger>
                <SelectContent className="bg-[#1f2937] border-gray-700">
                  <SelectItem value="gift" className="text-gray-100">
                    Gift
                  </SelectItem>
                  <SelectItem value="discount" className="text-gray-100">
                    Discount
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="triggerText" className="text-gray-300">
              Trigger Text
            </Label>
            <Input
              id="triggerText"
              name="triggerText"
              value={formData.triggerText}
              onChange={handleChange}
              placeholder="Enter message template"
              className="bg-[#1f2937] border-gray-700 text-gray-100 placeholder:text-gray-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customFieldConfig" className="text-gray-300">
              Custom Field Config
            </Label>
            <Input
              id="customFieldConfig"
              name="customFieldConfig"
              value={formData.customFieldConfig}
              onChange={handleChange}
              placeholder='[{"fieldName":"size","required":true},{"fieldName":"color","required":true}]'
              className="bg-[#1f2937] border-gray-700 text-gray-100 placeholder:text-gray-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file" className="text-gray-300">
              Upload CSV File
            </Label>
            <div className="flex items-center gap-4">
              <Input
                id="file"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="bg-[#1f2937] border-gray-700 text-gray-100 file:bg-gray-700 file:text-gray-100 file:border-0 file:rounded-md file:px-4 file:py-2 file:mr-4 file:hover:bg-gray-600"
              />
              {file && (
                <span className="text-gray-300 text-sm">{file.name}</span>
              )}
            </div>
          </div>

          {error && (
            <div className="flex gap-5">
              <Alert
                variant="destructive"
                className="bg-red-900/50 border-red-800"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-red-200">
                  {error}
                </AlertDescription>
              </Alert>
              <Button className="bg-white text-black w-20 h-15">
                <Link href={"/recharge"}>Recharge</Link>
              </Button>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500"
            disabled={isLoading || !companyId}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Creating Campaign...</span>
              </div>
            ) : (
              "Create Campaign"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
