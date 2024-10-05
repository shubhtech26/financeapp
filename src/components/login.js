import { useState, useEffect } from 'react';
import { loginUser, isLoggedIn } from '../utils/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isLoggedIn()) {
      // Redirect to dashboard if the user is already logged in
      window.location.href = '/dashboard';
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Reset error state

    // Hardcoded credentials for testing
    const validEmail = 'user@example.com';
    const validPassword = 'password123';

    // Check the input against the hardcoded values
    if (email === validEmail && password === validPassword) {
      // Simulate saving session and redirecting
      loginUser({ email: validEmail });  // Save session with valid email
      window.location.href = '/dashboard';  // Redirect to the dashboard
    } else {
      setError('Invalid email or password'); // Set error message for invalid credentials
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <img src="/assets/logo.png" alt="Library Management Logo" className="w-24 h-auto" />
        </div>
        
        <h3 className="text-xl text-center text-gray-500 font-semibold mb-8">Sign in</h3>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-600">Email address *</label>
            <input
              type="email"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6 relative">
            <label className="block text-gray-600">Password *</label>
            <input
              type="password"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
