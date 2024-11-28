"use client"
import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from "next/navigation";
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";

interface CompanyFormData {
  name: string;
  contactName: string;
  email: string;
  phoneNumber: string;
  description: string;
  website: string;
}

const initialFormData: CompanyFormData = {
  name: "",
  contactName: "",
  email: "",
  phoneNumber: "",
  description: "",
  website: "",
};

interface CompanyResponse {
  message: string;
  companyId: string;
}

const NewCompanyForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CompanyFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<CompanyFormData>>({});
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    console.log("Token from localStorage:", storedToken);
    if (!storedToken) {
      router.push('/sign-in');
      return;
    }
    setToken(storedToken);
  }, [router]);

  const validateForm = (data: CompanyFormData): boolean => {
    const newErrors: Partial<CompanyFormData> = {};
    
    if (!data.name.trim()) {
      newErrors.name = "Company name is required";
    }
    
    if (!data.contactName.trim()) {
      newErrors.contactName = "Contact name is required";
    }
    
    if (!data.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = "Invalid email address";
    }
    
    if (!data.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    }
    
    if (data.website && !/^https?:\/\/.*/.test(data.website)) {
      newErrors.website = "Website must start with http:// or https://";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name as keyof CompanyFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
  
    if (!validateForm(formData)) {
      setLoading(false);
      return;
    }
  
    if (!token) {
      toast({
        title: "Error",
        description: "Authentication required. Please sign in again.",
        variant: "destructive",
      });
      router.push('/sign-in');
      return;
    }
  
    console.log(`Authorization Header: Bearer ${token}`);
  
    try {
      const response = await fetch('https://bounty.33solutions.dev/api/companies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          router.push('/sign-in');
          throw new Error('Session expired. Please sign in again.');
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create company');
      }

      const responseData: CompanyResponse = await response.json();

      localStorage.setItem('companyId', responseData.companyId);
      console.log("Company ID stored:", responseData.companyId);
  
      toast({
        title: "Success",
        description: "Company created successfully",
        variant: "default",
      });
  
      router.push('/dashboard');
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create company. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6">
      <div className="fixed inset-0 bg-gradient-to-tr from-violet-500/10 via-transparent to-blue-500/10 pointer-events-none" />
      <div className="fixed top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-violet-600/20 to-blue-600/20 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <Card className="relative max-w-2xl mx-auto bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 shadow-2xl shadow-violet-500/10 mt-2">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 via-transparent to-blue-600/10 rounded-lg pointer-events-none" />
        
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-1">
            <div>
              <CardHeader className="">
                <h3 className="text-3xl font-semibold text-slate-200">Create Company</h3>
              </CardHeader>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2 group">
                <label className="text-sm font-medium text-slate-200 group-hover:text-violet-400 transition-colors">
                  Name
                </label>
                <Input 
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-slate-800/50 border-slate-700/50 text-slate-200 focus:border-violet-500 hover:border-violet-500/50 transition-all duration-300 rounded-lg backdrop-blur-sm"
                  placeholder="Enter company name"
                />
                {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
              </div>
              <div className="space-y-2 group">
                <label className="text-sm font-medium text-slate-200 group-hover:text-violet-400 transition-colors">
                  Contact Name
                </label>
                <Input 
                  type="text"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  className="bg-slate-800/50 border-slate-700/50 text-slate-200 focus:border-violet-500 hover:border-violet-500/50 transition-all duration-300 rounded-lg backdrop-blur-sm"
                  placeholder="Enter Contact Name"
                />
                {errors.contactName && <p className="text-red-400 text-sm mt-1">{errors.contactName}</p>}
              </div>
              <div className="space-y-2 col-span-2 group">
                <label className="text-sm font-medium text-slate-200 group-hover:text-violet-400 transition-colors">
                  Description
                </label>
                <Input 
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="bg-slate-800/50 border-slate-700/50 text-slate-200 focus:border-violet-500 hover:border-violet-500/50 transition-all duration-300 rounded-lg backdrop-blur-sm"
                  placeholder="Enter description"
                />
                {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
              </div>
              <div className="space-y-2 group">
                <label className="text-sm font-medium text-slate-200 group-hover:text-violet-400 transition-colors">
                  Phone Number
                </label>
                <Input 
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="bg-slate-800/50 border-slate-700/50 text-slate-200 focus:border-violet-500 hover:border-violet-500/50 transition-all duration-300 rounded-lg backdrop-blur-sm"
                  placeholder="Enter phone number"
                />
                {errors.phoneNumber && <p className="text-red-400 text-sm mt-1">{errors.phoneNumber}</p>}
              </div>
              <div className="space-y-2 group">
                <label className="text-sm font-medium text-slate-200 group-hover:text-violet-400 transition-colors">
                  Email
                </label>
                <Input 
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-slate-800/50 border-slate-700/50 text-slate-200 focus:border-violet-500 hover:border-violet-500/50 transition-all duration-300 rounded-lg backdrop-blur-sm"
                  placeholder="Enter Email"
                />
                {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
              </div>
              <div className="space-y-2 group">
                <label className="text-sm font-medium text-slate-200 group-hover:text-violet-400 transition-colors">
                  Website  (optional)
                </label>
                <Input 
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="bg-slate-800/50 border-slate-700/50 text-slate-200 focus:border-violet-500 hover:border-violet-500/50 transition-all duration-300 rounded-lg backdrop-blur-sm"
                  placeholder="Website URL"
                />
                {errors.website && <p className="text-red-400 text-sm mt-1">{errors.website}</p>}
              </div>
            </div>
            <div className="flex justify-end pt-6">
              <Button 
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-[#7371FC] to-[#A594F9] hover:from-[#7371FC] hover:to-[#A594F9] text-white px-8 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-violet-500/25 backdrop-blur-sm disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Company"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewCompanyForm;