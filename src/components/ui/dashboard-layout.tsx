"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "react-hot-toast";
import { getStoredUserData, getAuthToken } from "@/lib/api";

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
  CertificateIcon,
  StudentManagementIcon,
  UniManagementIcon,
  OfficeIcon,
  RevenueIcon,
  LeaveManagementIcon
} from "../ui/icons";

type SvgIcon = React.ComponentType<React.SVGProps<SVGSVGElement>>;
type IconLike = SvgIcon | (() => SvgIcon);

type NavItem = {
  icon: IconLike;
  label: string;
  href: string;
};

type DashboardLayoutProps = {
  children: React.ReactNode;
  role: "agent" | "university";
};

type StoredUser = {
  name?: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  businessType?: "b2b" | "b2c" | null;
  universityName?: string;
} | null;

const resolveIcon = (icon: IconLike): SvgIcon => {
  try {
    const maybeFactoryResult = (icon as () => SvgIcon)();
    if (typeof maybeFactoryResult === "function") {
      return maybeFactoryResult;
    }
  } catch {
    // not a factory, ignore
  }
  return icon as SvgIcon;
};

const agentTopNav: NavItem[] = [
  { icon: DashboardIcon, label: "Dashboard", href: "/agent/dashboard" },
  { icon: OfficeIcon, label: "Company Management", href: "/agent/company-management" },
  { icon: AgentManagementIcon, label: "Agent Management", href: "/agent/agent-management" },
  { icon: UniManagementIcon, label: "Uni Management", href: "/agent/university-management" },
  { icon: OfficeIcon, label: "Office", href: "/agent/office-management" },
  { icon: RevenueIcon, label: "Revenue", href: "/agent/revenue" },
  { icon: LeaveManagementIcon, label: "Leave Management", href: "/agent/leave-management" },
  { icon: CDPIcon, label: "CDP Training", href: "/agent/CDP" },
  { icon: ComplianceIcon, label: "Compliances", href: "/agent/compliances" },
  { icon: AuditsIcon, label: "Audits", href: "/agent/audits" },
];

const universityTopNav: NavItem[] = [
  { icon: DashboardIcon, label: "Dashboard", href: "/university/dashboard" },
  { icon: AgentManagementIcon, label: "Agent Management", href: "/university/agentManagement" },
  { icon: CDPIcon, label: "CDP Training", href: "/university/CDP" },
  { icon: ComplianceIcon, label: "Compliances", href: "/university/compliances" },
  { icon: AuditsIcon, label: "Audits", href: "/university/audits" },
];

const agentBottomNav: NavItem[] = [];

const universityBottomNav: NavItem[] = [
  { icon: HelpIcon, label: "Help Center", href: "/university/help-center" },
  { icon: PasswordIcon, label: "Password & Security", href: "/university/password" },
];

const parseBusinessTypeFromToken = (token: string | null): "b2b" | "b2c" | null => {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const paddedPayload = normalizedPayload.padEnd(
      normalizedPayload.length + ((4 - (normalizedPayload.length % 4)) % 4),
      "="
    );
    const decodedPayload = atob(paddedPayload);
    const parsed = JSON.parse(decodedPayload) as { businessType?: "b2b" | "b2c" };
    return parsed.businessType ?? null;
  } catch {
    return null;
  }
};

