import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  UsersIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PencilIcon,
  EyeIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
  NoSymbolIcon,
  CheckCircleIcon,
  XCircleIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { ProtectedRoute } from '../../lib/auth';
import { adminAPI } from '../../lib/api';
import toast from 'react-hot-toast';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    status: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    role: '',
    isVerified: true,
    isBlocked: false,
    notes: ''
  });

  useEffect(() => {
    loadUsers();
  }, [filters, pagination.currentPage]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.currentPage,
        limit: 20,
        ...filters
      };
      
      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key];
      });

      const response = await adminAPI.getUsers(params);
      setUsers(response.data.data.users);
      setPagination(response.data.data.pagination);
    } catch (error) {
      console.error('Failed to load users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditForm({
      role: user.role,
      isVerified: user.isVerified,
      isBlocked: user.isBlocked,
      notes: user.adminNotes || ''
    });
    setShowEditModal(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    
    try {
      await adminAPI.updateUser(selectedUser._id, editForm);
      toast.success('User updated successfully');
      setShowEditModal(false);
      loadUsers();
    } catch (error) {
      console.error('Failed to update user:', error);
      toast.error('Failed to update user');
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'badge-danger';
      case 'publisher': return 'badge-success';
      case 'promoter': return 'badge-warning';
      default: return 'badge-primary';
    }
  };

  const getStatusIcon = (user) => {
    if (user.isBlocked) return { icon: NoSymbolIcon, color: 'text-danger-600', text: 'Blocked' };
    // All users are now auto-verified
    return { icon: CheckCircleIcon, color: 'text-success-600', text: 'Verified' };
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <ProtectedRoute allowedRoles={['admin']} requireVerification>
      <Head>
        <title>User Management - Admin Dashboard - Casyoro</title>
        <meta name="description" content="Manage user accounts and permissions" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Link href="/admin/dashboard" className="text-2xl font-bold text-primary-600">
                  Casyoro
                </Link>
                <div className="h-6 border-l border-gray-300"></div>
                <h1 className="text-xl font-semibold text-gray-900">User Management</h1>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Total Users: {pagination.totalItems}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters */}
          <motion.div className="mb-6 card" variants={fadeInUp}>
            <div className="card-body">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <label className="form-label">Search</label>
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      className="form-input pl-10"
                      placeholder="Search users..."
                      value={filters.search}
                      onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Role</label>
                  <select
                    className="form-select"
                    value={filters.role}
                    onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                  >
                    <option value="">All Roles</option>
                    <option value="user">User</option>
                    <option value="publisher">Publisher</option>
                    <option value="promoter">Promoter</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  >
                    <option value="">All Status</option>
                    <option value="verified">Verified</option>
                    <option value="unverified">Unverified</option>
                    <option value="blocked">Blocked</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Sort By</label>
                  <select
                    className="form-select"
                    value={filters.sortBy}
                    onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                  >
                    <option value="createdAt">Created Date</option>
                    <option value="lastLoginAt">Last Login</option>
                    <option value="firstName">Name</option>
                    <option value="email">Email</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={() => setFilters({ search: '', role: '', status: '', sortBy: 'createdAt', sortOrder: 'desc' })}
                    className="btn btn-secondary w-full"
                  >
                    <FunnelIcon className="w-5 h-5 mr-2" />
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Users Table */}
          <motion.div className="card" variants={fadeInUp}>
            <div className="card-header">
              <h2 className="text-lg font-semibold text-gray-900">Users</h2>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="spinner spinner-lg"></div>
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-8">
                  <UsersIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                  <p className="text-gray-600">Try adjusting your search filters.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="table">
                    <thead className="table-header">
                      <tr>
                        <th className="table-header-cell">User</th>
                        <th className="table-header-cell">Role</th>
                        <th className="table-header-cell">Status</th>
                        <th className="table-header-cell">Created</th>
                        <th className="table-header-cell">Last Login</th>
                        <th className="table-header-cell">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="table-body">
                      {users.map((user) => {
                        const statusInfo = getStatusIcon(user);
                        const StatusIcon = statusInfo.icon;
                        
                        return (
                          <tr key={user._id}>
                            <td className="table-cell">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                  <span className="text-sm font-medium text-gray-600">
                                    {user.firstName?.[0]}{user.lastName?.[0]}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {user.firstName} {user.lastName}
                                  </p>
                                  <p className="text-sm text-gray-500">{user.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="table-cell">
                              <span className={`badge ${getRoleColor(user.role)}`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="table-cell">
                              <div className="flex items-center space-x-2">
                                <StatusIcon className={`w-4 h-4 ${statusInfo.color}`} />
                                <span className={`text-sm ${statusInfo.color}`}>
                                  {statusInfo.text}
                                </span>
                              </div>
                            </td>
                            <td className="table-cell">
                              <div className="flex items-center space-x-2">
                                <CalendarIcon className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                  {formatDate(user.createdAt)}
                                </span>
                              </div>
                            </td>
                            <td className="table-cell">
                              <span className="text-sm text-gray-600">
                                {user.lastLoginAt ? formatDate(user.lastLoginAt) : 'Never'}
                              </span>
                            </td>
                            <td className="table-cell">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleEditUser(user)}
                                  className="text-primary-600 hover:text-primary-700"
                                  title="Edit User"
                                >
                                  <PencilIcon className="w-4 h-4" />
                                </button>
                                <Link
                                  href={`/admin/users/${user._id}`}
                                  className="text-gray-600 hover:text-gray-700"
                                  title="View Details"
                                >
                                  <EyeIcon className="w-4 h-4" />
                                </Link>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <motion.div className="mt-6 flex justify-center" variants={fadeInUp}>
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage - 1 })}
                  disabled={pagination.currentPage === 1}
                  className="btn btn-secondary btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                {[...Array(Math.min(pagination.totalPages, 10))].map((_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setPagination({ ...pagination, currentPage: page })}
                      className={`btn btn-sm ${
                        pagination.currentPage === page 
                          ? 'btn-primary' 
                          : 'btn-secondary'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage + 1 })}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="btn btn-secondary btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </nav>
            </motion.div>
          )}
        </div>

        {/* Edit User Modal */}
        {showEditModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Edit User: {selectedUser.firstName} {selectedUser.lastName}
              </h3>
              
              <form onSubmit={handleUpdateUser}>
                <div className="space-y-4">
                  <div>
                    <label className="form-label">Role</label>
                    <select
                      className="form-select"
                      value={editForm.role}
                      onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                    >
                      <option value="user">User</option>
                      <option value="publisher">Publisher</option>
                      <option value="promoter">Promoter</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 rounded"
                        checked={editForm.isVerified}
                        onChange={(e) => setEditForm({ ...editForm, isVerified: e.target.checked })}
                      />
                      <label className="ml-2 text-sm text-gray-900">
                        Verified Account
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-danger-600 rounded"
                        checked={editForm.isBlocked}
                        onChange={(e) => setEditForm({ ...editForm, isBlocked: e.target.checked })}
                      />
                      <label className="ml-2 text-sm text-gray-900">
                        Block Account
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Admin Notes</label>
                    <textarea
                      className="form-textarea"
                      rows={3}
                      placeholder="Add notes about this user..."
                      value={editForm.notes}
                      onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 btn btn-primary">
                    Update User
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
