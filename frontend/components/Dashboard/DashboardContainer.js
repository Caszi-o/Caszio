import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '../../lib/auth';
import { 
  UserIcon, 
  BuildingOfficeIcon, 
  UserGroupIcon, 
  CogIcon,
  ArrowRightOnRectangleIcon,
  BellIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

function DashboardContainer({ 
  children, 
  title, 
  subtitle, 
  role, 
  quickActions = [],
  showRoleSwitcher = false 
}) {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  
  // Safety check for user
  if (!user) {
    console.error('DashboardContainer: User not found');
    return <div>Loading...</div>;
  }

  const roleInfo = {
    user: {
      name: 'User',
      icon: UserIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      description: 'Cashback & Shopping'
    },
    publisher: {
      name: 'Publisher',
      icon: BuildingOfficeIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      description: 'Ad Management'
    },
    promoter: {
      name: 'Promoter',
      icon: UserGroupIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      description: 'Promotion & Earnings'
    },
  };

  const currentRole = roleInfo[role] || roleInfo.user;
  
  // Ensure we have a valid role with icon
  if (!currentRole || !currentRole.icon) {
    console.error('Invalid role or missing icon:', { role, currentRole });
    return <div>Error: Invalid role configuration</div>;
  }

  // Store the icon component in a variable for proper JSX rendering
  const IconComponent = currentRole.icon;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{title} - Casyoro</title>
        <meta name="description" content={subtitle} />
      </Head>

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold text-primary-600">
                Casyoro
              </Link>
              <div className="h-6 border-l border-gray-300"></div>
              <div className="flex items-center space-x-2">
                {IconComponent && <IconComponent className={`w-5 h-5 ${currentRole.color}`} />}
                <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Role Switcher */}
              {showRoleSwitcher && (
                <div className="relative">
                  <button
                    onClick={() => setShowRoleMenu(!showRoleMenu)}
                    className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    {IconComponent && <IconComponent className={`w-4 h-4 ${currentRole.color}`} />}
                    <span>{currentRole.name}</span>
                    <ChevronDownIcon className="w-4 h-4" />
                  </button>

                  {showRoleMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      <div className="py-1">
                        {Object.entries(roleInfo).map(([roleKey, roleData]) => {
                          const RoleIcon = roleData.icon;
                          return (
                            <Link
                              key={roleKey}
                              href={`/${roleKey}/dashboard`}
                              className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <RoleIcon className={`w-4 h-4 ${roleData.color}`} />
                              <div>
                                <div className="font-medium">{roleData.name}</div>
                                <div className="text-xs text-gray-500">{roleData.description}</div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <BellIcon className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 p-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className={`w-8 h-8 ${currentRole.bgColor} rounded-full flex items-center justify-center`}>
                    <span className={`text-sm font-medium ${currentRole.color}`}>
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </span>
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="font-medium">{user?.firstName} {user?.lastName}</div>
                    <div className="text-xs text-gray-500">{currentRole.name}</div>
                  </div>
                  <ChevronDownIcon className="w-4 h-4" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="py-1">
                      <Link
                        href={`/${role}/profile`}
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <CogIcon className="w-4 h-4" />
                        <span>Profile Settings</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors w-full text-left"
                      >
                        <ArrowRightOnRectangleIcon className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          className="mb-8"
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.firstName || 'User'}! 👋
          </h1>
          <p className="text-gray-600">
            {subtitle}
          </p>
        </motion.div>

        {/* Quick Actions */}
        {quickActions && quickActions.length > 0 && (
          <motion.div
            className="mb-8"
            initial="initial"
            animate="animate"
            variants={fadeInUp}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => {
                if (!action || !action.title || !action.href) {
                  console.warn('Invalid action item:', action);
                  return null;
                }
                const ActionIcon = action.icon;
                return (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    href={action.href}
                    className="block p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-primary-300 transition-all group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 ${action.bgColor} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        {ActionIcon && <ActionIcon className={`w-5 h-5 ${action.color}`} />}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                          {action.title}
                        </h3>
                        <p className="text-sm text-gray-500">{action.description}</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Main Content */}
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerChildren}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}

export default DashboardContainer;
