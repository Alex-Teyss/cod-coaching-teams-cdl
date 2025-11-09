import { Sidebar, SidebarItem } from "./sidebar";
import { LayoutDashboard, Users, Mail, PlusCircle } from "lucide-react";

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
    title: "Créer une équipe",
    href: "/coach/teams/new",
    icon: PlusCircle,
  },
  {
    title: "Invitations",
    href: "/coach/invitations",
    icon: Mail,
  },
];

interface CoachSidebarProps {
  userName?: string;
}

export function CoachSidebar({ userName }: CoachSidebarProps) {
  return <Sidebar items={coachItems} userName={userName} userRole="Coach" />;
}
