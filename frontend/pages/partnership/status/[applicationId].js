import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ClockIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import Layout from '../../../components/Layout';

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function PartnershipStatus() {
  const router = useRouter();
  const { applicationId } = router.query;
  
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (applicationId) {
      fetchApplicationStatus();
    }
  }, [applicationId]);

  const fetchApplicationStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/partnership/status/${applicationId}`);
      const result = await response.json();

      if (response.ok) {
        setApplication(result.data);
      } else {
        setError(result.message || 'Failed to fetch application status');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending':
        return {
          icon: ClockIcon,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          title: 'Application Pending',
          description: 'Your application is in queue and will be reviewed soon.'
        };
      case 'under_review':
        return {
          icon: EyeIcon,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          title: 'Under Review',
          description: 'Our team is currently reviewing your application.'
        };
      case 'approved':
        return {
          icon: CheckCircleIcon,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          title: 'Application Approved',
          description: 'Congratulations! Your partnership application has been approved.'
        };
      case 'rejected':
        return {
          icon: XCircleIcon,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          title: 'Application Rejected',
          description: 'Unfortunately, we cannot approve your application at this time.'
        };
      default:
        return {
          icon: ExclamationTriangleIcon,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          title: 'Unknown Status',
          description: 'Unable to determine application status.'
        };
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Layout>
        <Head>
          <title>Application Status - Partnership - Caszio</title>
        </Head>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading application status...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !application) {
    return (
      <Layout>
        <Head>
          <title>Application Not Found - Partnership - Caszio</title>
        </Head>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="max-w-md mx-auto text-center p-8">
            <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Application Not Found</h1>
            <p className="text-gray-600 mb-6">
              {error || 'The application you are looking for does not exist or the link is invalid.'}
            </p>
            <div className="space-y-3">
              <Link
                href="/partnership/apply"
                className="block w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Submit New Application
              </Link>
              <Link
                href="/"
                className="block w-full text-gray-600 hover:text-gray-900 transition-colors"
              >
                Return to Homepage
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const statusInfo = getStatusInfo(application.status);
  const StatusIcon = statusInfo.icon;

  return (
    <Layout>
      <Head>
        <title>Application Status - {application.companyName} - Caszio</title>
        <meta name="description" content={`Check the status of your partnership application for ${application.companyName}`} />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <motion.div
            initial="initial"
            animate="animate"
            variants={fadeInUp}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
              <h1 className="text-3xl font-bold text-white">Application Status</h1>
              <p className="text-blue-100 mt-2">
                Track the progress of your partnership application
              </p>
            </div>

            {/* Status Section */}
            <div className="p-8">
              <div className={`${statusInfo.bgColor} ${statusInfo.borderColor} border rounded-lg p-6 mb-8`}>
                <div className="flex items-center mb-4">
                  <StatusIcon className={`h-8 w-8 ${statusInfo.color} mr-3`} />
                  <div>
                    <h2 className={`text-xl font-bold ${statusInfo.color}`}>
                      {statusInfo.title}
                    </h2>
                    <p className="text-gray-600">
                      {statusInfo.description}
                    </p>
                  </div>
                </div>

                {/* Progress Timeline */}
                <div className="mt-6">
                  <div className="flex items-center space-x-4">
                    {/* Submitted */}
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircleIcon className="h-5 w-5 text-white" />
                      </div>
                      <p className="text-xs text-gray-600 mt-1 text-center">Submitted</p>
                    </div>

                    {/* Line */}
                    <div className={`flex-1 h-1 ${
                      ['under_review', 'approved', 'rejected'].includes(application.status) 
                        ? 'bg-green-500' 
                        : 'bg-gray-300'
                    }`}></div>

                    {/* Under Review */}
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        ['under_review', 'approved', 'rejected'].includes(application.status)
                          ? 'bg-green-500'
                          : 'bg-gray-300'
                      }`}>
                        <EyeIcon className="h-5 w-5 text-white" />
                      </div>
                      <p className="text-xs text-gray-600 mt-1 text-center">Review</p>
                    </div>

                    {/* Line */}
                    <div className={`flex-1 h-1 ${
                      ['approved', 'rejected'].includes(application.status) 
                        ? application.status === 'approved' ? 'bg-green-500' : 'bg-red-500'
                        : 'bg-gray-300'
                    }`}></div>

                    {/* Decision */}
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        application.status === 'approved' 
                          ? 'bg-green-500'
                          : application.status === 'rejected'
                          ? 'bg-red-500'
                          : 'bg-gray-300'
                      }`}>
                        {application.status === 'approved' ? (
                          <CheckCircleIcon className="h-5 w-5 text-white" />
                        ) : application.status === 'rejected' ? (
                          <XCircleIcon className="h-5 w-5 text-white" />
                        ) : (
                          <ClockIcon className="h-5 w-5 text-white" />
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mt-1 text-center">Decision</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Application Details */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Application Details</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-gray-600">Application ID:</span>
                      <p className="font-mono text-gray-900">{application.applicationId}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Company Name:</span>
                      <p className="font-medium text-gray-900">{application.companyName}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Status:</span>
                      <p className={`font-medium capitalize ${statusInfo.color}`}>
                        {application.status.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Timeline</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-gray-600">Submitted:</span>
                      <p className="text-gray-900">{formatDate(application.submittedAt)}</p>
                    </div>
                    {application.reviewedAt && (
                      <div>
                        <span className="text-gray-600">Reviewed:</span>
                        <p className="text-gray-900">{formatDate(application.reviewedAt)}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Admin Notes (if rejected or has feedback) */}
              {application.adminNotes && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
                  <div className="flex items-start">
                    <DocumentTextIcon className="h-5 w-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-yellow-800 mb-2">
                        {application.status === 'rejected' ? 'Rejection Reason' : 'Admin Notes'}
                      </h3>
                      <p className="text-yellow-700">{application.adminNotes}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {application.status === 'approved' && (
                  <Link
                    href="/publisher/dashboard"
                    className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors text-center"
                  >
                    Access Publisher Dashboard
                  </Link>
                )}
                
                {application.status === 'rejected' && (
                  <Link
                    href="/partnership/apply"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors text-center"
                  >
                    Submit New Application
                  </Link>
                )}

                <button
                  onClick={fetchApplicationStatus}
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                >
                  Refresh Status
                </button>

                <Link
                  href="/"
                  className="text-gray-600 hover:text-gray-900 transition-colors text-center py-3"
                >
                  Return to Homepage
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
