
import React, { useState } from 'react';
import { UserRole } from '../types';
import { LogIn, GraduationCap, ShieldCheck } from 'lucide-react';

interface LoginProps {
  onLogin: (user: { id: string; name: string; role: UserRole }) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);

  return (
    <div className="min-h-screen flex items-center justify-center bg-mesh p-4">
      <div className="bg-white/95 backdrop-blur-md p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white/20">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-indigo-600 p-4 rounded-2xl shadow-lg mb-4">
            <ShieldCheck className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800">EduCharacter AI</h1>
          <p className="text-slate-500 mt-2 text-center">Masuk ke platform pembelajaran karakter cerdas</p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
          <button
            onClick={() => setRole(UserRole.STUDENT)}
            className={`flex-1 py-2 rounded-lg font-medium transition-all ${role === UserRole.STUDENT ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
          >
            Siswa
          </button>
          <button
            onClick={() => setRole(UserRole.ADMIN)}
            className={`flex-1 py-2 rounded-lg font-medium transition-all ${role === UserRole.ADMIN ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
          >
            Guru/Admin
          </button>
        </div>

        <form className="space-y-4" onSubmit={(e) => {
          e.preventDefault();
          onLogin({
            id: role === UserRole.STUDENT ? 'st-001' : 'admin-01',
            name: role === UserRole.STUDENT ? 'Ahmad Faisal' : 'Ratna, M.Pd.',
            role
          });
        }}>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">ID Pengguna / NIS</label>
            <input 
              type="text" 
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-800"
              placeholder={role === UserRole.STUDENT ? 'Masukkan NIS Anda' : 'Masukkan NIP/ID Admin'}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Kata Sandi</label>
            <input 
              type="password" 
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-800"
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 group"
          >
            Masuk Sekarang
            <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center space-x-2 text-slate-400 text-sm">
          <GraduationCap className="w-4 h-4" />
          <span>Sistem Penilaian Karakter Berbasis AI</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
