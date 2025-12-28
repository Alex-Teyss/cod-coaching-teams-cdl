"use client";

import { Sidebar, SidebarItem } from "./sidebar";
import { LayoutDashboard, Users, Mail, User, Sparkles, Trophy } from "lucide-react";

const coachItems: SidebarItem[] = [
  {
    title: "Dashboard",
    href: "/coach/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Mes équipes",
    href: "/coach/teams",
    icon: Users,
  },
  {
    title: "IA - Analyse",
    href: "/coach/ai-analysis",
    icon: Sparkles,
  },
  {
    title: "Mes matchs",
    href: "/coach/matches",
    icon: Trophy,
  },
  {
    title: "Invitations",
    href: "/coach/invitations",
    icon: Mail,
  },
  {
    title: "Profil",
    href: "/coach/profile",
    icon: User,
  },
];

interface CoachSidebarProps {
  userName?: string;
}

export function CoachSidebar({ userName }: CoachSidebarProps) {
  return <Sidebar items={coachItems} userName={userName} userRole="Coach" />;
}
