"use client";

import { Sidebar, SidebarItem } from "./sidebar";
import { LayoutDashboard, Users, Mail, User } from "lucide-react";

const playerItems: SidebarItem[] = [
  {
    title: "Dashboard",
    href: "/player/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Mon équipe",
    href: "/player/team",
    icon: Users,
  },
  {
    title: "Invitations",
    href: "/player/invitations",
    icon: Mail,
  },
  {
    title: "Profil",
    href: "/player/profile",
    icon: User,
  },
];

interface PlayerSidebarProps {
  userName?: string;
}

export function PlayerSidebar({ userName }: PlayerSidebarProps) {
  return <Sidebar items={playerItems} userName={userName} userRole="Joueur" />;
}
