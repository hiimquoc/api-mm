"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Github, Search, Code2, BarChart2 } from "lucide-react"

export default function LandingPage() {
  const { status } = useSession()

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Github className="h-8 w-8 text-gray-900" />
          <span className="text-xl font-bold">GitHub Research</span>
        </div>
        <div className="flex items-center space-x-4">
          {status === "authenticated" ? (
            <Link href="/dashboard">
              <Button>
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link href="/signup">
                <Button>Sign up</Button>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Research GitHub Like Never Before
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Unlock powerful insights into GitHub repositories, contributors, and trends with our advanced research tools.
          </p>
          {status === "authenticated" ? (
            <Link href="/dashboard">
              <Button size="lg" className="text-lg">
                Go to Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          ) : (
            <Link href="/signup">
              <Button size="lg" className="text-lg">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          )}
        </div>

        {/* Features Section */}
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <div className="p-6 rounded-lg bg-white shadow-sm">
            <Search className="h-8 w-8 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Advanced Search</h3>
            <p className="text-gray-600">
              Find repositories, users, and code with precision using our powerful search capabilities.
            </p>
          </div>
          <div className="p-6 rounded-lg bg-white shadow-sm">
            <Code2 className="h-8 w-8 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">API Access</h3>
            <p className="text-gray-600">
              Access GitHub data programmatically with our easy-to-use API endpoints.
            </p>
          </div>
          <div className="p-6 rounded-lg bg-white shadow-sm">
            <BarChart2 className="h-8 w-8 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Analytics</h3>
            <p className="text-gray-600">
              Get insights into repository activity, contributor patterns, and more.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-16 border-t">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Github className="h-6 w-6 text-gray-900" />
            <span className="text-sm text-gray-600">© 2024 GitHub Research</span>
          </div>
          <div className="flex space-x-4">
            <Link href="/privacy" className="text-sm text-gray-600 hover:text-gray-900">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-gray-600 hover:text-gray-900">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
