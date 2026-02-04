"use client";

import Link from 'next/link';
import { useState } from 'react';
import { ChevronDown, ArrowDownRight} from 'lucide-react';

// Navigation data with dropdown items
const NAV_LINKS = [
  { label: "HOME", href: "/" },
  { label: "ABOUT US", href: "/about" },
  // { label: "GLOBAL IMPACT", href: "/global-impact" },
  {label: "FOR MEMBERS", href: "/members" },
  {/*{ 
    label: "FOR MEMBERS", 
    hasDropdown: true,
    dropdownItems: [
      { label: "Training", href: "/members/training" },
      { label: "Guidelines", href: "/members/guidelines" },
      { label: "Regulation & Compliance", href: "/members/regulation" },
      { label: "Range of Services", href: "/members/services" },
    ]
  },*/},
  {label:"FOR UNIVERSITY & SPONSORS", href:"/university"},
  {/*{ 
    label: "NEWS & EVENTS", 
    hasDropdown: true,
    dropdownItems: [
      { label: "Latest News", href: "/news/latest" },
      { label: "Upcoming Events", href: "/news/events" },
      { label: "Blogs", href: "/blogs" },
    ]
  },*/},
  {label:"NEWS & EVENTS", href:"/news"},
  { 
    label: "COMPLIANCES & COURSES", 
    hasDropdown: true,
    dropdownItems: [
      { label: "Compliance Guidelines", href: "/compliance/guidelines" },
      { label: "Training Courses", href: "/compliance/courses" },
      { label: "Certifications", href: "/compliance/certifications" },
    ]
  },
  { label: "POLICY", href: "/policy" },
  { 
    label: "FOR THE PUBLIC", 
    hasDropdown: true,
    dropdownItems: [
      { label: "Public", href: "/public" },
      { label: "Student Complaint Form", href: "/public/complaint" },
      // { label: "FAQs", href: "/public/faqs" },
    ]
  },
  { label: "CONTACT US", href: "/contact-us" },
];

// NavItem with dropdown support
const NavItem = ({ 
  label, 
  href,
  hasDropdown, 
  dropdownItems 
}: { 
  label: string;
  href?: string;
  hasDropdown?: boolean;
  dropdownItems?: { label: string; href: string }[];
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className="group relative h-full flex items-center px-3"
      onMouseEnter={() => hasDropdown && setIsOpen(true)}
      onMouseLeave={() => hasDropdown && setIsOpen(false)}
    >
      {/* Conditional rendering: Link only if no dropdown */}
      {!hasDropdown && href ? (
        <Link href={href} className="flex items-center gap-1 h-full">
          <span className="text-[9px] font-bold tracking-widest text-gray-200 group-hover:text-[#F58A07] transition-colors">
            {label}
          </span>
        </Link>
      ) : (
        <div className="flex items-center gap-1 h-full cursor-pointer">
          <span className="text-[9px] font-bold tracking-widest text-gray-200 group-hover:text-[#F58A07] transition-colors">
            {label}
            {hasDropdown && <ChevronDown className="w-3 h-3 stroke-3" />}
          </span>
        </div>
      )}
      
      {/* Hover Underline */}
      <span className="absolute bottom-[30%] left-3 right-3 h-0.5 bg-[#F58A07] opacity-0 group-hover:opacity-100 transition-all duration-300" />

      {/* Dropdown Menu */}
      {hasDropdown && dropdownItems && isOpen && (
        <div className="absolute top-full left-0 pt-4 z-50">
          <div className="bg-[#0F1A3A] border border-white/10 shadow-2xl min-w-[220px] py-2">
            {dropdownItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="block px-6 py-3 text-xs font-medium text-gray-300 hover:bg-[#1A2547] hover:text-[#F58A07] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default function Header() {
  return (
    <header className="w-full bg-[#03091F] h-[88px] px-8 md:px-12 flex items-center justify-between sticky top-0 z-50 border-b border-white/5">
      
      {/* LEFT: Logo */}
      <Link href="/" className="flex items-center shrink-0">
      <img 
        src="/logo.png" 
        alt="Agents & Educators Global Alliance" 
        className="h-12 w-auto"
      />
      </Link>

      {/* CENTER: Navigation */}
      <nav className="hidden xl:flex items-center gap-1 h-full">
      {NAV_LINKS.map((link) => (
        <NavItem 
        key={link.label} 
        label={link.label ?? ""}
        href={link.href}
        hasDropdown={link.hasDropdown} 
        dropdownItems={link.dropdownItems}
        />
      ))}
      </nav>

      {/* RIGHT: CTA Button */}
      <div className="hidden md:flex items-center shrink-0">
      <Link 
        href="/signup" 
        className="flex items-center gap-2 group pb-1 border-b border-white hover:border-[#F58A07] transition-colors"
      >
        <span className="text-white text-[11px] font-bold tracking-widest group-hover:text-[#F58A07] transition-colors">
        JOIN US NOW
        </span>
        <ArrowDownRight className="w-4 h-4 text-white group-hover:text-[#F58A07] transition-colors" />
      </Link>
      </div>
    </header>
  );
}
