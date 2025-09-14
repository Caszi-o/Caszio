// Utility functions for dashboard components

export const formatCurrency = (amount) => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '₹0';
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0
  }).format(amount);
};

export const formatNumber = (num) => {
  if (typeof num !== 'number' || isNaN(num)) {
    return '0';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'active': return 'text-success-600 bg-success-100';
    case 'paused': return 'text-warning-600 bg-warning-100';
    case 'pending_review': return 'text-primary-600 bg-primary-100';
    case 'rejected': return 'text-danger-600 bg-danger-100';
    case 'completed': return 'text-gray-600 bg-gray-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

export const getStatusIconName = (status) => {
  // Return the icon component name as string - will be resolved in the component
  const icons = {
    'active': 'CheckCircleIcon',
    'paused': 'ClockIcon',
    'pending_review': 'ExclamationTriangleIcon',
    'rejected': 'XCircleIcon',
    'completed': 'CheckCircleIcon',
    'default': 'ClockIcon'
  };
  
  return icons[status] || icons['default'];
};

// Default mock data for when API fails
export const getDefaultDashboardData = () => ({
  publisher: {
    verificationStatus: 'verified',
    currentPackage: 'Premium',
    packageStatus: 'active'
  },
  recentAds: [],
  activeAdsCount: 0,
  todayMetrics: {
    impressions: 0,
    clicks: 0,
    conversions: 0,
    cost: 0
  },
  packageInfo: {
    current: 'Premium',
    status: 'active',
    features: {
      adsPerMonth: 'unlimited'
    }
  }
});

// Safe chart data generators
export const getPerformanceData = () => ({
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Impressions',
      data: [1200, 1900, 3000, 5000, 2000, 3000, 4500],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4
    },
    {
      label: 'Clicks',
      data: [65, 89, 120, 200, 90, 150, 180],
      borderColor: 'rgb(34, 197, 94)',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      tension: 0.4
    }
  ]
});

export const getAdStatusData = () => ({
  labels: ['Active', 'Paused', 'Pending Review', 'Rejected'],
  datasets: [
    {
      data: [12, 3, 2, 1],
      backgroundColor: [
        '#22c55e',
        '#f59e0b',
        '#3b82f6',
        '#ef4444'
      ],
      borderWidth: 0
    }
  ]
});

export const getSpendingData = () => ({
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
  datasets: [
    {
      label: 'Ad Spend',
      data: [12000, 15000, 18000, 14000],
      backgroundColor: 'rgba(59, 130, 246, 0.8)',
      borderRadius: 4
    }
  ]
});
