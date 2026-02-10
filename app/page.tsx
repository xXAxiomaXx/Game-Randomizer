"use client";

import { useState, useEffect } from "react";

// --- Interfaces ---
interface Store {
  id: number;
  url: string;
  store: {
    name: string;
    domain: string;
  };
}

interface Game {
  id: number;
  name: string;
  background_image: string;
  rating: number;
  released: string;
  genres: { name: string }[];
  stores: Store[];
}

interface Genre {
  id: number;
  name: string;
}

interface Platform {
  id: number;
  name: string;
}

const PLATFORMS: Platform[] = [
  { id: 1, name: "PC" },
  { id: 2, name: "PlayStation" },
  { id: 3, name: "Xbox" },
  { id: 7, name: "Nintendo" },
  { id: 5, name: "Mac / Apple" },
  { id: 4, name: "iOS" },
  { id: 8, name: "Android" },
];

export default function Home() {
  // Estados de Dados
  const [genres, setGenres] = useState<Genre[]>([]);
  const [history, setHistory] = useState<Game[]>([]); // Novo: Histórico
  
  // Estados de Seleção
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("");
  
  // Estados de UI
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const apiKey = process.env.NEXT_PUBLIC_RAWG_API_KEY;

  // 1. Carregar Gêneros e Histórico ao iniciar
  useEffect(() => {
    // Carregar gêneros
    async function fetchGenres() {
      if (!apiKey) return;
      try {
        const res = await fetch(`https://api.rawg.io/api/genres?key=${apiKey}`);
        const data = await res.json();
        setGenres(data.results);
      } catch (err) {
        console.error(err);
      }
    }
    fetchGenres();

    // Carregar histórico do LocalStorage
    const savedHistory = localStorage.getItem("gameHistory");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, [apiKey]);

  // 2. Função de Sorteio com Atualização do Histórico
  const handleRandomize = async () => {
    if (!apiKey) return alert("API Key não configurada!");
    
    setLoading(true);
    setError("");
    setGame(null);

    try {
      const randomPage = Math.floor(Math.random() * 20) + 1; 
      let url = `https://api.rawg.io/api/games?key=${apiKey}&page_size=1&page=${randomPage}`;
      
      if (selectedGenre) url += `&genres=${selectedGenre}`;
      if (selectedPlatform) url += `&parent_platforms=${selectedPlatform}`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.results && data.results.length > 0) {
        const newGame = data.results[0];
        setGame(newGame);
        
        // Atualizar histórico (evita duplicados e mantém apenas os últimos 5)
        updateHistory(newGame);
      } else {
        setError("Nenhum jogo encontrado. Tente outros filtros!");
      }
    } catch (err) {
      console.error(err);
      setError("Ocorreu um erro ao buscar o jogo.");
    } finally {
      setLoading(false);
    }
  };

  const updateHistory = (newGame: Game) => {
    setHistory((prev) => {
      // Remove o jogo se já existir na lista para o colocar no topo
      const filtered = prev.filter((g) => g.id !== newGame.id);
      const updated = [newGame, ...filtered].slice(0, 5); // Máximo 5 itens
      
      // Salvar no navegador
      localStorage.setItem("gameHistory", JSON.stringify(updated));
      return updated;
    });
  };

  // 3. Função de Partilha (WhatsApp)
  const handleShare = () => {
    if (!game) return;
    const text = `O destino escolheu *${game.name}* para eu jogar! 🎮\n(Rating: ${game.rating}/5)\n\nDescobre o teu próximo jogo aqui!`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // Função para restaurar um jogo do histórico
  const restoreFromHistory = (oldGame: Game) => {
    setGame(oldGame);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 pb-20">
      <div className="w-full max-w-lg space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Game Randomizer
          </h1>
          <p className="text-slate-400">Filtre, sorteie e partilhe a sua próxima aventura.</p>
        </div>

        {/* Controles */}
        <div className="bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-800 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Gênero</label>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5"
              >
                <option value="">🎲 Qualquer</option>
                {genres.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Plataforma</label>
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5"
              >
                <option value="">🕹️ Qualquer</option>
                {PLATFORMS.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>

          <button
            onClick={handleRandomize}
            disabled={loading}
            className="w-full text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-800 font-bold rounded-lg text-lg px-5 py-3 text-center transition-all disabled:opacity-50 shadow-lg"
          >
            {loading ? "A sortear..." : "Sortear Jogo 🚀"}
          </button>
          
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        </div>

        {/* Card do Jogo Atual */}
        {game && (
          <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 animate-fade-in-up">
            <div className="relative h-64 w-full group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={game.background_image || "https://via.placeholder.com/600x400?text=No+Image"}
                alt={game.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-0 right-0 bg-black/70 px-3 py-1 m-4 rounded-full border border-green-500/50 backdrop-blur-sm">
                <span className="text-green-400 font-bold">★ {game.rating}</span>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <h2 className="text-2xl font-bold leading-tight text-white">{game.name}</h2>
                <button 
                  onClick={handleShare}
                  className="bg-slate-950 hover:bg-slate-700 text-white p-3 rounded-full transition-colors"
                  title="Partilhar no WhatsApp"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.463 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {game.genres?.map((g) => (
                  <span key={g.name} className="bg-slate-800 text-purple-300 text-xs font-medium px-2.5 py-0.5 rounded border border-purple-900">
                    {g.name}
                  </span>
                ))}
              </div>

              {game.stores && game.stores.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {game.stores.map((s) => (
                    <span key={s.id} className="bg-slate-800 text-slate-400 px-3 py-1 rounded text-xs border border-slate-700 cursor-default">
                      {s.store.name}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex justify-between items-center text-sm text-slate-400 border-t border-slate-800 pt-4">
                <span>{game.released}</span>
                <a 
                  href={`https://rawg.io/games/${game.id}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-purple-400 hover:text-purple-300 transition-colors font-semibold"
                >
                  Ver Mais &rarr;
                </a>
              </div>
            </div>
          </div>
        )}

        {/* --- 4. Secção de Histórico --- */}
        {history.length > 0 && (
          <div className="space-y-3 pt-6 border-t border-slate-800">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide text-center">Últimos Sorteios</h3>
            <div className="space-y-2">
              {history.map((h) => (
                <div 
                  key={h.id} 
                  onClick={() => restoreFromHistory(h)}
                  className={`flex items-center gap-3 bg-slate-900 p-2 rounded-lg border border-slate-800 cursor-pointer hover:bg-slate-800 transition-colors ${game?.id === h.id ? 'ring-1 ring-purple-500' : ''}`}
                >
                  <img 
                    src={h.background_image || "https://via.placeholder.com/50"} 
                    alt={h.name}
                    className="w-12 h-12 rounded object-cover" 
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{h.name}</p>
                    <p className="text-xs text-slate-400">★ {h.rating}</p>
                  </div>
                  <span className="text-xs text-purple-400 px-2">Ver</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}