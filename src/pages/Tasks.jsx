import { useEffect, useState, useMemo } from "react";
import { useOutletContext } from "react-router-dom";

function Tasks() {
  const { currentTheme } = useOutletContext();

  const [todos, setTodos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const getThemeAccent = () => {
    switch (currentTheme) {
      case 'gold': return "bg-amber-600 hover:bg-amber-500";
      case 'blue': return "bg-blue-600 hover:bg-blue-500";
      case 'pink': return "bg-pink-600 hover:bg-pink-500";
      default: return "bg-purple-600 hover:bg-purple-500";
    }
  };

  useEffect(() => {
    const fetchDualApis = async () => {
      try {
        setLoading(true);
        const [res1, res2] = await Promise.all([
          fetch("https://6a7d14e8f8b2ed99ca4dcf70.mockapi.io/api"),
          fetch("https://dummyjson.com/products?limit=5")
        ]);

        if (!res1.ok || !res2.ok) throw new Error("Gagal terhubung ke salah satu server API.");

        const data1 = await res1.json()
        const data2 = await res2.json();

        setTodos(Array.isArray(data1) ? data1 : []);
        setCategories(data2.products || []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Terjadi kesalahan saat mengambil data dari 2 sumber API.");
        setLoading(false);
      }
    };

    fetchDualApis();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Judul tugas wajib diisi!");
      return;
    }

    const payload = {
      title: title.trim(),
      description: description.trim(),
      completed: false,
    };

    try {
      if (editId !== null) {
        const response = await fetch(`https://6a7d14e8f8b2ed99ca4dcf70.mockapi.io/api/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const updatedData = await response.json();
        setTodos(todos.map(item => item.id === editId ? updatedData : item));
        setEditId(null);
      } else {
        const response = await fetch("https://6a7d14e8f8b2ed99ca4dcf70.mockapi.io/api", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const newData = await response.json();
        setTodos([...todos, newData]);
      }
      setTitle("");
      setDescription("");
    } catch (err) {
      alert("Gagal menyimpan data ke API.");
    }
  };

  const toggleComplete = async (todo) => {
    try {
      const newStatus = !todo.completed;
      const response = await fetch(`https://6a7d14e8f8b2ed99ca4dcf70.mockapi.io/api/${todo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: newStatus }),
      });
      const updated = await response.json();
      setTodos(todos.map(item => item.id === todo.id ? updated : item));
    } catch (err) {
      alert("Gagal memperbarui status.");
    }
  };

  const deleteTodo = async (id) => {
    try {
      await fetch(`https://6a7d14e8f8b2ed99ca4dcf70.mockapi.io/api/${id}`, {
        method: "DELETE",
      });
      setTodos(todos.filter(item => item.id !== id));
    } catch (err) {
      alert("Gagal menghapus data.");
    }
  };

  const processedTodos = useMemo(() => {
    let result = [...todos];

    // 1. Searching berdasarkan Judul 
    if (searchTerm.trim() !== "") {
      result = result.filter(item => 
        item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 2. Filtering berdasarkan Status
    if (filterStatus === "completed") {
      result = result.filter(item => item.completed);
    } else if (filterStatus === "active") {
      result = result.filter(item => !item.completed);
    }

    // 3. Sorting berdasarkan ID (Terbaru/Terlama)
    result.sort((a, b) => {
      return sortOrder === "newest" ? Number(b.id) - Number(a.id) : Number(a.id) - Number(b.id);
    });

    return result;
  }, [todos, searchTerm, filterStatus, sortOrder]);

  const totalPages = Math.ceil(processedTodos.length / itemsPerPage) || 1;
  const paginatedTodos = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return processedTodos.slice(start, start + itemsPerPage);
  }, [processedTodos, currentPage]);

  return (
    <div className="w-full text-white font-sans max-w-4xl mx-auto pb-16">
      
      <div className="mb-6 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2 tracking-wide drop-shadow-md">
          To-Do Notes (Dual API Integration) 🌐
        </h1>
        <p className="text-gray-300 text-sm">
          Mengambil data dari 2 API berbeda, lengkap dengan Searching, Filter, Sorting, dan Pagination.
        </p>
      </div>

      <div className="bg-white/5 border border-white/10 p-4 rounded-2xl mb-6 backdrop-blur-xl">
        <h3 className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-2">
          ✨ Data Tambahan dari API Kedua (External API DummyJSON):
        </h3>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.slice(0, 4).map((cat) => (
            <span key={cat.id} className="bg-white/10 border border-white/10 px-3 py-1 rounded-xl text-xs text-gray-200 whitespace-nowrap">
              📦 {cat.title}
            </span>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-2xl mb-6 backdrop-blur-md">
          ⚠️ {error}
        </div>
      )}

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl mb-8">
        <h2 className="text-lg font-semibold mb-4 border-b border-white/10 pb-2">
          {editId !== null ? "Edit Catatan" : "Tambah Catatan Baru"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Judul Tugas..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/40"
          />
          <textarea
            placeholder="Deskripsi tugas..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="2"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/40 resize-none"
          />
          <div className="flex justify-end gap-2">
            {editId !== null && (
              <button
                type="button"
                onClick={() => { setEditId(null); setTitle(""); setDescription(""); }}
                className="bg-gray-600/30 px-5 py-2 rounded-xl text-sm font-semibold cursor-pointer"
              >
                Batal
              </button>
            )}
            <button
              type="submit"
              className={`${getThemeAccent()} text-white font-semibold px-6 py-2 rounded-xl text-sm shadow-lg cursor-pointer transition`}
            >
              {editId !== null ? "Simpan Perubahan" : "+ Simpan"}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 mb-6 flex flex-col md:flex-row gap-3 justify-between items-center shadow-lg">
        <input
          type="text"
          placeholder="🔍 Cari tugas..."
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          className="w-full md:w-1/3 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/40"
        />

        <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
          <select
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
            className="bg-slate-900/80 border border-white/10 rounded-xl px-3 py-2 text-sm text-gray-200 focus:outline-none cursor-pointer"
          >
            <option value="all">Semua Status</option>
            <option value="active">Belum Selesai</option>
            <option value="completed">Sudah Selesai</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="bg-slate-900/80 border border-white/10 rounded-xl px-3 py-2 text-sm text-gray-200 focus:outline-none cursor-pointer"
          >
            <option value="newest">Terbaru</option>
            <option value="oldest">Terlama</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400 animate-pulse">Mengambil data dari 2 API...</div>
      ) : paginatedTodos.length === 0 ? (
        <div className="bg-white/5 border border-white/10 p-10 rounded-2xl text-center backdrop-blur-sm shadow-xl">
          <div className="text-4xl mb-3">📂</div>
          <h4 className="text-lg font-bold text-gray-200">Tidak Ada Data Ditemukan</h4>
          <p className="text-sm text-gray-400 mt-1">Coba kata kunci pencarian lain atau reset filtermu.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {paginatedTodos.map((todo) => (
            <div
              key={todo.id}
              className={`border p-4 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 backdrop-blur-xl transition ${
                todo.completed ? 'bg-emerald-950/20 border-emerald-500/30 opacity-70' : 'bg-white/10 border-white/15'
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className={`font-bold text-white ${todo.completed ? 'line-through text-emerald-300' : ''}`}>
                    {todo.title}
                  </h4>
                  {todo.completed && <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">Selesai</span>}
                </div>
                <p className="text-sm text-gray-300 mt-1">{todo.description || "Tanpa deskripsi"}</p>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-white/10">
                <button
                  onClick={() => toggleComplete(todo)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border cursor-pointer ${
                    todo.completed ? 'bg-amber-500/20 border-amber-500/40 text-amber-200' : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200'
                  }`}
                >
                  {todo.completed ? "Batal" : "✓ Sudah"}
                </button>
                <button
                  onClick={() => { setEditId(todo.id); setTitle(todo.title); setDescription(todo.description); }}
                  className="px-3 py-1.5 bg-blue-500/20 border border-blue-500/30 text-blue-200 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="px-3 py-1.5 bg-red-500/20 border border-red-500/30 text-red-200 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-semibold disabled:opacity-30 cursor-pointer hover:bg-white/10 transition"
          >
            ← Sebelumnya
          </button>
          
          <span className="text-xs text-gray-300 px-3">
            Halaman {currentPage} dari {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-semibold disabled:opacity-30 cursor-pointer hover:bg-white/10 transition"
          >
            Selanjutnya →
          </button>
        </div>
      )}

    </div>
  );
}

export default Tasks;