"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CreditCard, ShieldCheck, Download, RefreshCw, Calendar, ArrowUpRight, Layers } from "lucide-react";

interface SubscriptionDetails {
  _id?: string;
  planName: "Elements" | "Pro" | "Customised";
  category: "agent" | "educator";
  officesCount: number;
  isStartup: boolean;
  hasIcefDiscount: boolean;
  amountPaidGbp: number;
  currency: string;
  billingCycle: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  status: "active" | "canceled" | "past_due" | "unpaid" | "none";
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd: boolean;
  createdAt?: string;
}

const RecentTransactions: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [subscription, setSubscription] = useState<SubscriptionDetails | null>(null);

  const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");

  useEffect(() => {
    const fetchSub = async () => {
      setLoading(true);
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") || sessionStorage.getItem("token") : null;
        if (!token) return;

        const res = await fetch(`${API_BASE_URL}/api/subscription/subscription-status`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.subscription) {
            setSubscription(data.subscription);
          }
        }
      } catch (err) {
        console.error("Error fetching transactions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSub();
  }, []);

  return (
    <div className="space-y-6 pb-10 w-full max-w-full overflow-x-hidden text-white">
      {/* HEADER & BACK BUTTON */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <button
            onClick={() => router.push("/agent/revenue")}
            className="text-xs text-white/70 hover:text-white inline-flex items-center gap-1.5 mb-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Revenue Overview
          </button>
          <h1 className="text-2xl font-bold text-white">Complete Subscription Transactions</h1>
        </div>

        <Link
          href="/pricing"
          className="bg-[#F7941D] hover:bg-[#e28518] text-white text-xs font-bold uppercase px-5 py-2.5 rounded inline-flex items-center gap-2 transition-colors"
        >
          Manage Membership <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {loading ? (
        <div className="h-48 bg-[#14113A] rounded-xl animate-pulse"></div>
      ) : !subscription || subscription.status === "none" ? (
        <div className="bg-[#14113A] border border-white/10 p-8 rounded-xl text-center space-y-4">
          <CreditCard className="w-10 h-10 text-[#F7941D] mx-auto" />
          <h3 className="text-lg font-bold text-white">No Subscription Transactions Logged</h3>
          <p className="text-xs text-white/70 max-w-md mx-auto">
            You do not have any paid membership subscription transactions for this account yet.
          </p>
          <Link
            href="/pricing"
            className="inline-block bg-[#F7941D] text-white text-xs font-bold uppercase px-6 py-3 rounded hover:bg-[#e28518] transition-colors"
          >
            View Membership Pricing
          </Link>
        </div>
      ) : (
        <div className="bg-[#14113A] border border-[#343868] rounded-xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#F7941D]" /> Paid Subscription Invoice Log
            </h2>
            <span className="text-xs text-[#F7941D] font-bold">1 Account Record</span>
          </div>

          <table className="w-full text-left text-sm text-white">
            <thead>
              <tr className="bg-[#0A0724] border-b border-[#343868] text-xs uppercase tracking-wider text-white/70">
                <th className="px-6 py-4">Invoice Date</th>
                <th className="px-6 py-4">Transaction / Sub ID</th>
                <th className="px-6 py-4">Plan Name</th>
                <th className="px-6 py-4">Offices</th>
                <th className="px-6 py-4">Frequency</th>
                <th className="px-6 py-4">Amount Paid</th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              <tr className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-semibold text-white">
                  {subscription.createdAt ? new Date(subscription.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}
                </td>
                <td className="px-6 py-4 font-mono text-xs text-white/80">
                  {subscription.stripeSubscriptionId || subscription._id || "SUB-AEGA-001"}
                </td>
                <td className="px-6 py-4 font-bold text-[#F7941D]">
                  AEGA {subscription.planName} Tier
                </td>
                <td className="px-6 py-4 font-medium">
                  {subscription.officesCount} {subscription.officesCount === 1 ? "Office" : "Offices"}
                </td>
                <td className="px-6 py-4 text-xs uppercase font-semibold text-white/70">
                  {subscription.billingCycle}
                </td>
                <td className="px-6 py-4 font-bold text-white">
                  £{subscription.amountPaidGbp.toLocaleString()} GBP
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold uppercase px-3 py-1 rounded-full">
                    {subscription.status}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecentTransactions;
