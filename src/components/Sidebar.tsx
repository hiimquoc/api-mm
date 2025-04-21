"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Home,
  Code2,
  Sparkles,
  User,
  FileText,
  ChevronDown,
  LogOut,
  Menu,
} from 'lucide-react'
import { toast } from 'sonner'
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  isExternal?: boolean
  hasSubmenu?: boolean
}

const navItems: NavItem[] = [
  {
    label: 'Overview',
    href: '/',
    icon: <Home className="h-4 w-4" />,
  },
  {
    label: 'API Playground',
    href: '/playground',
    icon: <Code2 className="h-4 w-4" />,
  },
  {
    label: 'Use Cases',
    href: '/use-cases',
    icon: <Sparkles className="h-4 w-4" />,
  },
  {
    label: 'My Account',
    href: '/account',
    icon: <User className="h-4 w-4" />,
    hasSubmenu: true,
  },
  {
    label: 'Documentation',
    href: '/docs',
    icon: <FileText className="h-4 w-4" />,
    isExternal: true,
  },
]

function UserAvatar({ name, image }: { name: string; image?: string | null }) {
  const initials = name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <Avatar>
      <AvatarImage src={image || ''} alt={name} />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  )
}

function SidebarContent() {
  const pathname = usePathname()
  const selectedAccount = 'Personal'
  const { data: session } = useSession()
  const userName = session?.user?.name || 'User'
  const userImage = session?.user?.image

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: '/login' });
      toast.success("Signed Out", {
        description: "You have been signed out successfully.",
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error("Error", {
        description: "Failed to sign out. Please try again.",
      });
    }
  }

  return (
    <div className="flex flex-col h-full p-4 space-y-8">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <div className="relative w-8 h-8">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 bg-blue-500 transform rotate-45" />
            <div className="absolute w-4 h-4 bg-red-500 transform -rotate-45" />
            <div className="absolute w-4 h-1 bg-yellow-500 ml-4" />
          </div>
        </div>
        <span className="text-xl font-semibold">tavily</span>
      </Link>

      {/* Account Selector */}
      <div className="w-full">
        <Button
          variant="ghost"
          className="w-full justify-between bg-blue-50 hover:bg-blue-100 rounded-lg p-3"
        >
          <div className="flex items-center gap-2">
            <UserAvatar name={userName} image={userImage} />
            <span className="text-blue-600">{selectedAccount}</span>
          </div>
          <ChevronDown className="h-4 w-4 text-blue-600" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-gray-500 hover:text-gray-900 group",
              pathname === item.href && "text-gray-900 bg-gray-100",
              "transition-colors"
            )}
          >
            {item.icon}
            <span className="flex-1">{item.label}</span>
            {item.hasSubmenu && (
              <ChevronDown className="h-4 w-4" />
            )}
            {item.isExternal && (
              <FileText className="h-4 w-4" />
            )}
          </Link>
        ))}
      </nav>

      {/* User Profile */}
      <div className="pt-4 border-t">
        <div className="flex items-center gap-3 px-3">
          <UserAvatar name={userName} image={userImage} />
          <div className="flex-1 flex items-center justify-between">
            <div className="font-medium">{userName}</div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-auto p-0 text-gray-500 hover:text-gray-900"
              onClick={handleSignOut}
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Sidebar() {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col h-screen border-r">
        <SidebarContent />
      </aside>

      {/* Mobile Menu */}
      <div className="md:hidden fixed top-0 left-0 right-0 p-4 flex items-center justify-between bg-white border-b z-50">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 bg-blue-500 transform rotate-45" />
              <div className="absolute w-4 h-4 bg-red-500 transform -rotate-45" />
              <div className="absolute w-4 h-1 bg-yellow-500 ml-4" />
            </div>
          </div>
          <span className="text-xl font-semibold">tavily</span>
        </Link>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Mobile Content Padding */}
      <div className="h-[72px] md:hidden" />
    </>
  )
} 