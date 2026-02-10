import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-500 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-bounce">
            🍳 Welcome to Recipe Builder! 🌟
          </h1>
          <p className="text-xl md:text-2xl mb-8 leading-relaxed">
            Your magical kitchen companion that makes cooking fun, easy, and exciting!
            Whether you're just starting out or you're a seasoned chef, we've got
            delicious recipes waiting for you!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/register"
              className="bg-white text-primary-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-full text-lg shadow-2xl transition-all duration-200 transform hover:scale-110"
            >
              Start Your Cooking Adventure! 🚀
            </Link>
            <Link
              href="/login"
              className="bg-secondary-500 hover:bg-secondary-600 text-white font-bold py-4 px-8 rounded-full text-lg shadow-xl transition-all duration-200 transform hover:scale-110"
            >
              I Already Have an Account
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto py-16 px-4">
        <h2 className="text-4xl font-bold text-center text-primary-700 mb-12">
          What Makes Recipe Builder Special? ✨
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="card text-center transform hover:scale-105 transition-transform">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-primary-600 mb-3">
              Smart Recipe Search
            </h3>
            <p className="text-gray-600">
              Find the perfect recipes from across the web, tailored to your skill
              level - beginner, intermediate, or advanced!
            </p>
          </div>

          <div className="card text-center transform hover:scale-105 transition-transform">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-bold text-primary-600 mb-3">
              Build Your Collection
            </h3>
            <p className="text-gray-600">
              Save your favorite recipes, create your own dishes, and build a
              personalized cookbook that grows with you!
            </p>
          </div>

          <div className="card text-center transform hover:scale-105 transition-transform">
            <div className="text-6xl mb-4">🛒</div>
            <h3 className="text-2xl font-bold text-primary-600 mb-3">
              Auto Shopping Lists
            </h3>
            <p className="text-gray-600">
              Our AI automatically creates shopping lists from your recipes -
              making grocery shopping a breeze!
            </p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-gradient-to-r from-secondary-50 to-primary-50 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-primary-700 mb-12">
            Getting Started is Super Easy! 🎉
          </h2>

          <div className="space-y-6">
            <div className="card">
              <div className="flex items-start gap-4">
                <div className="text-4xl font-bold text-primary-500">1</div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Sign Up & Tell Us About You
                  </h3>
                  <p className="text-gray-600">
                    Create your account and let us know your favorite dishes and
                    cooking skill level. We'll personalize everything just for you!
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-start gap-4">
                <div className="text-4xl font-bold text-secondary-500">2</div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Discover Amazing Recipes
                  </h3>
                  <p className="text-gray-600">
                    Search for recipes that match your taste and skill level.
                    We'll show you dishes you'll love!
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-start gap-4">
                <div className="text-4xl font-bold text-primary-500">3</div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Cook & Enjoy!
                  </h3>
                  <p className="text-gray-600">
                    Follow step-by-step instructions, check off your shopping list
                    items, and create delicious meals for your family!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <h2 className="text-4xl font-bold text-primary-700 mb-6">
          Ready to Start Your Culinary Journey? 👨‍🍳👩‍🍳
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Join thousands of home cooks who are making mealtime fun and delicious!
        </p>
        <Link
          href="/register"
          className="inline-block bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-bold py-5 px-10 rounded-full text-xl shadow-2xl transition-all duration-200 transform hover:scale-110"
        >
          Create Your Free Account Now! 🎊
        </Link>
      </div>
    </div>
  )
}
