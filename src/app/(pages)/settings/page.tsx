"use client"
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Settings as User, Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface UserSettings {
  name: string;
  email: string;
  password: string;
}

const SettingsPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<UserSettings>({
    name: '',
    email: '',
    password: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleResetPassword = () => {
    setFormData(prev => ({
      ...prev,
      password: ''
    }));
  };

  return (
    <div className="h-[85vh] mt-24 p-6">
      <div className="max-w-2xl mx-auto space-y-6">

        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <User className="h-5 w-5 mr-2" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm text-gray-300 flex items-center">
                <User className="h-4 w-4 mr-2" />
                Name
              </label>
              <div className="relative">
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="bg-gray-900/50 border-gray-700 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20"
                  placeholder="Enter your name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-300 flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                Email
              </label>
              <div className="relative">
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-gray-900/50 border-gray-700 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-300 flex items-center">
                <Lock className="h-4 w-4 mr-2" />
                Password
              </label>
              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  className="bg-gray-900/50 border-gray-700 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20 pr-24"
                  placeholder="Enter your password"
                />
                <div className="absolute right-0 top-0 h-full flex items-center space-x-2 px-3">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <div className="w-px h-5 bg-gray-700"></div>
                  <button
                    type="button"
                    onClick={handleResetPassword}
                    className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button 
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;