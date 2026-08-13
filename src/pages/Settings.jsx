import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";

function Settings() {
  const { currentTheme } = useOutletContext();

  // State untuk pengaturan profil
  const [username, setUsername] = useState(() => {
    return localStorage.getItem("user_name") || "Ayu";
  });
  const [email, setEmail] = useState(() => {
    return localStorage.getItem("user_email") || "GRCAYUU@gmail.com";
  });
  const [isSaved, setIsSaved] = useState(false);

  // State untuk pengaturan notifikasi (Toggle)
  const [notifications, setNotifications] = useState(() => {
    return localStorage.getItem("notif_setting") === "true";
  });

  // Sinkronisasi perubahan notifikasi ke localStorage
  useEffect(() => {
    localStorage.setItem("notif_setting", notifications);
  }, [notifications]);

  // Fungsi simpan profil
  const handleSaveProfile = (e) => {
    e.preventDefault();
    localStorage.setItem("user_name", username);
    localStorage.setItem("user_email", email);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000); // Hilangkan pesan sukses setelah 3 detik
  };

  // Fungsi hapus seluruh data lokal (Clear Cache)
  const handleClearCache = () => {
    const confirmClear = window.confirm("Peringatan: Semua catatan tugas dan pengaturan lokal akan dihapus permanen. Lanjutkan?");
    if (confirmClear) {
      localStorage.clear();
      window.location.reload(); // Muat ulang halaman
    }
  };

  // Mengatur warna aksen tombol berdasarkan tema
  const getThemeAccent = () => {
    switch (currentTheme) {
      case 'gold': return "bg-amber-600 hover:bg-amber-500";
      case 'blue': return "bg-blue-600 hover:bg-blue-500";
      case 'pink': return "bg-pink-600 hover:bg-pink-500";
      default: return "bg-purple-600 hover:bg-purple-500";
    }
  };

  return (
    <div className="w-full text-white font-sans max-w-4xl mx-auto pb-12">
      
      {/* Header Halaman */}
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2 tracking-wide drop-shadow-md">
          Pengaturan Akun ⚙️
        </h1>
        <p className="text-gray-300 text-base md:text-lg">
          Kelola preferensi akun, tampilan, dan sistem aplikasi FocusFlow-mu.
        </p>
      </div>

      <div className="flex flex-col gap-6">

        {/* KARTU 1: Profil Pengguna */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
          <h2 className="text-xl font-bold mb-4 border-b border-white/10 pb-2 flex items-center gap-2">
            <span>👤</span> Informasi Profil
          </h2>

          <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Nama Pengguna</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all backdrop-blur-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Alamat Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all backdrop-blur-sm"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              {isSaved ? (
                <span className="text-emerald-400 text-sm font-semibold animate-pulse">
                  ✓ Profil berhasil disimpan!
                </span>
              ) : (
                <span></span>
              )}

              <button
                type="submit"
                className={`${getThemeAccent()} text-white font-semibold py-2.5 px-6 rounded-xl transition-all duration-300 shadow-lg cursor-pointer text-sm`}
              >
                Simpan Perubahan
              </button>
            </div>
          </form>
        </div>

        {/* KARTU 2: Preferensi & Notifikasi */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
          <h2 className="text-xl font-bold mb-4 border-b border-white/10 pb-2 flex items-center gap-2">
            <span>🔔</span> Notifikasi & Sistem
          </h2>

          <div className="flex items-center justify-between py-2">
            <div>
              <h4 className="font-semibold text-white">Notifikasi Pengingat Tugas</h4>
              <p className="text-sm text-gray-400">Terima pemberitahuan saat target catatan harian aktif.</p>
            </div>
            
            {/* Tombol Toggle Switch Interaktif */}
            <button
              onClick={() => setNotifications(!notifications)}
              className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 cursor-pointer ${
                notifications ? 'bg-emerald-500' : 'bg-white/20'
              }`}
            >
              <div
                className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
                  notifications ? 'translate-x-6' : 'translate-x-0'
                }`}
              ></div>
            </button>
          </div>

          <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-white">Tema Warna Aktif</h4>
              <p className="text-sm text-gray-400">Tema saat ini: <span className="capitalize font-bold text-purple-300">{currentTheme}</span></p>
            </div>
            <span className="text-xs bg-white/10 border border-white/20 px-3 py-1 rounded-full text-gray-300">
              Sinkron dengan Navbar 🎨
            </span>
          </div>
        </div>

        {/* KARTU 3: Danger Zone (Zona Berbahaya) */}
        <div className="bg-red-950/20 backdrop-blur-xl border border-red-500/30 rounded-2xl p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
          <h2 className="text-xl font-bold mb-2 text-red-300 flex items-center gap-2">
            <span>⚠️</span> Zona Berbahaya
          </h2>
          <p className="text-sm text-gray-400 mb-4">
            Tindakan di bawah ini bersifat permanen dan tidak dapat dibatalkan.
          </p>

          <button
            onClick={handleClearCache}
            className="bg-red-500/20 hover:bg-red-500/40 border border-red-500/40 text-red-200 font-semibold py-2.5 px-6 rounded-xl transition-all cursor-pointer text-sm shadow-lg backdrop-blur-md"
          >
            Hapus Semua Data & Reset Aplikasi
          </button>
        </div>

      </div>

    </div>
  );
}

export default Settings;