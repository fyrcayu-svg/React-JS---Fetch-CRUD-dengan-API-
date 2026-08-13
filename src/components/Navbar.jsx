import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function Navbar({ currentTheme, setTheme }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  // Komponen SVG Ikon Gear (Pengaturan)
  const GearIcon = () => (
    <svg className="w-4 h-4 transition-transform duration-500 group-hover:rotate-90" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
    </svg>
  );

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { path: '/tasks', label: 'My Tasks', icon: '✓' },
    { path: '/settings', label: 'Settings', customIcon: <GearIcon /> }, // Menggunakan SVG Gear
  ];

  const themes = [
    { id: 'default', name: 'Default Ungu' },
    { id: 'gold', name: 'Gold Metallic' },
    { id: 'blue', name: 'Blue Sky' },
    { id: 'pink', name: 'Pink Dream' },
  ];

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center w-full px-4 pointer-events-none">
      <nav className="pointer-events-auto bg-white/5 backdrop-blur-3xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] rounded-full px-6 py-3 flex items-center justify-between w-full max-w-4xl transition-all duration-500 ease-out hover:bg-white/10 hover:border-white/20">
        
        {/* Logo */}
        <div className="shrink-0 mr-4">
          <h1 className="text-xl font-bold flex items-center gap-2 text-white drop-shadow-md tracking-wide cursor-pointer">
            <span className="text-purple-400 animate-pulse">✦</span> FocusFlow
          </h1>
        </div>

        {/* Menu Navigasi Tengah */}
        <div className="hidden md:flex items-center gap-2 relative">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            const isHovered = hoveredIndex === index;

            return (
              <Link
                key={item.path}
                to={item.path}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`group relative px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 z-10 flex items-center gap-2 ${
                  isActive || isHovered ? 'text-white' : 'text-gray-400'
                }`}
              >
                <span>{item.icon || item.customIcon}</span>
                {item.label}

                {(isActive || isHovered) && (
                  <span
                    className={`absolute inset-0 -z-10 rounded-full transition-all duration-300 ${
                      isActive 
                        ? 'bg-white/20 shadow-inner border border-white/10' 
                        : 'bg-white/10'
                    }`}
                  ></span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Tombol Tema & Logout Kanan */}
        <div className="flex items-center gap-3 relative">
          <div className="relative">
            <button
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className="px-4 py-2 bg-white/5 border border-white/10 text-gray-300 text-sm font-semibold rounded-full hover:text-white hover:bg-white/10 transition-all flex items-center gap-2 backdrop-blur-sm cursor-pointer"
            >
              🎨 <span>Tema</span>
            </button>

            {showThemeMenu && (
              <div className="absolute right-0 mt-3 w-48 bg-slate-900/90 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl p-2 z-50 flex flex-col gap-1">
                <div className="px-3 py-2 text-xs font-semibold text-gray-400 border-b border-white/10">
                  Pilih Tema Warna
                </div>
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTheme(t.id);
                      setShowThemeMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all flex items-center justify-between cursor-pointer ${
                      currentTheme === t.id 
                        ? 'bg-purple-500/30 text-white font-bold border border-purple-500/40' 
                        : 'text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    {t.name}
                    {currentTheme === t.id && <span>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button 
            onClick={handleLogout}
            className="px-5 py-2 bg-white/5 border border-white/10 text-gray-300 text-sm font-semibold rounded-full hover:text-white hover:bg-red-500/20 hover:border-red-500/30 transition-all cursor-pointer"
          >
            Logout
          </button>
        </div>

      </nav>
    </div>
  );
}

export default Navbar;