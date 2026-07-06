import React, { useState } from 'react';
import { Plus, ListMusic, BookOpen, Compass, Globe, Shield, Heart } from 'lucide-react';
import { Playlist, Song } from '../types';

interface SidebarProps {
  playlists: Playlist[];
  selectedPlaylistId: string | null;
  onSelectPlaylist: (playlistId: string | null) => void;
  onCreatePlaylist: (name: string, description: string) => void;
  favorites: Song[];
  onSelectFavorites: () => void;
  isFavoritesSelected: boolean;
}

export default function Sidebar({
  playlists,
  selectedPlaylistId,
  onSelectPlaylist,
  onCreatePlaylist,
  favorites,
  onSelectFavorites,
  isFavoritesSelected
}: SidebarProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDes, setNewPlaylistDes] = useState('');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;

    onCreatePlaylist(newPlaylistName.trim(), newPlaylistDes.trim());
    setNewPlaylistName('');
    setNewPlaylistDes('');
    setShowCreateModal(false);
  };

  return (
    <div className="w-[280px] shrink-0 bg-[#121212] rounded-xl p-4 flex flex-col gap-6" id="symphony-sidebar">
      
      {/* Library Head */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2.5 text-gray-400">
          <BookOpen className="w-5 h-5" />
          <span className="text-sm font-bold text-white uppercase tracking-wider">Your Library</span>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="p-1.5 rounded-full hover:bg-[#282828] text-gray-400 hover:text-white transition-colors"
          title="Create Playlist"
          id="btn-trigger-create-playlist"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="flex flex-col gap-2" id="sidebar-nav">
        {/* All Music */}
        <button
          onClick={() => {
            onSelectPlaylist(null);
          }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all text-left ${
            selectedPlaylistId === null && !isFavoritesSelected
              ? 'bg-[#E8B54D] text-[#121212]'
              : 'text-gray-300 hover:bg-[#1c1c1c] hover:text-white'
          }`}
          id="btn-sidebar-all-music"
        >
          <Compass className="w-4 h-4" />
          <span>All Symphony Tracks</span>
        </button>

        {/* Favorite Songs list */}
        <button
          onClick={onSelectFavorites}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all text-left ${
            isFavoritesSelected
              ? 'bg-[#E8B54D] text-[#121212]'
              : 'text-gray-300 hover:bg-[#1c1c1c] hover:text-white'
          }`}
          id="btn-sidebar-favorites"
        >
          <Heart className={`w-4 h-4 ${isFavoritesSelected ? 'fill-current' : ''}`} />
          <div className="flex justify-between items-center w-full">
            <span>Liked Songs</span>
            {favorites.length > 0 && (
              <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${
                isFavoritesSelected ? 'bg-[#121212] text-[#E8B54D]' : 'bg-[#282828] text-[#E8B54D]'
              }`}>
                {favorites.length}
              </span>
            )}
          </div>
        </button>
      </div>

      {/* Playlist List */}
      <div className="flex flex-col gap-2 overflow-y-auto max-h-[220px] scrollbar-thin" id="sidebar-playlist-list">
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 px-3">Custom Playlists</span>
        {playlists.length === 0 ? (
          <div className="px-3 py-4 bg-[#181818] rounded-xl border border-[#242424] flex flex-col gap-1 text-center">
            <h5 className="text-xs font-bold text-gray-300">Create your first list</h5>
            <p className="text-[10px] text-gray-500">It's simple, we'll help you</p>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="mt-2.5 px-3 py-1.5 self-center bg-white hover:bg-gray-100 text-black text-[10px] font-extrabold rounded-full transition-transform active:scale-95"
            >
              Create Playlist
            </button>
          </div>
        ) : (
          playlists.map((pl) => (
            <button
              key={pl.id}
              onClick={() => onSelectPlaylist(pl.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all text-left ${
                selectedPlaylistId === pl.id && !isFavoritesSelected
                  ? 'bg-[#282828] text-[#E8B54D] font-bold border-l-4 border-[#E8B54D]'
                  : 'text-gray-400 hover:bg-[#181818] hover:text-white'
              }`}
            >
              <ListMusic className="w-4 h-4 shrink-0" />
              <div className="truncate">
                <div className="truncate font-semibold">{pl.name}</div>
                <div className="text-[10px] text-gray-500 truncate">{pl.songs.length} tracks</div>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Info Boxes */}
      <div className="p-4 bg-[#181818] rounded-xl border border-[#242424] flex flex-col gap-1.5 text-xs text-left" id="sidebar-podcast-box">
        <h5 className="font-bold text-white">Let's find some podcasts</h5>
        <p className="text-[11px] text-gray-400 leading-normal">We'll keep you updated on new trending science & art episodes.</p>
        <button 
          onClick={() => alert("Podcast browser module coming soon! Stay tuned.")}
          className="mt-2 self-start px-4 py-1.5 bg-white hover:bg-gray-100 text-[#121212] font-bold text-[10px] rounded-full transition-transform active:scale-95"
        >
          Browse Podcasts
        </button>
      </div>

      {/* Legal and Support Info */}
      <div className="mt-auto pt-4 border-t border-[#242424] flex flex-wrap gap-x-3 gap-y-1.5 text-[10px] text-gray-500 font-medium px-1 leading-normal" id="sidebar-footer-links">
        <a href="#legal" onClick={(e) => { e.preventDefault(); alert("Legal info and safety policies."); }} className="hover:text-gray-300 hover:underline">Legal</a>
        <a href="#privacy" onClick={(e) => { e.preventDefault(); alert("Privacy Policy."); }} className="hover:text-gray-300 hover:underline">Privacy Center</a>
        <a href="#cookies" onClick={(e) => { e.preventDefault(); alert("Cookies Policies."); }} className="hover:text-gray-300 hover:underline">Cookies</a>
        <a href="#ads" onClick={(e) => { e.preventDefault(); alert("Advertising options."); }} className="hover:text-gray-300 hover:underline">About Ads</a>
        <a href="#accessibility" onClick={(e) => { e.preventDefault(); alert("Accessibility configurations."); }} className="hover:text-gray-300 hover:underline">Accessibility</a>
      </div>

      {/* Create Playlist Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#181818] rounded-xl border border-[#282828] p-5 flex flex-col gap-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Create Custom Playlist</h3>
            <form onSubmit={handleCreateSubmit} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-gray-400">Playlist Name</label>
                <input
                  type="text"
                  placeholder="My Playlist #1"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#242424] border border-[#282828] text-white text-xs rounded-lg focus:outline-none focus:border-[#E8B54D]"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-gray-400">Description</label>
                <input
                  type="text"
                  placeholder="A collection of cozy tracks"
                  value={newPlaylistDes}
                  onChange={(e) => setNewPlaylistDes(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#242424] border border-[#282828] text-white text-xs rounded-lg focus:outline-none focus:border-[#E8B54D]"
                />
              </div>
              <div className="flex gap-2 justify-end mt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-[#242424] text-white text-xs font-semibold rounded-full hover:bg-[#2e2e2e]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#E8B54D] text-[#121212] text-xs font-extrabold rounded-full hover:bg-[#f0c568]"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
