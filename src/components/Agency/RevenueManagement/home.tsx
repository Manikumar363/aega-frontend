"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, CreditCard, Calendar, CheckCircle2, AlertCircle, ArrowUpRight, RefreshCw, Download, Layers } from "lucide-react";
import { toast } from "react-toastify";

interface SubscriptionDetails {
  _id?: string;
  planName: "Elements" | "Pro" | "Customised";
  category: "agent" | "educator";
  educatorType?: string;
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

const RevenueManagementHome: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [subscription, setSubscription] = useState<SubscriptionDetails | null>(null);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [selectedTxModal, setSelectedTxModal] = useState<boolean>(false);

  const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");

  const fetchSubscriptionDetails = async () => {
    setLoading(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") || sessionStorage.getItem("token") : null;
      if (!token) {
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/subscription/subscription-status`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.subscription) {
          setSubscription(data.subscription);
        }
      }
    } catch (err) {
      console.error("Failed to fetch subscription:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptionDetails();
  }, []);

  const handleToggleAutoRenew = async () => {
    if (!subscription) return;
    setActionLoading(true);
    const token = typeof window !== "undefined" ? localStorage.getItem("token") || sessionStorage.getItem("token") : null;
    const endpoint = subscription.cancelAtPeriodEnd
      ? `${API_BASE_URL}/api/subscription/reactivate-subscription`
      : `${API_BASE_URL}/api/subscription/cancel-subscription`;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Subscription updated successfully.");
        fetchSubscriptionDetails();
      } else {
        toast.error(data.error || "Failed to update subscription.");
      }
    } catch (err: any) {
      toast.error(err.message || "Error updating subscription.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-[#14113A] rounded w-1/3"></div>
        <div className="h-64 bg-[#14113A] rounded-lg"></div>
        <div className="h-48 bg-[#14113A] rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10 w-full max-w-full overflow-x-hidden text-white">
      {/* HEADER SECTION */}
      <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-white/10 pb-5">
        <div>
          <h1 className="text-white text-3xl font-bold tracking-tight">Subscription & Billing Revenue</h1>
          <p className="mt-1 text-white/70 text-sm">
            View complete transaction details, membership tier status, and billing schedule for this account.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchSubscriptionDetails()}
            className="bg-[#1A163E] hover:bg-[#252055] text-white text-xs font-semibold px-4 py-2.5 rounded border border-white/20 inline-flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Status
          </button>
          <Link
            href="/pricing"
            className="bg-[#F7941D] hover:bg-[#E38416] text-white text-xs font-bold uppercase px-5 py-2.5 rounded inline-flex items-center gap-2 border border-[#E28C28] transition-colors"
          >
            Manage / Change Plan <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ACTIVE SUBSCRIPTION OVERVIEW OR EMPTY STATE */}
      {!subscription || subscription.status === "none" ? (
        <section className="bg-[#14113A] border-2 border-dashed border-[#F7941D]/40 p-10 rounded-xl text-center space-y-6 shadow-xl">
          <div className="w-16 h-16 bg-[#F7941D]/10 text-[#F7941D] rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
            <CreditCard className="w-8 h-8 text-[#F7941D]" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h2 className="text-2xl font-bold text-white">No Active Membership Subscription</h2>
            <p className="text-sm text-white/70">
              This account does not have an active AEGA membership plan yet. Subscribe to unlock core recognition, compliance health checks, and CDP training.
            </p>
          </div>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 bg-[#F7941D] hover:bg-[#e28518] text-white font-bold text-xs uppercase px-8 py-3.5 rounded shadow-lg transition-colors"
          >
            Explore Plans & Subscribe Now <ArrowUpRight className="w-4 h-4" />
          </Link>
        </section>
      ) : (
        <>
          {/* SUBSCRIPTION METRICS & STATUS BANNER */}
          <section className="bg-gradient-to-br from-[#0F0B2E] via-[#14113A] to-[#1A163E] border border-[#F7941D]/40 p-8 rounded-xl space-y-6 shadow-2xl relative">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="bg-[#F7941D] text-white font-black text-xs uppercase tracking-widest px-3 py-1 rounded">
                    {subscription.planName} TIER
                  </span>
                  <span className={`text-xs font-bold px-3 py-1 rounded border uppercase tracking-wider ${
                    subscription.status === "active"
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                      : "bg-amber-500/20 text-amber-400 border-amber-500/40"
                  }`}>
                    ● {subscription.status.toUpperCase()}
                  </span>
                </div>
                <h2 className="text-3xl font-extrabold text-white pt-2">
                  AEGA {subscription.planName} Membership ({subscription.category === "agent" ? "Agent" : "Educator"})
                </h2>
              </div>

              <div className="text-left lg:text-right">
                <span className="text-xs text-white/60 uppercase tracking-widest block font-semibold">Total Yearly Amount</span>
                <span className="text-4xl font-black text-[#F7941D]">
                  £{subscription.amountPaidGbp.toLocaleString()} <span className="text-xs text-white/60 font-normal">/ YEAR</span>
                </span>
              </div>
            </div>

            {/* DETAILS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
              <div className="bg-[#0A0724] border border-white/10 p-4 rounded-lg space-y-1">
                <span className="text-xs text-white/60 block font-medium">Offices Covered</span>
                <span className="text-base font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#F7941D]" /> {subscription.officesCount} Registered {subscription.officesCount === 1 ? "Office" : "Offices"}
                </span>
              </div>

              <div className="bg-[#0A0724] border border-white/10 p-4 rounded-lg space-y-1">
                <span className="text-xs text-white/60 block font-medium">Special Modifiers</span>
                <span className="text-sm font-bold text-emerald-400 block">
                  {subscription.hasIcefDiscount ? "✓ 10% ICEF Discount Applied" : subscription.isStartup ? "✓ Start-Up First Year Rate" : "Standard Rate"}
                </span>
              </div>

              <div className="bg-[#0A0724] border border-white/10 p-4 rounded-lg space-y-1">
                <span className="text-xs text-white/60 block font-medium">Billing Period End</span>
                <span className="text-sm font-bold text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#F7941D]" />
                  {subscription.currentPeriodEnd ? new Date(subscription.currentPeriodEnd).toLocaleDateString() : "N/A"}
                </span>
              </div>

              <div className="bg-[#0A0724] border border-white/10 p-4 rounded-lg space-y-1">
                <span className="text-xs text-white/60 block font-medium">Auto-Renewal</span>
                <span className={`text-sm font-bold block ${subscription.cancelAtPeriodEnd ? "text-amber-400" : "text-emerald-400"}`}>
                  {subscription.cancelAtPeriodEnd ? "Cancels at period end" : "Auto-renews yearly"}
                </span>
              </div>
            </div>

            {/* MANAGEMENT CONTROLS */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-white/70">
                {subscription.cancelAtPeriodEnd
                  ? "Your membership will remain active until the period end date, after which it will not auto-renew."
                  : "Your membership will automatically renew each year. You can toggle auto-renewal at any time."}
              </p>
              <button
                onClick={handleToggleAutoRenew}
                disabled={actionLoading}
                className={`w-full sm:w-auto px-6 py-2.5 rounded font-bold text-xs uppercase transition-colors cursor-pointer ${
                  subscription.cancelAtPeriodEnd
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                    : "bg-amber-600 hover:bg-amber-700 text-white"
                }`}
              >
                {actionLoading ? "Updating..." : subscription.cancelAtPeriodEnd ? "Reactivate Auto-Renewal" : "Cancel Auto-Renewal"}
              </button>
            </div>
          </section>

          {/* SUBSCRIPTION TRANSACTION LOG TABLE */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-white text-xl font-bold uppercase tracking-wider">Subscription Transaction History</h2>
              <span className="text-xs text-white/60">Showing latest billing transaction</span>
            </div>

            <div className="bg-[#14113A] border border-[#343868] rounded-xl overflow-hidden shadow-xl">
              <table className="w-full text-left text-sm text-white">
                <thead>
                  <tr className="bg-[#0A0724] border-b border-[#343868] text-xs uppercase tracking-wider text-white/70">
                    <th className="px-6 py-4">Transaction Date</th>
                    <th className="px-6 py-4">Subscription ID</th>
                    <th className="px-6 py-4">Membership Plan</th>
                    <th className="px-6 py-4">Offices</th>
                    <th className="px-6 py-4">Billing Cycle</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-right">Details</th>
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
                    <td className="px-6 py-4">
                      <span className="font-bold text-[#F7941D]">AEGA {subscription.planName}</span>
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {subscription.officesCount} {subscription.officesCount === 1 ? "Office" : "Offices"}
                    </td>
                    <td className="px-6 py-4 uppercase text-xs font-semibold text-white/70">
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
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedTxModal(true)}
                        className="bg-[#1F1A4D] hover:bg-[#2A2367] text-white text-xs px-3.5 py-1.5 rounded border border-white/20 transition-colors cursor-pointer"
                      >
                        View Breakdown
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* TRANSACTION BREAKDOWN MODAL */}
          {selectedTxModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
              <div className="w-full max-w-lg bg-[#14113A] border border-[#F7941D] rounded-xl p-6 text-white shadow-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#F7941D]" /> Membership Transaction Breakdown
                  </h3>
                  <button
                    onClick={() => setSelectedTxModal(false)}
                    className="text-white/60 hover:text-white font-bold text-xl"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-4 text-sm bg-[#0A0724] border border-white/10 p-5 rounded-lg">
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-white/70">Membership Plan:</span>
                    <span className="font-bold text-white">AEGA {subscription.planName} Tier</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-white/70">Category:</span>
                    <span className="font-semibold text-white uppercase">{subscription.category}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-white/70">Covered Offices:</span>
                    <span className="font-semibold text-white">{subscription.officesCount}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-white/70">ICEF 10% Discount:</span>
                    <span className="font-semibold text-emerald-400">
                      {subscription.hasIcefDiscount ? "Applied (10% Off)" : "Not Applied"}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-white/70">Billing Frequency:</span>
                    <span className="font-semibold text-white uppercase">{subscription.billingCycle}</span>
                  </div>
                  <div className="flex justify-between pt-2 text-base font-bold text-[#F7941D]">
                    <span>Total Amount Paid:</span>
                    <span>£{subscription.amountPaidGbp.toLocaleString()} GBP</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedTxModal(false)}
                  className="w-full bg-[#F7941D] hover:bg-[#e28518] text-white py-3 rounded font-bold uppercase text-xs tracking-wider transition-colors cursor-pointer"
                >
                  Close Breakdown
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RevenueManagementHome;
