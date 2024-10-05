import { logoutUser } from '../utils/auth';

const Dashboard = () => {
  const handleLogout = () => {
    logoutUser();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl mb-8">Welcome to the Dashboard!</h1>
      <button
        className="bg-red-500 text-white px-4 py-2 rounded"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
