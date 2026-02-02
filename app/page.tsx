'use client';

import { useState } from 'react';

interface RoastResult {
  username: string;
  avatar: string;
  roasts: string[];
  stats: {
    repos: number;
    followers: number;
    following: number;
    topLanguages: string[];
    accountAge: string;
    bio: string | null;
  };
}

export default function Home() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RoastResult | null>(null);
  const [error, setError] = useState('');

  const handleRoast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch(`/api/roast?username=${encodeURIComponent(username.trim())}`);
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to roast');
      }
      
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 p-4">
      <div className="max-w-2xl mx-auto pt-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">
            🔥 Git Roast 🔥
          </h1>
          <p className="text-white/90 text-lg">
            Get a friendly roast based on your GitHub profile
          </p>
          <p className="text-white/70 text-sm mt-1">
            All in good fun! No feelings were harmed in the making of this roast.
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleRoast} className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter GitHub username..."
              className="flex-1 px-4 py-3 rounded-lg text-lg focus:outline-none focus:ring-4 focus:ring-yellow-400 shadow-lg"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !username.trim()}
              className="px-6 py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
            >
              {loading ? '🔥...' : 'Roast!'}
            </button>
          </div>
        </form>

        {/* Error */}
        {error && (
          <div className="bg-red-900/50 border border-red-400 text-white p-4 rounded-lg mb-6">
            ❌ {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="bg-white/95 backdrop-blur rounded-xl shadow-2xl overflow-hidden">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 flex items-center gap-4">
              <img
                src={result.avatar}
                alt={result.username}
                className="w-20 h-20 rounded-full border-4 border-yellow-400"
              />
              <div>
                <h2 className="text-2xl font-bold text-white">@{result.username}</h2>
                <div className="flex gap-4 text-gray-300 text-sm mt-1">
                  <span>📦 {result.stats.repos} repos</span>
                  <span>👥 {result.stats.followers} followers</span>
                  <span>🗓️ {result.stats.accountAge}</span>
                </div>
                {result.stats.topLanguages.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {result.stats.topLanguages.map((lang) => (
                      <span key={lang} className="px-2 py-0.5 bg-gray-700 text-gray-300 rounded text-xs">
                        {lang}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Roasts */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                🔥 The Roast 🔥
              </h3>
              <div className="space-y-3">
                {result.roasts.map((roast, i) => (
                  <div
                    key={i}
                    className="bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-400 p-4 rounded-r-lg"
                  >
                    <p className="text-gray-800">{roast}</p>
                  </div>
                ))}
              </div>
              
              {/* Disclaimer */}
              <p className="text-center text-gray-500 text-sm mt-6">
                🤗 Remember: This is all in good fun! You&apos;re actually awesome.
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center mt-12 text-white/70 text-sm">
          <p>
            Built with 🔥 by{' '}
            <a href="https://henry-the-great.com" className="underline hover:text-white">
              Henry the Great
            </a>
          </p>
          <p className="mt-1">
            <a href="https://github.com/kevinelliott/henry-git-roast" className="underline hover:text-white">
              View Source
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
