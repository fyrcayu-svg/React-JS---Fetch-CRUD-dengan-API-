import React from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <div className="w-full flex flex-col items-center justify-center py-12 md:py-20 text-white font-sans">
      
      {/* iOS Style Pill / Badge */}
      <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl mb-8 shadow-sm">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>
        <span className="text-sm font-medium tracking-wide text-gray-300">
          Selamat datang kembali, Ayu
        </span>
      </div>

      {/* Hero Typography - Besar, Tebal, dan Rapat (Tracking-tight) */}
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-center mb-6 leading-tight">
        <span className="text-transparent bg-clip-text bg-linear-to-b from-white to-gray-400">
          Tetap Fokus.
        </span>
        <br />
        <span className="text-transparent bg-clip-text bg-linear-to-br from-purple-400 to-pink-500">
          Selesaikan Semuanya.
        </span>
      </h1>

      <p className="text-lg md:text-xl text-gray-400 text-center max-w-2xl mb-12 font-medium">
        Kendalikan waktumu dengan FocusFlow. Dirancang khusus untuk membantumu mengatur tugas harian tanpa distraksi.
      </p>

      {/* Action Buttons - Rounded Full (Pil) ala Apple */}
      <div className="flex flex-col sm:flex-row gap-5 mb-20 w-full sm:w-auto px-6">
        <Link 
          to="/tasks" 
          className="px-8 py-4 bg-white text-black text-center font-bold rounded-full hover:scale-105 transition-transform duration-300 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
        >
          Mulai Kelola Tugas
        </Link>
        <Link 
          to="/settings" 
          className="px-8 py-4 bg-white/10 border border-white/20 text-white text-center font-semibold rounded-full hover:bg-white/20 backdrop-blur-xl transition-all duration-300"
        >
          Pengaturan Profil
        </Link>
      </div>

      {/* iOS Style Feature Cards - Sudut sangat melengkung (rounded-3xl) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl px-4">
        
        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-4xl p-8 shadow-2xl flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300">
          <div className="w-14 h-14 bg-purple-500/20 rounded-full flex items-center justify-center mb-4 border border-purple-500/30">
            <span className="text-2xl">📝</span>
          </div>
          <h3 className="text-xl font-bold mb-2">Manajemen Tugas</h3>
          <p className="text-gray-400 text-sm">Catat dan pantau setiap progres tugasmu dengan mudah dan cepat.</p>
        </div>

        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-4xl p-8 shadow-2xl flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300">
          <div className="w-14 h-14 bg-blue-500/20 rounded-full flex items-center justify-center mb-4 border border-blue-500/30">
            <span className="text-2xl">⚡</span>
          </div>
          <h3 className="text-xl font-bold mb-2">Performa Cepat</h3>
          <p className="text-gray-400 text-sm">Dirancang dengan teknologi modern untuk pengalaman yang sangat mulus.</p>
        </div>

        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-4xl p-8 shadow-2xl flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300">
          <div className="w-14 h-14 bg-pink-500/20 rounded-full flex items-center justify-center mb-4 border border-pink-500/30">
            <span className="text-2xl">🔒</span>
          </div>
          <h3 className="text-xl font-bold mb-2">Aman Terlindungi</h3>
          <p className="text-gray-400 text-sm">Data privasimu aman dan hanya bisa diakses oleh akun kamu sendiri.</p>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;