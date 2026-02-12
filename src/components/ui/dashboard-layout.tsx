"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "react-hot-toast";

import {
  ComplianceIcon,
  AuditsIcon,
  CDPIcon,
  HelpIcon,
  DashboardIcon,
  PasswordIcon, 
  ProfileIcon,
  LogoutIcon,
  AgentManagementIcon,
  SearchIcon,
  NotificationsIcon,
  CertificateIcon
} from "../ui/icons";

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: "agent" | "university";
}

// ✅ Define role-based nav items for AGENT & UNIVERSITY
const agentTopNav = [
  { icon: DashboardIcon, label: "Dashboard", href: "/agent/dashboard" },
  { icon: CDPIcon, label: "CDP Training", href: "/agent/CDP" },
  { icon: ComplianceIcon, label: "Compliances", href: "/agent/compliances" },
  { icon: AuditsIcon, label: "Audits", href: "/agent/audits" },
  { icon: CertificateIcon, label: "Certifications", href: "/agent/certifications" },
  { icon: ProfileIcon, label: "Profile", href: "/agent/profile" },
];

const universityTopNav = [
  { icon: DashboardIcon, label: "Dashboard", href: "/university/dashboard" },
  {icon: AgentManagementIcon, label: "Agent Management", href: "/university/agentManagement" },
  { icon: CDPIcon, label: "CDP Training", href: "/university/CDP" },
  { icon: ComplianceIcon, label: "Compliances", href: "/university/compliances" },
  { icon: AuditsIcon, label: "Audits", href: "/university/audits" },
  {icon: CertificateIcon, label: "Certifications", href: "/university/certifications" },
  { icon: ProfileIcon, label: "Profile", href: "/university/profile" },
];

const agentBottomNav = [
  { icon: HelpIcon, label: "Help Center", href: "/agent/help-center" },
  { icon: PasswordIcon, label: "Password", href: "/agent/password" },
//   { icon: LogoutIcon, label: "Logout", href: "/agent/logout" },
];

const universityBottomNav = [
  { icon: HelpIcon, label: "Help Center", href: "/university/help-center" },
  { icon: PasswordIcon, label: "Password & Security", href: "/university/password" },
//   { icon: LogoutIcon, label: "Logout", href: "/university/logout" },
];

const DashboardLayout = ({ children, role }: DashboardLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  const topNavigationItems = role === "agent" ? agentTopNav : universityTopNav;
  const bottomNavigationItems = role === "agent" ? agentBottomNav : universityBottomNav;

  const handleLogout = () => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
        localStorage.removeItem("userRole");
        sessionStorage.clear();
      }
      console.log(`Logging out ${role}...`);

      toast.success("Successfully logged out!", {
        duration: 3000,
        style: {
          background: "#fff",
          color: "#2A020D",
          fontWeight: "bold",
        },
      });

      setTimeout(() => {
        router.push(`/login`);
      }, 500);
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Error during logout. Please try again.");
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSidebarOpen]);

  const searchEnabledRoutes = [
    `/${role}/dashboard`,
    `/${role}/CDP`,
    `/${role}/compliances`,
    `/${role}/audits`,
  ];

  const injectSearchProp = (node: React.ReactNode, q: string): React.ReactNode => {
    if (Array.isArray(node)) return React.Children.map(node, (n) => injectSearchProp(n, q));

    if (!React.isValidElement(node)) return node;

    const el = node as React.ReactElement<any>;
    
    // Handle Suspense by injecting into its children
    if (el.type === React.Suspense) {
      const inner = (el.props as any)?.children;
      return React.cloneElement(el, {}, injectSearchProp(inner, q) as any);
    }
    
    // Only inject searchQuery into custom components (not DOM elements)
    // DOM elements have string types like "div", "span", etc.
    if (typeof el.type === 'string') {
      return node;
    }
    
    return React.cloneElement(el, { searchQuery: q });
  };

  return (
    <div className="min-h-screen flex bg-[#03091F]">
      {/* Sidebar */}
      <div
        className={`w-64 bg-[#14112E] text-white flex flex-col fixed top-0 left-0 h-screen z-20 transition-transform duration-300 ease-in-out overflow-y-auto ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="p-3 flex items-start justify-start">
          <Link href={role === "agent" ? "/agent/dashboard" : "/university/dashboard"}>
            <img
              src="/logo/logo1.png"
              alt="AEGA Logo"
              className="w-50 h-auto ml-2 brightness-140 contrast-125"
            />
          </Link>
        </div>

        {/* Top Navigation */}
        <nav className="px-4 mt-3">
          <ul className="space-y-3">
            {topNavigationItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 transition-colors ${
                    pathname === item.href
                      ? "bg-[#F68E2D] text-white"
                      : "text-white/80 hover:bg-[#F68E2D] hover:text-white"
                  }`}
                >
                  <span className={`w-6 h-6 flex items-center justify-center ${
                    pathname === item.href ? "text-white" : ""
                  }`}>
                    <item.icon />
                  </span>
                  <span className="text-sm">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Spacer */}
        <div className="flex-1 hidden md:block"></div>

        {/* Bottom Navigation */}
        <nav className="px-4 pb-4">
          <ul className="space-y-1">
            {bottomNavigationItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    pathname === item.href
                      ? "bg-white/10 text-white"
                      : "text-white/80 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className={`w-6 h-6 flex items-center justify-center ${
                    pathname === item.href ? "text-white" : ""
                  }`}>
                    <item.icon />
                  </span>
                  <span className="text-sm">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 w-full text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors mt-3"
          >
            <span className="w-4 h-4 flex items-center justify-center">
              <LogoutIcon />
            </span>
            <span className="text-sm">Logout</span>
          </button>
        </nav>
      </div>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-10 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen ml-0 md:ml-64">
        {/* Header */}
        <header className="bg-[#14112E] text-white px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          {/* Hamburger button (mobile only) */}
          <button
            className="md:hidden mr-4 text-white"
            onClick={toggleSidebar}
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M3 12H21M3 6H21M3 18H21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Search */}
          <div className="flex-1 max-w-[250px] relative bg-white/30">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A0AEC0]" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-transparent rounded-full ml-2 text-[#A0AEC0] placeholder-white/30 focus:outline-none focus:ring-0 border-none"
              style={{
                border: "none",
                background: "transparent",
                boxShadow: "none",
              }}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              className="p-0 hover:bg-white/10 rounded"
              onClick={() => router.push(`/${role}/help-center`)}
            >
              <NotificationsIcon className="w-8 h-8" />
            </button>
            <button
              className="p-0 hover:bg-white/10 rounded"
              onClick={() => router.push(`/${role}/profile`)}
            >
              <ProfileIcon className="w-6 h-6" />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {searchEnabledRoutes.includes(pathname)
              ? injectSearchProp(children, searchQuery)
              : children}
          </div>

          {/* Bottom Footer */}
          <footer className="bg-[#03091F] border-t border-white/10 px-6 py-4">
            <div className="flex items-center gap-6 text-sm text-white/60">
              <Link 
                href={`/${role}/privacy-policy`}
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <span className="text-white/30">•</span>
              <Link 
                href={`/${role}/terms-of-use`}
                className="hover:text-white transition-colors"
              >
                Terms of Use
              </Link>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
