import React from "react";
import dynamic from "next/dynamic";
import Head from "next/head";

const AdminDashboard = dynamic(() => import("../../src/pages/AdminDashboard"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#f0f0f1] flex items-center justify-center font-sans">
      <div className="w-8 h-8 border-4 border-[#2271b1] border-t-transparent rounded-full animate-spin"></div>
      <span className="ml-3 text-xs font-semibold text-[#1d2327]">Loading Admin Dashboard...</span>
    </div>
  ),
});

export default function AdminPage() {
  return (
    <>
      <Head>
        <title>Admin Dashboard | TravelLuxx</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <AdminDashboard />
    </>
  );
}

