function Header() {
  return (
    // Header container dengan efek glassmorphism
    <header className="flex justify-between items-center w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4 shadow-[0_4px_16px_0_rgba(0,0,0,0.2)] mb-6 text-white transition-all">
      
      {/* Bagian Kiri: Judul dan Tagline */}
      <div>
        <h2 className="text-2xl font-bold tracking-wide">FocusFlow</h2>
        <p className="text-sm text-gray-300 mt-1">Tetap fokus, Selesaikan semuanya.</p>
      </div>

      {/* Bagian Kanan: Profil */}
      {/* Dibungkus dengan pil kaca kecil (badge) agar terlihat lebih manis */}
      <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-5 py-2 backdrop-blur-sm shadow-inner cursor-pointer hover:bg-white/10 transition-colors">
        <span className="text-xl">👋</span>
        <strong className="font-semibold text-white tracking-wide">Ayu</strong>
      </div>
      
    </header>
  );
}

export default Header;