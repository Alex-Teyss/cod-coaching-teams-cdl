"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useSession, signOut } from "@/lib/auth-client"
import { Menu, LayoutDashboard, Info, Zap, MessageCircle, LogOut, User } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getDashboardRoute, getRoleDisplayName } from "@/lib/role-redirect"
import { ThemeToggleButton } from "@/components/ui/shadcn-io/theme-toggle-button"
import { NotificationBadge } from "@/components/notification-badge"

export function Navbar() {
  const { data: session } = useSession()
  const [open, setOpen] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)

  // Get the appropriate dashboard route based on user role
  const dashboardRoute = React.useMemo(() => {
    return getDashboardRoute(session?.user?.role)
  }, [session?.user?.role])

  // Handle scroll event for navbar animation
  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = async () => {
    await signOut()
  }

  const scrollToSection = React.useCallback((e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault()
    const element = document.querySelector(sectionId)
    if (element) {
      const offset = 80 // Height of navbar + padding
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.scrollY - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      })
    }
    setOpen(false)
  }, [])

  return (
    <>
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
      >
        Aller au contenu principal
      </a>

      <header className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-border/60 bg-background/80 backdrop-blur-xl shadow-lg shadow-black/5 dark:shadow-black/20"
          : "border-b border-border/40 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60"
      )}>
        <div className={cn(
          "container flex max-w-screen-2xl items-center px-4 transition-all duration-300",
          scrolled ? "h-14" : "h-16"
        )}>
        {/* Logo */}
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2 transition-all hover:scale-105" aria-label="Retour à l'accueil">
            <span className={cn(
              "font-bold transition-all duration-300",
              scrolled ? "text-lg" : "text-xl"
            )}>
              Cod Coaching Teams
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="flex flex-1 items-center justify-end gap-4">
          <nav className="hidden md:flex items-center" aria-label="Navigation principale">
            <NavigationMenu>
              <NavigationMenuList className="gap-1">
                {session && (
                  <NavigationMenuItem>
                    <Link href={dashboardRoute} className={cn(navigationMenuTriggerStyle(), "!bg-transparent hover:!bg-accent relative")}>
                      <LayoutDashboard className="size-4" />
                      <span>Dashboard</span>
                      <NotificationBadge />
                    </Link>
                  </NavigationMenuItem>
                )}
                <NavigationMenuItem>
                  <Link
                    href="#about"
                    className={cn(navigationMenuTriggerStyle(), "!bg-transparent hover:!bg-accent")}
                    onClick={(e) => scrollToSection(e, "#about")}
                  >
                    <Info className="size-4" />
                    <span>About</span>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link
                    href="#features"
                    className={cn(navigationMenuTriggerStyle(), "!bg-transparent hover:!bg-accent")}
                    onClick={(e) => scrollToSection(e, "#features")}
                  >
                    <Zap className="size-4" />
                    <span>Features</span>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link
                    href="/contact"
                    className={cn(navigationMenuTriggerStyle(), "!bg-transparent hover:!bg-accent")}
                  >
                    <MessageCircle className="size-4" />
                    <span>Contact</span>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-2">
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="size-4 shrink-0" />
                    <span>{session.user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="flex flex-col">
                    <span className="font-medium">{session.user.name}</span>
                    <span className="text-xs text-muted-foreground">{getRoleDisplayName(session.user.role)}</span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="gap-2 text-destructive focus:text-destructive">
                    <LogOut className="size-4 shrink-0" />
                    <span>Se déconnecter</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Se connecter
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="ghost" size="sm" className="!bg-transparent hover:!bg-accent">
                    S&apos;inscrire
                  </Button>
                </Link>
              </>
            )}
            <ThemeToggleButton />
          </div>

          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Ouvrir le menu de navigation">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Ouvrir le menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-2 mt-8">
                {session && (
                  <Link
                    href={dashboardRoute}
                    className="flex items-center gap-3 text-foreground/70 hover:text-foreground transition-all text-lg font-medium px-3 py-2 rounded-md hover:bg-accent relative"
                    onClick={() => setOpen(false)}
                  >
                    <LayoutDashboard className="size-5" />
                    Dashboard
                    <NotificationBadge />
                  </Link>
                )}
                <a
                  href="#about"
                  className="flex items-center gap-3 text-foreground/70 hover:text-foreground transition-all text-lg font-medium px-3 py-2 rounded-md hover:bg-accent"
                  onClick={(e) => scrollToSection(e, "#about")}
                >
                  <Info className="size-5" />
                  About
                </a>
                <a
                  href="#features"
                  className="flex items-center gap-3 text-foreground/70 hover:text-foreground transition-all text-lg font-medium px-3 py-2 rounded-md hover:bg-accent"
                  onClick={(e) => scrollToSection(e, "#features")}
                >
                  <Zap className="size-5" />
                  Features
                </a>
                <Link
                  href="/contact"
                  className="flex items-center gap-3 text-foreground/70 hover:text-foreground transition-all text-lg font-medium px-3 py-2 rounded-md hover:bg-accent"
                  onClick={() => setOpen(false)}
                >
                  <MessageCircle className="size-5" />
                  Contact
                </Link>

                <div className="mt-8 pt-6 border-t border-border">
                  <div className="mb-6">
                    <ThemeToggleButton className="w-full justify-start" />
                  </div>
                  {session ? (
                    <div className="space-y-4">
                      <div className="px-3 py-2 rounded-lg bg-accent/50">
                        <p className="text-xs text-muted-foreground mb-1">
                          Connecté en tant que
                        </p>
                        <p className="font-medium text-foreground flex items-center gap-2">
                          <User className="size-4" />
                          {session.user.name}
                        </p>
                        <p className="text-sm text-muted-foreground ml-6">
                          {getRoleDisplayName(session.user.role)}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => {
                          handleLogout()
                          setOpen(false)
                        }}
                      >
                        <LogOut className="size-4" />
                        Se déconnecter
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <Link href="/login" onClick={() => setOpen(false)}>
                        <Button variant="ghost" className="w-full">
                          Se connecter
                        </Button>
                      </Link>
                      <Link href="/signup" onClick={() => setOpen(false)}>
                        <Button variant="ghost" className="w-full bg-primary/10 hover:bg-primary/20">
                          S&apos;inscrire
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      </header>
    </>
  )
}
