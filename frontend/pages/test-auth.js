import { useState } from 'react';
import { useAuth } from '../lib/auth';
import { authAPI } from '../lib/api';

export default function TestAuth() {
  const { user, login, loading } = useAuth();
  const [testResult, setTestResult] = useState('');

  const testLogin = async () => {
    try {
      setTestResult('Testing login...');
      const result = await authAPI.login({
        email: 'publisher@example.com',
        password: 'password123'
      });
      setTestResult('Login API Success: ' + JSON.stringify(result.data, null, 2));
    } catch (error) {
      setTestResult('Login API Error: ' + error.message);
    }
  };

  const testAuthLogin = async () => {
    try {
      setTestResult('Testing auth login...');
      const result = await login({
        email: 'publisher@example.com',
        password: 'password123'
      });
      setTestResult('Auth Login Success: ' + JSON.stringify(result, null, 2));
    } catch (error) {
      setTestResult('Auth Login Error: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Authentication Test</h1>
        
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">Current Auth State</h2>
          <p><strong>User:</strong> {user ? JSON.stringify(user, null, 2) : 'Not logged in'}</p>
          <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">Test Actions</h2>
          <div className="space-y-4">
            <button 
              onClick={testLogin}
              className="btn btn-primary"
            >
              Test API Login
            </button>
            <button 
              onClick={testAuthLogin}
              className="btn btn-secondary"
            >
              Test Auth Login
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Test Result</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {testResult || 'No test run yet'}
          </pre>
        </div>
      </div>
    </div>
  );
}
