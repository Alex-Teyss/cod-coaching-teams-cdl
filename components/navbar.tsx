"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useSession, signOut } from "@/lib/auth-client"
import { Menu } from "lucide-react"
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

export function Navbar() {
  const { data: session } = useSession()
  const [open, setOpen] = React.useState(false)

  // Get the appropriate dashboard route based on user role
  const dashboardRoute = React.useMemo(() => {
    return getDashboardRoute(session?.user?.role)
  }, [session?.user?.role])

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

      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-screen-2xl items-center px-4">
        {/* Logo */}
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2" aria-label="Retour à l'accueil">
            <span className="font-bold text-xl">Cod Coaching Teams</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="hidden md:flex items-center" aria-label="Navigation principale">
            <NavigationMenu>
              <NavigationMenuList>
                {session && (
                  <NavigationMenuItem>
                    <Link href={dashboardRoute} legacyBehavior passHref>
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        Dashboard
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                )}
                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="#about"
                    className={navigationMenuTriggerStyle()}
                    onClick={(e) => scrollToSection(e, "#about")}
                  >
                    About
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="#features"
                    className={navigationMenuTriggerStyle()}
                    onClick={(e) => scrollToSection(e, "#features")}
                  >
                    Features
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="#contact"
                    className={navigationMenuTriggerStyle()}
                    onClick={(e) => scrollToSection(e, "#contact")}
                  >
                    Contact
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-2">
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    {session.user.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    {getRoleDisplayName(session.user.role)}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Se déconnecter
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
                  <Button size="sm">S&apos;inscrire</Button>
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
              <div className="flex flex-col gap-4 mt-8">
                {session && (
                  <Link
                    href={dashboardRoute}
                    className="text-foreground/70 hover:text-foreground transition-colors text-lg font-medium"
                    onClick={() => setOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}
                <a
                  href="#about"
                  className="text-foreground/70 hover:text-foreground transition-colors text-lg font-medium"
                  onClick={(e) => scrollToSection(e, "#about")}
                >
                  About
                </a>
                <a
                  href="#features"
                  className="text-foreground/70 hover:text-foreground transition-colors text-lg font-medium"
                  onClick={(e) => scrollToSection(e, "#features")}
                >
                  Features
                </a>
                <a
                  href="#contact"
                  className="text-foreground/70 hover:text-foreground transition-colors text-lg font-medium"
                  onClick={(e) => scrollToSection(e, "#contact")}
                >
                  Contact
                </a>

                <div className="mt-8 pt-6 border-t border-border">
                  <div className="mb-6">
                    <ThemeToggleButton className="w-full justify-start" />
                  </div>
                  {session ? (
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Connecté en tant que
                        </p>
                        <p className="font-medium text-foreground">
                          {session.user.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {getRoleDisplayName(session.user.role)}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          handleLogout()
                          setOpen(false)
                        }}
                      >
                        Se déconnecter
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <Link href="/login" onClick={() => setOpen(false)}>
                        <Button variant="outline" className="w-full">
                          Se connecter
                        </Button>
                      </Link>
                      <Link href="/signup" onClick={() => setOpen(false)}>
                        <Button className="w-full">S&apos;inscrire</Button>
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
