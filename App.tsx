
import React, { useState } from 'react';
import { UserRole, AuthState } from './types';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Navbar from './components/Navbar';

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthState>({ user: null });

  const handleLogin = (user: { id: string; name: string; role: UserRole }) => {
    setAuth({ user });
  };

  const handleLogout = () => {
    setAuth({ user: null });
  };

  if (!auth.user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar user={auth.user} onLogout={handleLogout} />
      <main className="flex-1 container mx-auto px-4 py-8">
        {auth.user.role === UserRole.STUDENT ? (
          <StudentDashboard userId={auth.user.id} />
        ) : (
          <AdminDashboard />
        )}
      </main>
      {auth.user.role !== UserRole.STUDENT && (
        <footer className="bg-white border-t py-4 text-center text-slate-500 text-sm">
          &copy; 2026 EduCharacter AI System - Mencetak Generasi Berkarakter
        </footer>
      )}
    </div>
  );
};

export default App;
