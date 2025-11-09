"use client";

import { Sidebar, SidebarItem } from "./sidebar";
import { LayoutDashboard, Users, Shield, Settings, User } from "lucide-react";

const adminItems: SidebarItem[] = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Équipes",
    href: "/admin/teams",
    icon: Shield,
  },
  {
    title: "Utilisateurs",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Profil",
    href: "/admin/profile",
    icon: User,
  },
  {
    title: "Paramètres",
    href: "/admin/settings",
    icon: Settings,
  },
];

interface AdminSidebarProps {
  userName?: string;
}

export function AdminSidebar({ userName }: AdminSidebarProps) {
  return <Sidebar items={adminItems} userName={userName} userRole="Admin" />;
}
