import { useState, useEffect } from 'react';
import { useAuth, ProtectedRoute } from '../../lib/auth';
import DashboardContainer from '../../components/Dashboard/DashboardContainer';

export default function PublisherDashboardTest() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ProtectedRoute allowedRoles={['publisher']} requireVerification>
      <DashboardContainer
        title="Publisher Dashboard"
        subtitle="Manage your ads and track performance"
        role="publisher"
        quickActions={[
          {
            title: 'Create Ad',
            description: 'Create a new advertisement',
            icon: 'PlusIcon',
            href: '/publisher/ads/create',
            color: 'text-white',
            bgColor: 'bg-primary-600'
          }
        ]}
      >
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Test Publisher Dashboard</h1>
            <p className="text-gray-600">This is a simplified version to test the component structure.</p>
          </div>
        </div>
      </DashboardContainer>
    </ProtectedRoute>
  );
}
