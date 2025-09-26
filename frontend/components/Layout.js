import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../lib/auth';
import { useRouter } from 'next/router';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    
    switch (user.role) {
      case 'publisher':
        return '/dashboard/publisher';
      default:
        return '/dashboard/user';
    }
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'publisher':
        return 'Publisher';
      default:
        return 'User';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">C</span>
                </div>
                <span className="ml-2 text-2xl font-bold text-gray-900">Caszio</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/offers" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                Offers
              </Link>
              <Link href="/how-it-works" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                How it Works
              </Link>
              
              {user ? (
                <div className="flex items-center space-x-4">
                  <Link href={getDashboardLink()} className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                    Dashboard
                  </Link>
                  
                  {/* User Menu */}
                  <div className="relative group">
                    <button className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">
                          {user.firstName?.charAt(0)}
                        </span>
                      </div>
                      <span>{user.firstName}</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {/* Dropdown Menu */}
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-gray-500">{getRoleDisplayName(user.role)}</p>
                      </div>
                      <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Profile
                      </Link>
                      <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link href="/auth/login" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                    Sign In
                  </Link>
                  <Link href="/auth/register" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-700 hover:text-blue-600 p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link href="/offers" className="block px-3 py-2 text-gray-700 hover:text-blue-600 rounded-md text-base font-medium">
                Offers
              </Link>
              <Link href="/how-it-works" className="block px-3 py-2 text-gray-700 hover:text-blue-600 rounded-md text-base font-medium">
                How it Works
              </Link>
              
              {user ? (
                <>
                  <Link href={getDashboardLink()} className="block px-3 py-2 text-gray-700 hover:text-blue-600 rounded-md text-base font-medium">
                    Dashboard
                  </Link>
                  <Link href="/profile" className="block px-3 py-2 text-gray-700 hover:text-blue-600 rounded-md text-base font-medium">
                    Profile
                  </Link>
                  <Link href="/settings" className="block px-3 py-2 text-gray-700 hover:text-blue-600 rounded-md text-base font-medium">
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 rounded-md text-base font-medium"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="block px-3 py-2 text-gray-700 hover:text-blue-600 rounded-md text-base font-medium">
                    Sign In
                  </Link>
                  <Link href="/auth/register" className="block px-3 py-2 bg-blue-600 text-white rounded-md text-base font-medium">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main>
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">C</span>
                </div>
                <span className="ml-2 text-xl font-bold">Caszio</span>
              </div>
              <p className="text-gray-400 text-sm">
                Earn cashback on every purchase. The smart way to save money while shopping online.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">For Users</h3>
              <ul className="space-y-2">
                <li><Link href="/offers" className="text-gray-400 hover:text-white text-sm">Browse Offers</Link></li>
                <li><Link href="/cashback" className="text-gray-400 hover:text-white text-sm">Cashback</Link></li>
                <li><Link href="/help" className="text-gray-400 hover:text-white text-sm">Help Center</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white text-sm">Contact Us</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">For Partners</h3>
              <ul className="space-y-2">
                <li><Link href="/publisher" className="text-gray-400 hover:text-white text-sm">For Publishers</Link></li>
                <li><Link href="/affiliate" className="text-gray-400 hover:text-white text-sm">Affiliate Program</Link></li>
                <li><Link href="/partnership" className="text-gray-400 hover:text-white text-sm">Partnership</Link></li>
                <li><Link href="/partnership/apply" className="text-gray-400 hover:text-white text-sm">Apply for Partnership</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-gray-400 hover:text-white text-sm">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-gray-400 hover:text-white text-sm">Terms of Service</Link></li>
                <li><Link href="/refund" className="text-gray-400 hover:text-white text-sm">Refund Policy</Link></li>
                <li><Link href="/disclaimer" className="text-gray-400 hover:text-white text-sm">Disclaimer</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 Caszio. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
