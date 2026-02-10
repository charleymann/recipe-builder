import type { Metadata } from 'next'
import './globals.css'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Recipe Builder - Your Fun Kitchen Companion!',
  description: 'Build, discover, and share amazing recipes for the whole family!',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en">
      <body className="font-sans">
        <nav className="bg-white shadow-lg sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-3xl">🍳</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  Recipe Builder
                </span>
              </Link>

              <div className="flex items-center space-x-4">
                {session ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="text-primary-600 hover:text-primary-800 font-semibold"
                    >
                      Dashboard
                    </Link>
                    {session.user && (session.user as any).role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        className="text-secondary-600 hover:text-secondary-800 font-semibold"
                      >
                        Admin
                      </Link>
                    )}
                    <span className="text-gray-600">
                      Hi, {session.user?.name || 'Chef'}!
                    </span>
                    <Link
                      href="/api/auth/signout"
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Sign Out
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="text-primary-600 hover:text-primary-800 font-semibold"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="btn-primary"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>
        <main className="min-h-screen">{children}</main>
        <footer className="bg-white border-t border-gray-200 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-gray-600">
              <p className="text-lg font-semibold text-primary-600 mb-2">
                🍳 Recipe Builder - Making Cooking Fun for Everyone! 🌟
              </p>
              <p className="text-sm">
                Built with love for families and food enthusiasts everywhere
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
