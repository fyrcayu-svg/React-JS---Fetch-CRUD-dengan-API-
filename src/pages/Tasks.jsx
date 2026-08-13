import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

function Tasks() {
  const { currentTheme } = useOutletContext();

  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState(null);

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

  // 1. LOAD DATA DARI LOCALSTORAGE SAAT PERTAMA KALI DIBUKA
  useEffect(() => {
    const loadLocalTodos = () => {
      try {
        const savedData = localStorage.getItem("local_todos");
        if (savedData) {
          setTodos(JSON.parse(savedData));
        }

      } catch (err) {
        console.error("Gagal memuat data lokal:", err);
      } finally {
        setLoading(false);
      }
    };

    // Simulasi jeda sepersekian detik ala AJAX agar animasi loading tetap mulus
    const timer = setTimeout(loadLocalTodos, 300);
    return () => clearTimeout(timer);
  }, []);

  // FUNGSI BANTUAN: Simpan array terbaru ke localStorage
  const saveToLocalStorage = (updatedTodos) => {
    setTodos(updatedTodos);
    localStorage.setItem("local_todos", JSON.stringify(updatedTodos));
  };

  // 2. TAMBAH ATAU EDIT TUGAS (LOCAL API)
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    if (editId !== null) {
      // Proses EDIT data lokal
      const updatedList = todos.map((item) => {
        if (item.id === editId) {
          return { ...item, title: title.trim(), description: description.trim() };
        }
        return item;
      });
      saveToLocalStorage(updatedList);
      setEditId(null);
    } else {
      // Proses TAMBAH data baru lokal (membuat ID unik pakai Date.now())
      const newItem = {
        id: Date.now().toString(),
        title: title.trim(),
        description: description.trim(),
        completed: false,
      };
      saveToLocalStorage([...todos, newItem]);
    }

    setTitle("");
    setDescription("");
  };

  // 3. TOGGLE STATUS SELESAI / BELUM
  const toggleComplete = (id) => {
    const updatedList = todos.map((item) => {
      if (item.id === id) {
        return { ...item, completed: !item.completed };
      }
      return item;
    });
    saveToLocalStorage(updatedList);
  };

  // 4. HAPUS SATU TUGAS
  const deleteTodo = (id) => {
    const updatedList = todos.filter((item) => item.id !== id);
    saveToLocalStorage(updatedList);
  };

  // 5. HAPUS SEMUA TUGAS
  const handleDeleteAll = () => {
    const confirmDelete = window.confirm("Yakin ingin menghapus SEMUA catatan tugas lokal?");
    if (!confirmDelete) return;

    saveToLocalStorage([]);
  };

  // 6. PERSIAPAN EDIT
  const handleEdit = (todo) => {
    setEditId(todo.id);
    setTitle(todo.title || "");
    setDescription(todo.description || "");
  };

  return (
    <div className="w-full text-white font-sans max-w-4xl mx-auto">
      
      {/* Header Section */}
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2 tracking-wide drop-shadow-md">
          To-Do Notes 
        </h1>
        <p className="text-gray-300 text-base md:text-lg">
          Penyimpanan data lokal mandiri yang aman dan cepat di browser-mu.
        </p>
      </div>

      {/* Form Input Gaya Catatan */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] mb-10">
        <h2 className="text-lg font-semibold mb-4 border-b border-white/10 pb-2 text-gray-200">
          {editId !== null ? "✏️ Edit Catatan Tugas" : "📝 Tambah Catatan Baru"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Judul Tugas..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all backdrop-blur-sm"
          />

          <textarea
            placeholder="Tulis detail catatan atau isi tugas di sini..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all backdrop-blur-sm resize-none"
          />

          <div className="flex justify-end gap-3">
            {editId !== null && (
              <button
                type="button"
                onClick={() => {
                  setEditId(null);
                  setTitle("");
                  setDescription("");
                }}
                className="bg-gray-600/30 hover:bg-gray-600/50 border border-gray-500/30 text-gray-300 font-semibold py-2.5 px-6 rounded-xl transition-all cursor-pointer text-sm"
              >
                Batal
              </button>
            )}

            <button
              type="submit"
              className={`${getThemeAccent()} text-white font-semibold py-2.5 px-6 rounded-xl transition-all duration-300 shadow-lg cursor-pointer text-sm`}
            >
              {editId !== null ? "Simpan Perubahan" : "+ Simpan ke Catatan"}
            </button>
          </div>
        </form>
      </div>

      {/* Daftar Catatan & Tombol Hapus Semua */}
      <div className="mb-6 flex justify-between items-center">
        <h3 className="text-xl font-bold tracking-wide border-b-2 border-white/30 pb-1">
          Daftar Catatan ({todos.length})
        </h3>
        
        {todos.length > 0 && (
          <button
            onClick={handleDeleteAll}
            className="bg-red-500/20 hover:bg-red-500/40 border border-red-500/50 text-red-200 py-1.5 px-4 rounded-xl text-xs font-bold transition-all shadow-lg cursor-pointer backdrop-blur-md"
          >
            🗑️ Hapus Semua
          </button>
        )}
      </div>

      {/* Status Handler */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <p className="text-gray-300 animate-pulse text-lg">Memuat catatan...</p>
        </div>
      ) : todos.length === 0 ? (
        <div className="bg-white/5 border border-white/10 p-8 rounded-2xl text-center text-gray-400 backdrop-blur-sm">
          Belum ada catatan tugas lokal. Yuk buat catatan pertamamu di atas! 📋
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className={`backdrop-blur-xl border p-5 rounded-2xl transition-all shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                todo.completed 
                  ? 'bg-emerald-950/20 border-emerald-500/30 opacity-75' 
                  : 'bg-white/10 border-white/15 hover:bg-white/15'
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h4 className={`text-lg font-bold text-white tracking-wide truncate ${todo.completed ? 'line-through text-emerald-300/80' : ''}`}>
                    {todo.title || "Tanpa Judul"}
                  </h4>
                  
                  {todo.completed && (
                    <span className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs px-2.5 py-0.5 rounded-full font-medium">
                      Selesai ✓
                    </span>
                  )}
                </div>

                <p className={`text-sm whitespace-pre-wrap ${todo.completed ? 'text-gray-400 line-through' : 'text-gray-300'}`}>
                  {todo.description || "Tidak ada deskripsi."}
                </p>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto justify-end pt-3 md:pt-0 border-t md:border-t-0 border-white/10 shrink-0">
                
                <button
                  onClick={() => toggleComplete(todo.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                    todo.completed
                      ? 'bg-amber-500/20 hover:bg-amber-500/30 border-amber-500/40 text-amber-200'
                      : 'bg-emerald-500/20 hover:bg-emerald-500/40 border-emerald-500/40 text-emerald-200'
                  }`}
                >
                  {todo.completed ? "↩ Batal" : "✓ Sudah"}
                </button>

                <button
                  onClick={() => handleEdit(todo)}
                  className="px-3.5 py-2 bg-blue-500/20 hover:bg-blue-500/40 border border-blue-500/30 text-blue-200 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="px-3.5 py-2 bg-red-500/20 hover:bg-red-500/40 border border-red-500/30 text-red-200 rounded-xl text-xs font-semibold transition-all cursor-pointer"
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