"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ViewCompany from "./viewCompany";
import { getAuthToken } from "@/lib/api";
import { toast } from "react-toastify";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

type CompanyRow = {
  id: number;
  apiId: string;
  name: string;
  owner: string;
  mobile: string;
  email: string;
  region: string;
  initials: string;
};

type ViewingCompany = {
  id: number;
  apiId: string;
  name: string;
  designation: string;
  mobile: string;
  email: string;
  location: string;
  avatar: string;
  verified: "blue" | "orange" | "red";
  online: boolean;
};

type CompanyApiItem = {
  _id: string;
  companyName: string;
  founderName: string;
  emailId: string;
  mobileNumber: string;
  designation: string;
  office: string;
  country: string;
  companyDocument1?: string;
  companyDocument2?: string;
  agentId?: string;
  createdAt?: string;
};

const ENTRIES_OPTIONS = [8, 16, 24];

const makeInitials = (name: string) => {
  const trimmed = name.trim();
  if (!trimmed) return "CMP";

  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 4).toUpperCase();
  }

  return parts
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
};

export default function CompanyManagementHome() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [showEntriesDropdown, setShowEntriesDropdown] = useState(false);
  const [viewingCompany, setViewingCompany] = useState<ViewingCompany | null>(null);
  const [companies, setCompanies] = useState<CompanyRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const controller = new AbortController();

    const loadCompanies = async () => {
      if (!API_BASE_URL) {
        setErrorMessage("API base URL is not configured.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setErrorMessage("");

      try {
        const token = getAuthToken();
        const response = await fetch(`${API_BASE_URL}/api/companies`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          signal: controller.signal,
        });

        const data = (await response.json().catch(() => null)) as CompanyApiItem[] | { message?: string } | null;

        if (!response.ok) {
          const message = !Array.isArray(data) && data?.message ? data.message : `Request failed with status ${response.status}`;
          throw new Error(message);
        }

        const rows = Array.isArray(data)
          ? data.map((item, index) => ({
              id: index + 1,
              apiId: item._id,
              name: item.companyName,
              owner: item.founderName,
              mobile: item.mobileNumber,
              email: item.emailId,
              region: item.office,
              initials: makeInitials(item.companyName),
            }))
          : [];

        setCompanies(rows);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        const message = error instanceof Error ? error.message : "Failed to load companies";
        setErrorMessage(message);
        setCompanies([]);
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    };

    loadCompanies();

    return () => controller.abort();
  }, [API_BASE_URL]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return companies;

    return companies.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.owner.toLowerCase().includes(query) ||
        item.email.toLowerCase().includes(query) ||
        item.region.toLowerCase().includes(query),
    );
  }, [companies, search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, entriesPerPage]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / entriesPerPage));
  const paginatedRows = filtered.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);

  const pageNumbers = (() => {
    const pages: (number | string)[] = [];

    if (totalPages <= 5) {
      for (let page = 1; page <= totalPages; page += 1) pages.push(page);
      return pages;
    }

    pages.push(1);
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    if (start > 2) pages.push("...");
    for (let page = start; page <= end; page += 1) pages.push(page);
    if (end < totalPages - 1) pages.push("...");

    pages.push(totalPages);
    return pages;
  })();

  if (viewingCompany) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => setViewingCompany(null)}
          className="text-sm text-white/80 hover:text-white"
        >
          ← Back to Company Management
        </button>
        <ViewCompany company={viewingCompany} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h1 className="text-[30px] font-semibold leading-none text-white">Company Management</h1>
          <p className="mt-3 text-sm text-white/80">Manage all of your Company here.</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center xl:justify-end">
          <div className="relative w-full sm:w-[380px]">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="h-[58px] w-full border border-[#9AA4C0] bg-transparent px-5 pr-12 text-sm text-white outline-none placeholder:text-white/65"
            />
            <Search className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#0F1A36]" />
          </div>

          <button className="inline-flex h-[58px] items-center justify-between gap-4 bg-[#F68E2D] px-5 text-sm font-medium text-white transition-colors hover:bg-[#e57d1f] sm:w-[150px]">
            <span>Agent Type</span>
            <ChevronDown className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => router.push("/agent/company-management/add-company")}
            className="inline-flex h-[58px] items-center gap-3 bg-[#F68E2D] px-5 text-sm font-medium text-white transition-colors hover:bg-[#e57d1f] sm:w-[165px] sm:justify-center"
          >
            <Plus className="h-5 w-5" />
            Add Company
          </button>
        </div>
      </div>

      <div className="overflow-hidden border border-[#8A91AC] bg-[#14112E]">
        <div className="overflow-x-auto">
          <table className="min-w-[1100px] w-full border-separate border-spacing-0">
            <thead>
              <tr className="border-b border-[#8A91AC] text-sm font-semibold text-white">
                <th className="border-b border-l-0 border-r border-[#8A91AC] px-6 py-5 text-center">Image</th>
                <th className="border-b border-r border-[#8A91AC] px-6 py-5 text-center">Company Name</th>
                <th className="border-b border-r border-[#8A91AC] px-6 py-5 text-center">Owner Name</th>
                <th className="border-b border-r border-[#8A91AC] px-6 py-5 text-center">Mobile Number</th>
                <th className="border-b border-r border-[#8A91AC] px-6 py-5 text-center">Email</th>
                <th className="border-b border-r border-[#8A91AC] px-6 py-5 text-center">Location</th>
                <th className="border-b border-[#8A91AC] px-6 py-5 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-white/75">
                    Loading companies...
                  </td>
                </tr>
              ) : errorMessage ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-red-300">
                    {errorMessage}
                  </td>
                </tr>
              ) : paginatedRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-white/75">
                    No companies found.
                  </td>
                </tr>
              ) : (
                paginatedRows.map((row, index) => (
                  <tr key={row.id} className="text-sm text-white/90">
                    <td className={`border-r border-[#8A91AC] px-6 py-5 ${index !== paginatedRows.length - 1 ? "border-b border-[#8A91AC]" : ""}`}>
                      <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-white text-[8px] font-bold text-[#1B153D] shadow-sm">
                        {row.initials}
                      </div>
                    </td>
                    <td className={`border-r border-[#8A91AC] px-6 py-5 text-center ${index !== paginatedRows.length - 1 ? "border-b border-[#8A91AC]" : ""}`}>
                      {row.name}
                    </td>
                    <td className={`border-r border-[#8A91AC] px-6 py-5 text-center ${index !== paginatedRows.length - 1 ? "border-b border-[#8A91AC]" : ""}`}>
                      {row.owner}
                    </td>
                    <td className={`border-r border-[#8A91AC] px-6 py-5 text-center ${index !== paginatedRows.length - 1 ? "border-b border-[#8A91AC]" : ""}`}>
                      {row.mobile}
                    </td>
                    <td className={`border-r border-[#8A91AC] px-6 py-5 text-center ${index !== paginatedRows.length - 1 ? "border-b border-[#8A91AC]" : ""}`}>
                      {row.email}
                    </td>
                    <td className={`border-r border-[#8A91AC] px-6 py-5 text-center ${index !== paginatedRows.length - 1 ? "border-b border-[#8A91AC]" : ""}`}>
                      {row.region}
                    </td>
                    <td className={`px-6 py-5 ${index !== paginatedRows.length - 1 ? "border-b border-[#8A91AC]" : ""}`}>
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setViewingCompany({
                              id: row.id,
                              apiId: row.apiId,
                              name: row.name,
                              designation: row.owner,
                              mobile: row.mobile,
                              email: row.email,
                              location: row.region,
                              avatar: "/avatar.jpg",
                              verified: "blue",
                              online: true,
                            })
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-md bg-[#F68E2D] text-white transition-colors hover:bg-[#e57d1f]"
                          aria-label="View company"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="flex h-8 w-8 items-center justify-center rounded-md bg-[#4A5BE7] text-white transition-colors hover:bg-[#3e4fd3]" aria-label="Edit company">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button className="flex h-8 w-8 items-center justify-center rounded-md bg-[#E03137] text-white transition-colors hover:bg-[#c62830]" aria-label="Delete company">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col gap-4 pb-3 pt-1 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={currentPage === 1}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-white/85 text-white transition-colors hover:bg-white/5 disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {pageNumbers.map((page, index) =>
            typeof page === "number" ? (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`h-8 min-w-8 rounded-md px-2 text-sm font-medium transition-colors ${currentPage === page ? "bg-[#F68E2D] text-white" : "text-white/75 hover:bg-white/5"}`}
              >
                {page}
              </button>
            ) : (
              <span key={`${page}-${index}`} className="px-1 text-white/70">
                ...
              </span>
            ),
          )}

          <button
            onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
            disabled={currentPage === totalPages}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-white/85 text-white transition-colors hover:bg-white/5 disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-4 text-sm text-white/75">
          <span>
            Showing {filtered.length === 0 ? 0 : (currentPage - 1) * entriesPerPage + 1} to {Math.min(currentPage * entriesPerPage, filtered.length)} of {filtered.length} entries
          </span>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowEntriesDropdown((value) => !value)}
              className="inline-flex h-9 items-center gap-2 rounded-md bg-white px-3 text-sm text-[#222]"
            >
              Show {entriesPerPage}
              <ChevronDown className="h-4 w-4" />
            </button>

            {showEntriesDropdown && (
              <div className="absolute right-0 top-full z-20 mt-2 w-24 overflow-hidden rounded-md border border-white/10 bg-[#14112E] shadow-lg">
                {ENTRIES_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setEntriesPerPage(option);
                      setShowEntriesDropdown(false);
                    }}
                    className="block w-full px-3 py-2 text-left text-sm text-white/80 hover:bg-white/10"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}