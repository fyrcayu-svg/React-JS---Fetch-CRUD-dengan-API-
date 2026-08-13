import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import api from "../services/api";

function Tasks() {
  // Mengambil tema aktif dari MainLayout
  const { currentTheme } = useOutletContext();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeletingAll, setIsDeletingAll] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editId, setEditId] = useState(null);

  // Mengatur warna aksen tombol berdasarkan tema yang dipilih
  const getThemeAccent = () => {
    switch (currentTheme) {
      case 'gold':
        return "bg-amber-600 hover:bg-amber-500 focus:ring-amber-400";
      case 'blue':
        return "bg-blue-600 hover:bg-blue-500 focus:ring-blue-400";
      case 'pink':
        return "bg-pink-600 hover:bg-pink-500 focus:ring-pink-400";
      default:
        return "bg-purple-600 hover:bg-purple-500 focus:ring-purple-400";
    }
  };

  // 1. GET DATA
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/api");
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Gagal mengambil data dari server.");
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // 2. POST / PUT DATA
  const addUser = async () => {
    const userData = { name, email };

    try {
      if (editId !== null) {
        const response = await api.put(`/api/${editId}`, userData);
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user.id === editId ? response.data : user))
        );
        setEditId(null);
      } else {
        const response = await api.post("/api", userData);
        setUsers((prevUsers) => [...prevUsers, response.data]);
      }
      setName("");
      setEmail("");
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Gagal menyimpan data.");
    }
  };

  // 3. DELETE DATA
  const deleteUser = async (id) => {
    try {
      await api.delete(`/api/${id}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Error deleting data:", error);
      alert("Gagal menghapus data.");
    }
  };

  // 4. DELETE ALL
  const handleDeleteAll = async () => {
    const confirmDelete = window.confirm("Yakin ingin menghapus SEMUA data?");
    if (!confirmDelete) return;

    setIsDeletingAll(true);
    try {
      const deletePromises = users.map((user) => api.delete(`/api/${user.id}`));
      await Promise.all(deletePromises);
      setUsers([]);
    } catch (error) {
      console.error("Error deleting all data:", error);
      alert("Terjadi kesalahan saat menghapus semua data.");
    } finally {
      setIsDeletingAll(false);
    }
  };

  const editUser = (user) => {
    setEditId(user.id);
    setName(user.name || "");
    setEmail(user.email || "");
  };

  return (
    <div className="w-full text-white font-sans">
      
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2 tracking-wide drop-shadow-md">
          Kelola Pengguna 👥
        </h1>
        <p className="text-gray-300 text-base md:text-lg">
          Tambah, edit, dan hapus data pengguna dengan mudah.
        </p>
      </div>

      {/* Form Glassmorphism */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] mb-8">
        <h2 className="text-xl font-semibold mb-4 border-b border-white/10 pb-2">
          {editId !== null ? "Edit User" : "Tambah User Baru"}
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            addUser();
          }}
          className="flex flex-col md:flex-row gap-4"
        >
          <input
            type="text"
            placeholder="Nama Lengkap"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all backdrop-blur-sm"
          />

          <input
            type="email"
            placeholder="Alamat Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all backdrop-blur-sm"
          />

          <button
            type="submit"
            className={`${getThemeAccent()} text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg cursor-pointer disabled:opacity-50`}
            disabled={isDeletingAll}
          >
            {editId !== null ? "Simpan Perubahan" : "+ Tambah"}
          </button>
        </form>
      </div>

      {/* Daftar User & Tombol Delete All */}
      <div className="mb-6 flex justify-between items-end">
        <h3 className="text-2xl font-bold tracking-wide border-b-2 border-white/30 pb-1 inline-block">
          Daftar Pengguna
        </h3>
        
        {users.length > 0 && (
          <button
            onClick={handleDeleteAll}
            disabled={isDeletingAll}
            className="bg-red-500/20 hover:bg-red-500/40 border border-red-500/50 text-red-200 py-2 px-5 rounded-xl text-sm font-bold transition-all shadow-lg cursor-pointer disabled:opacity-50 backdrop-blur-md"
          >
            {isDeletingAll ? "Menghapus..." : "🗑️ Hapus Semua"}
          </button>
        )}
      </div>

      {/* Status Handler */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <p className="text-gray-300 animate-pulse text-lg">Memuat data dari MockAPI...</p>
        </div>
      ) : error ? (
        <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-xl text-center backdrop-blur-md">
          {error}
        </div>
      ) : users.length === 0 ? (
        <div className="bg-white/5 border border-white/10 p-8 rounded-2xl text-center text-gray-400 backdrop-blur-sm">
          Belum ada data user. Silakan tambah data baru di atas!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-white/5 backdrop-blur-lg border border-white/10 p-5 rounded-2xl hover:bg-white/10 transition-all shadow-lg flex flex-col justify-between"
            >
              <div className="mb-4">
                <h3 className="text-xl font-bold text-white mb-1 truncate">
                  {user.name || "Tanpa Nama"}
                </h3>
                <p className="text-gray-300 text-sm truncate">
                  {user.email || "Tanpa Email"}
                </p>
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
                <button
                  onClick={() => editUser(user)}
                  disabled={isDeletingAll}
                  className="flex-1 bg-blue-500/20 hover:bg-blue-500/40 border border-blue-500/30 text-blue-200 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer disabled:opacity-50"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteUser(user.id)}
                  disabled={isDeletingAll}
                  className="flex-1 bg-red-500/20 hover:bg-red-500/40 border border-red-500/30 text-red-200 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer disabled:opacity-50"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default Tasks;