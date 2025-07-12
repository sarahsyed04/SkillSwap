'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, Users, MessageSquare, Star, Calendar, Search, Settings } from 'lucide-react'

export default function Demo() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700">
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="text-xl font-bold">SkillSwap</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/signin">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button>Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Platform Demo
          </h1>
          <p className="text-xl text-gray-600">
            Explore the key features of our skill exchange platform
          </p>
        </div>

        {/* Demo Sections */}
        <div className="space-y-12">
          {/* Dashboard Preview */}
          <section className="bg-white rounded-lg shadow-sm border p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Users className="h-6 w-6 text-blue-600 mr-2" />
              User Dashboard
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 mb-2">Browse Skills</h3>
                <p className="text-blue-700 text-sm">Find people to learn from</p>
              </div>
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="font-semibold text-green-900 mb-2">My Swaps</h3>
                <p className="text-green-700 text-sm">View your requests</p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-6">
                <h3 className="font-semibold text-yellow-900 mb-2">My Profile</h3>
                <p className="text-yellow-700 text-sm">Update your information</p>
              </div>
            </div>
          </section>

          {/* Skill Management */}
          <section className="bg-white rounded-lg shadow-sm border p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Star className="h-6 w-6 text-yellow-600 mr-2" />
              Skill Management
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills I Offer</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">JavaScript Programming</h4>
                      <p className="text-sm text-gray-600">Technology</p>
                    </div>
                    <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                      Advanced
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Guitar Playing</h4>
                      <p className="text-sm text-gray-600">Music</p>
                    </div>
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      Intermediate
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills I Want to Learn</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Spanish Language</h4>
                      <p className="text-sm text-gray-600">Languages</p>
                    </div>
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                      Beginner
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Photography</h4>
                      <p className="text-sm text-gray-600">Arts & Crafts</p>
                    </div>
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                      Beginner
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Browse Users */}
          <section className="bg-white rounded-lg shadow-sm border p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Search className="h-6 w-6 text-green-600 mr-2" />
              Browse Skills
            </h2>
            <div className="mb-6">
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Search by name or skill..."
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  disabled
                />
                <select className="rounded-lg border border-gray-300 px-3 py-2 text-sm" disabled>
                  <option>All Categories</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: "Sarah Johnson", location: "San Francisco, CA", skills: ["React Development", "UI Design"], rating: 4.8 },
                { name: "Mike Chen", location: "New York, NY", skills: ["Python Programming", "Data Science"], rating: 4.9 },
                { name: "Emma Davis", location: "Austin, TX", skills: ["Spanish Language", "Guitar"], rating: 4.7 }
              ].map((user, index) => (
                <div key={index} className="border rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="ml-3">
                      <h3 className="font-semibold text-gray-900">{user.name}</h3>
                      <p className="text-sm text-gray-500">{user.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center mb-3">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">{user.rating} rating</span>
                  </div>
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Skills Offered:</h4>
                    <div className="flex flex-wrap gap-1">
                      {user.skills.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Button className="w-full" size="sm" disabled>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Request Swap
                  </Button>
                </div>
              ))}
            </div>
          </section>

          {/* Swap Requests */}
          <section className="bg-white rounded-lg shadow-sm border p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <MessageSquare className="h-6 w-6 text-purple-600 mr-2" />
              Swap Requests
            </h2>
            <div className="space-y-4">
              <div className="border rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Pending
                  </span>
                  <span className="text-sm text-gray-500">2 days ago</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-1">You want to learn</h4>
                    <p className="text-sm text-blue-700">Spanish Language</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-1">You offer</h4>
                    <p className="text-sm text-green-700">JavaScript Programming</p>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm" disabled>Decline</Button>
                  <Button size="sm" disabled>Accept</Button>
                </div>
              </div>
            </div>
          </section>

          {/* Admin Dashboard Preview */}
          <section className="bg-white rounded-lg shadow-sm border p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Settings className="h-6 w-6 text-red-600 mr-2" />
              Admin Dashboard
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">1,234</p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-6">
                <div className="flex items-center">
                  <MessageSquare className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Swaps</p>
                    <p className="text-2xl font-bold text-gray-900">567</p>
                  </div>
                </div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-6">
                <div className="flex items-center">
                  <Star className="h-8 w-8 text-yellow-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                    <p className="text-2xl font-bold text-gray-900">4.8</p>
                  </div>
                </div>
              </div>
              <div className="bg-purple-50 rounded-lg p-6">
                <div className="flex items-center">
                  <Calendar className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending Skills</p>
                    <p className="text-2xl font-bold text-gray-900">23</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Features Available:</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                <li>• User management and moderation</li>
                <li>• Skill approval workflow</li>
                <li>• Platform-wide announcements</li>
                <li>• Analytics and reporting</li>
                <li>• CSV export functionality</li>
                <li>• Real-time activity monitoring</li>
              </ul>
            </div>
          </section>
        </div>

        {/* CTA */}
        <div className="text-center mt-12 p-8 bg-blue-600 rounded-lg">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-blue-100 mb-6">
            Join our community and start exchanging skills today
          </p>
          <Link href="/auth/signup">
            <Button size="lg" variant="secondary">
              Create Your Account
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}