const DashboardLayout = ({ children, role }: DashboardLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [userState, setUserState] = useState<StoredUser>(null);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchRef = useRef<HTMLDivElement>(null);

  const businessType = userState?.businessType ?? null;
  const topNavigationItems = role === "agent"
    ? agentTopNav.filter((item) => !(businessType === "b2c" && item.label === "Company Management"))
    : universityTopNav;
  const bottomNavigationItems = role === "agent" ? agentBottomNav : universityBottomNav;

  const handleLogout = () => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
        localStorage.removeItem("userRole");
        sessionStorage.clear();
      }
      toast.success("Successfully logged out!", {
        duration: 3000,
        style: { background: "#fff", color: "#2A020D", fontWeight: "bold" },
      });
      setTimeout(() => { router.push(`/login`); }, 500);
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Error during logout. Please try again.");
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isSidebarOpen]);

  useEffect(() => {
    const closeMenu = (e: MouseEvent) => {
      setIsProfileMenuOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
    };
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, []);

  // Set Dynamic Role-based Browser Tab Title
  useEffect(() => {
    const allItems = [...topNavigationItems, ...bottomNavigationItems];
    const match = allItems.find(item => item.href === pathname);

    let label = "Dashboard";
    if (match) {
      label = match.label;
    } else {
      if (pathname.includes("/profile")) label = "Profile";
      else if (pathname.includes("/certifications")) label = "Certifications";
      else if (pathname.includes("/password")) label = "Password & Security";
      else if (pathname.includes("/help-center")) label = "Help Center";
      else if (pathname.includes("/agent-management") || pathname.includes("/agentManagement")) label = "Agent Management";
      else if (pathname.includes("/student-management")) label = "Student Management";
      else if (pathname.includes("/office-management")) label = "Office Management";
      else if (pathname.includes("/revenue")) label = "Revenue";
      else if (pathname.includes("/leave-management")) label = "Leave Management";
      else if (pathname.includes("/university-management")) label = "University Management";
      else if (pathname.includes("/CDP")) label = "CDP Training";
      else if (pathname.includes("/compliances")) label = "Compliances";
      else if (pathname.includes("/audits")) label = "Audits";
    }

    const token = typeof window !== "undefined" ? getAuthToken() : null;
    const userRole = userState?.role || (role === "agent" ? "agent" : "university");
    const bizType = userState?.businessType || parseBusinessTypeFromToken(token);

    let platformPrefix = "B2B";
    if (userRole === "counsellor") {
      platformPrefix = "Counsellor";
    } else if (userRole === "university") {
      platformPrefix = "University";
    } else if (bizType === "b2c" || pathname.includes("/public") || pathname.includes("/student")) {
      platformPrefix = "B2C";
    } else {
      platformPrefix = "B2B";
    }

    document.title = `${platformPrefix} | ${label}`;
  }, [pathname, topNavigationItems, bottomNavigationItems, userState, role]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = getAuthToken();
    const storedUser = getStoredUserData();

    if (!token || !storedUser) {
      router.push("/login");
      return;
    }

    const storedUserRole = storedUser.role as string;
    const isRoleMatch = storedUserRole === role || (role === 'agent' && storedUserRole === 'counsellor');

    if (!isRoleMatch) {
      const targetRole = storedUserRole === 'counsellor' ? 'agent' : (storedUserRole === 'admin' ? 'agent' : storedUserRole);
      router.push(`/${targetRole}/dashboard`);
      return;
    }

    setUserState(storedUser);
  }, [role, router]);

  useEffect(() => {
    const fetchHeaderProfile = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        if (role === "agent") {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/profile/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.ok) {
            const data = await response.json();
            if (data.profileImage) {
              setProfilePic(`${process.env.NEXT_PUBLIC_ANTRYK_BASE_URL}/${data.profileImage}`);
            } else {
              setProfilePic(null);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch header profile pic:", err);
      }
    };
    fetchHeaderProfile();
  }, [role, pathname]);

  // Global Dynamic Search Handler
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      setShowSearchDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const token = getAuthToken();
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/dashboard/search?q=${encodeURIComponent(searchQuery)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setSearchResults(data.data);
            setShowSearchDropdown(true);
          }
        }
      } catch (err) {
        console.error("Dashboard search failed:", err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Format Display Full Name
  const getDisplayFullName = () => {
    if (!userState) return "User Profile";
    if (userState.fullName) return userState.fullName;
    const combined = `${userState.firstName || ''} ${userState.lastName || ''}`.trim();
    if (combined) return combined;
    if (userState.name) return userState.name;
    if (userState.universityName) return userState.universityName;
    if (userState.email) return userState.email.split('@')[0];
    return "User Profile";
  };

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
    if (el.type === React.Suspense) {
      const inner = (el.props as any)?.children;
      return React.cloneElement(el, {}, injectSearchProp(inner, q) as any);
    }
    if (typeof el.type === 'string') return node;
    return React.cloneElement(el, { searchQuery: q });
  };

  const displayName = getDisplayFullName();

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
            {topNavigationItems.map((item) => {
              const Icon = resolveIcon(item.icon);
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-2 transition-colors ${
                      pathname === item.href
                        ? "bg-[#F68E2D] text-white"
                        : "text-white/80 hover:bg-[#F68E2D] hover:text-white"
                    }`}
                  >
                    <span className={`w-6 h-6 flex items-center justify-center ${pathname === item.href ? "text-white" : ""}`}>
                      <Icon />
                    </span>
                    <span className="text-sm">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex-1 hidden md:block"></div>

        {/* Bottom Navigation */}
        <nav className="px-4 pb-4">
          <ul className="space-y-1">
            {bottomNavigationItems.map((item) => {
              const Icon = resolveIcon(item.icon);
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      pathname === item.href
                        ? "bg-white/10 text-white"
                        : "text-white/80 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span className={`w-6 h-6 flex items-center justify-center ${pathname === item.href ? "text-white" : ""}`}>
                      <Icon />
                    </span>
                    <span className="text-sm">{item.label}</span>
                  </Link>
                </li>
              );
            })}
            <li>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-3 py-2 rounded-lg text-white/80 hover:bg-white/5 hover:text-white transition-colors text-left cursor-pointer"
              >
                <span className="w-6 h-6 flex items-center justify-center text-white/80">
                  <LogoutIcon />
                </span>
                <span className="text-sm">Logout</span>
              </button>
            </li>
          </ul>
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

          {/* Dynamic Global Search Bar & Results Dropdown Overlay */}
          <div className="flex-1 max-w-[320px] relative" ref={searchRef}>
            <div className="relative flex items-center bg-white/10 rounded-full px-3 py-1.5 border border-white/15 focus-within:border-[#F68E2D] transition-colors">
              <SearchIcon className="text-[#A0AEC0] w-4 h-4 shrink-0" />
              <input
                type="text"
                placeholder="Search agents, unis, courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => { if (searchResults) setShowSearchDropdown(true); }}
                className="w-full pl-2.5 pr-2 text-xs text-white placeholder-white/40 bg-transparent outline-none border-none"
              />
              {isSearching && <span className="text-[10px] text-[#F68E2D] animate-pulse shrink-0">...</span>}
            </div>

            {/* LIVE SEARCH RESULTS OVERLAY */}
            {showSearchDropdown && searchResults && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#14112E] border border-white/20 rounded-xl shadow-2xl p-4 z-50 max-h-96 overflow-y-auto space-y-4 text-xs text-white">
                {/* Agents */}
                {searchResults.agents?.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-bold text-[#F68E2D] uppercase tracking-wider mb-1">Agents ({searchResults.agents.length})</h4>
                    <div className="space-y-1">
                      {searchResults.agents.map((a: any) => (
                        <div
                          key={a._id}
                          onClick={() => {
                            setShowSearchDropdown(false);
                            router.push(`/${role}/agent-management`);
                          }}
                          className="p-2 bg-white/5 hover:bg-white/10 rounded cursor-pointer transition-colors"
                        >
                          <p className="font-bold">{a.firstName} {a.lastName}</p>
                          <p className="text-[10px] text-white/60">{a.email} • {a.country || 'Global'}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Universities */}
                {searchResults.universities?.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-bold text-[#F68E2D] uppercase tracking-wider mb-1">Universities ({searchResults.universities.length})</h4>
                    <div className="space-y-1">
                      {searchResults.universities.map((u: any) => (
                        <div
                          key={u._id}
                          onClick={() => {
                            setShowSearchDropdown(false);
                            router.push(`/${role}/university-management`);
                          }}
                          className="p-2 bg-white/5 hover:bg-white/10 rounded cursor-pointer transition-colors"
                        >
                          <p className="font-bold">{u.universityName}</p>
                          <p className="text-[10px] text-white/60">{u.email} • {u.country || 'UK'}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* CDP Courses */}
                {searchResults.courses?.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-bold text-[#F68E2D] uppercase tracking-wider mb-1">CDP Courses ({searchResults.courses.length})</h4>
                    <div className="space-y-1">
                      {searchResults.courses.map((c: any) => (
                        <div
                          key={c._id}
                          onClick={() => {
                            setShowSearchDropdown(false);
                            router.push(`/${role}/CDP`);
                          }}
                          className="p-2 bg-white/5 hover:bg-white/10 rounded cursor-pointer transition-colors"
                        >
                          <p className="font-bold">{c.courseName}</p>
                          <p className="text-[10px] text-white/60">{c.modules} Modules • {c.timeInHr} Hours</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(!searchResults.agents?.length && !searchResults.universities?.length && !searchResults.courses?.length) && (
                  <p className="text-center text-white/60 py-2">No matching results found.</p>
                )}
              </div>
            )}
          </div>

          {/* Actions & Display Full Name */}
          <div className="flex items-center gap-4">
            <button
              className="p-0 hover:bg-white/10 rounded cursor-pointer"
              onClick={() => router.push(`/${role}/help-center`)}
            >
              <NotificationsIcon className="w-8 h-8" />
            </button>

            {/* User Full Name & Avatar Header Button */}
            <div className="relative">
              <button
                className="p-1 hover:bg-white/10 rounded-full flex items-center gap-2.5 focus:outline-none cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleProfileMenu();
                }}
              >
                <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-white/10 border border-white/20">
                  {profilePic ? (
                    <img src={profilePic} alt="User Profile" className="w-full h-full object-cover" />
                  ) : (
                    <ProfileIcon className="w-5 h-5 text-white/80" />
                  )}
                </div>
                {/* Full Name Display */}
                <span className="hidden sm:inline-block font-semibold text-xs text-white max-w-[140px] truncate">
                  {displayName}
                </span>
              </button>

              {isProfileMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-[#14112E] border border-white/10 rounded-lg shadow-2xl py-2 z-20"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="px-4 py-2 border-b border-white/10 mb-1">
                    <p className="font-bold text-xs text-white truncate">{displayName}</p>
                    <p className="text-[10px] text-white/60 capitalize">{userState?.role || role}</p>
                  </div>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      router.push(`/${role}/profile`);
                    }}
                  >
                    Profile
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      router.push(`/${role}/certifications`);
                    }}
                  >
                    Certifications
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors cursor-pointer"
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      handleLogout();
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto flex flex-col">
          <div className="p-6 flex-1">
            {searchEnabledRoutes.includes(pathname)
              ? injectSearchProp(children, searchQuery)
              : children}
          </div>

          {/* Bottom Footer */}
          <footer className="bg-[#03091F] border-t border-white/10 px-6 py-4 mt-auto">
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
