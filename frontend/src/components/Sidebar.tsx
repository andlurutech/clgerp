"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./layout.module.css";

const modules = [
  { label: "Dashboard", href: "/dashboard", icon: "🏠" },
  { 
    label: "Admissions", icon: "📝",
    subModules: [
      { label: "CRM & Forms", href: "/dashboard/admissions/forms" },
      { label: "Verification", href: "/dashboard/admissions/verification" },
      { label: "ID Generation", href: "/dashboard/admissions/id-gen" }
    ]
  },
  { 
    label: "Academics", icon: "📚",
    subModules: [
      { label: "Curriculum", href: "/dashboard/academics/curriculum" },
      { label: "Timetable", href: "/dashboard/academics/timetable" },
      { label: "Attendance", href: "/dashboard/academics/attendance" }
    ]
  },
  { 
    label: "LMS", icon: "💻",
    subModules: [
      { label: "e-Content", href: "/dashboard/lms/content" },
      { label: "Assignments", href: "/dashboard/lms/assignments" },
      { label: "e-Assessments", href: "/dashboard/lms/assessments" }
    ]
  },
  { 
    label: "Examinations", icon: "📄",
    subModules: [
      { label: "Exam Scheduler", href: "/dashboard/exams/scheduler" },
      { label: "Evaluation", href: "/dashboard/exams/evaluation" },
      { label: "Results", href: "/dashboard/exams/results" }
    ]
  },
  { 
    label: "Student Finance", icon: "💰",
    subModules: [
      { label: "Fee Setup", href: "/dashboard/finance/setup" },
      { label: "Payments", href: "/dashboard/finance/payments" },
      { label: "Dues & Refunds", href: "/dashboard/finance/dues" }
    ]
  },
  { 
    label: "Placements", icon: "💼",
    subModules: [
      { label: "Organizations", href: "/dashboard/placements/orgs" },
      { label: "Opportunities", href: "/dashboard/placements/opportunities" },
      { label: "Status Tracking", href: "/dashboard/placements/tracking" }
    ]
  },
  { 
    label: "Campus Services", icon: "🏫",
    subModules: [
      { label: "Hostel & Canteen", href: "/dashboard/campus/hostel" },
      { label: "Gate Pass", href: "/dashboard/campus/gatepass" },
      { label: "Events & Clubs", href: "/dashboard/campus/events" }
    ]
  }
];

function NavItem({ item, pathname }: { item: any, pathname: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
  const hasSubModules = item.subModules && item.subModules.length > 0;

  if (!hasSubModules) {
    return (
      <Link href={item.href} className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}>
        <span className={styles.navIcon}>{item.icon}</span>
        <span className={styles.navLabel}>{item.label}</span>
      </Link>
    );
  }

  // Check if any sub module is active to keep accordion open
  const isSubActive = item.subModules.some((sub: any) => pathname.startsWith(sub.href));

  return (
    <div className={styles.navItemGroup}>
      <div 
        className={`${styles.navItem} ${isSubActive ? styles.navItemActive : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        style={{ cursor: 'pointer' }}
      >
        <span className={styles.navIcon}>{item.icon}</span>
        <span className={styles.navLabel} style={{ flex: 1 }}>{item.label}</span>
        <span style={{ fontSize: '0.8rem', opacity: 0.6, transform: isOpen || isSubActive ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
          ▼
        </span>
      </div>
      {(isOpen || isSubActive) && (
        <div className={styles.subMenu}>
          {item.subModules.map((sub: any) => {
            const isSubItemActive = pathname === sub.href;
            return (
              <Link 
                key={sub.href} 
                href={sub.href} 
                className={`${styles.subNavItem} ${isSubItemActive ? styles.subNavItemActive : ""}`}
              >
                {sub.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

import { THEME_CONFIG } from "@/config/theme";

export default function Sidebar() {
  const pathname = usePathname();
  const institutionName = THEME_CONFIG.institutionName;

  return (
    <div className={styles.sidebar} style={{ background: 'var(--sidebar-bg)' }}>
      <div className={styles.logoArea}>
        <div className={styles.logoIcon} style={{ background: 'var(--primary-accent)' }}>{THEME_CONFIG.logoText}</div>
        <div className={styles.logoText}>{institutionName}</div>
      </div>
      <div className={styles.navLinks}>
        {modules.map((item) => (
          <NavItem key={item.label} item={item} pathname={pathname} />
        ))}
      </div>
    </div>
  );
}
