import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Outlet } from 'react-router-dom';

function MainLayout() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("app_theme") || "default";
  });

  useEffect(() => {
    localStorage.setItem("app_theme", theme);
  }, [theme]);

  // Konfigurasi warna latar belakang utama berdasarkan tema
  const getThemeBackground = () => {
    switch (theme) {
      case 'gold':
        return "bg-[#12100e]"; // Hitam nuansa emas gelap
      case 'blue':
        return "bg-[#0b1329]"; // Biru malam pekat
      case 'pink':
        return "bg-[#1c0c1b]"; // Ungu-pink gelap elegan
      default:
        return "bg-[#0f0c1b]"; // Ungu gelap default (FocusFlow)
    }
  };

  return (
    <div className={`min-h-screen ${getThemeBackground()} font-sans text-white flex flex-col transition-all duration-500`}>
      
      <Navbar currentTheme={theme} setTheme={setTheme} />

      {/* Mengirimkan tema ke halaman di dalamnya lewat Outlet */}
      <main className="flex-1 w-full max-w-6xl mx-auto p-4 md:p-8 pt-28 md:pt-28">
        <Outlet context={{ currentTheme: theme }} /> 
      </main>
      
    </div>
  );
}

export default MainLayout;