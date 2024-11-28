"use client";
import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
// import { useAppSelector } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { GlassCard, PurpleCard } from "@/components/globals/cards";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
    },
  };

  const router = useRouter();
  const [filterDate] = useState<
    "Month" | "Year" | "Week" | "Today" | "All"
  >("All");

  const generateRandomData = () => {
    return {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      messagesData: Array.from({ length: 12 }, () => Math.floor(Math.random() * 100)),
      repliesData: Array.from({ length: 12 }, () => Math.floor(Math.random() * 100)),
      messages: Math.floor(Math.random() * 1000),
      replies: Math.floor(Math.random() * 1000),
      response: Math.floor(Math.random() * 100),
      audience: Math.floor(Math.random() * 10000),
      campaigns: Math.floor(Math.random() * 100),
      sequences: Math.floor(Math.random() * 50),
    };
  };

  const [statsData, setStatsData] = useState(generateRandomData());

  useEffect(() => {
    setStatsData(generateRandomData());
  }, [filterDate]);

  return (
    <div className="flex flex-col gap-5 min-h-screen text-white px-4 sm:px-6 py-12 ">
      <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-0 items-start sm:items-start">
        <h2 className="text-xl sm:text-2xl font-semibold">Campaign Overview</h2>
      </div>
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          <PurpleCard head="Audiences" value={statsData.audience} />
          <PurpleCard
            head="Campaigns"
            value={statsData.campaigns}
            style={{
              background:
                "linear-gradient(55.76deg, #7371FC 4.44%, #A594F9 95.11%)",
              border: "1px solid #FFFFFF33",
            }}
          />
          <PurpleCard head="Sequences" value={statsData.sequences} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 sm:max-h-[345px] mt-5">
        <div
          className="lg:col-span-2 p-4 h-[200px] sm:h-full rounded-3xl w-full hidden sm:flex"
          style={{
            background:
              "linear-gradient(160.61deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 101.7%)",
            border: "1px solid #FFFFFF33",
          }}
        >
          <Line
            data={{
              labels: statsData.labels,
              datasets: [
                {
                  label: "Initial Message Sent",
                  data: statsData.messagesData,
                  borderColor: "#A594F9",
                  tension: 0.4,
                },
                {
                  label: "Replies Received",
                  data: statsData.repliesData,
                  borderColor: "#7371FC",
                  tension: 0.4,
                },
              ],
            }}
            options={chartOptions}
          />
        </div>
        <div className="flex flex-col gap-4 h-[50vh]">
          <GlassCard className="h-full">
            <div className="flex items-start gap-5 cursor-pointer">
                <h1 className="text-2xl font-semibold">Notifications</h1>
            </div>
          </GlassCard>
        </div>
      </div>

      
    </div>
  );
};

export default Dashboard;
