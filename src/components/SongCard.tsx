import React, { useState } from 'react';
import { Play, Pause, Plus, Check, Heart } from 'lucide-react';
import { Song, Playlist } from '../types';

interface SongCardProps {
  key?: React.Key | number;
  song: Song;
  isPlaying: boolean;
  isActive: boolean;
  onPlay: (song: Song) => void;
  playlists: Playlist[];
  onAddToPlaylist: (playlistId: string, song: Song) => void;
  favorites: Song[];
  onToggleFavorite: (song: Song) => void;
}

export default function SongCard({
  song,
  isPlaying,
  isActive,
  onPlay,
  playlists,
  onAddToPlaylist,
  favorites,
  onToggleFavorite
}: SongCardProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const isFav = favorites.some((f) => f.id === song.id);

  const handleDropdownToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  return (
    <div 
      onClick={() => onPlay(song)}
      className={`group relative flex flex-col gap-3 p-4 bg-[#181818] hover:bg-[#282828] rounded-xl cursor-pointer transition-all duration-300 border border-transparent ${
        isActive ? 'border-[#E8B54D]/40 bg-[#1c1c1c]' : ''
      }`}
      id={`song-card-${song.id}`}
    >
      {/* Thumbnail and Hover Play button */}
      <div className="relative w-full aspect-square rounded-md overflow-hidden shadow-lg shadow-black/50" id="card-thumbnail-container">
        <img 
          src={song.songImage} 
          alt={song.songName} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />

        {/* Glow Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlay(song);
            }}
            className="w-12 h-12 rounded-full bg-[#E8B54D] text-[#121212] flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all transform translate-y-2 group-hover:translate-y-0 duration-300"
            id={`btn-card-play-${song.id}`}
          >
            {isActive && isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>
        </div>

        {/* Action button overlay on top corner */}
        <div className="absolute top-2 right-2 md:opacity-0 md:group-hover:opacity-100 opacity-100 transition-opacity flex gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(song);
            }}
            className={`p-1.5 rounded-full bg-[#121212]/80 backdrop-blur-sm transition-colors ${
              isFav ? 'text-[#E8B54D]' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
          </button>
          <div className="relative">
            <button
              onClick={handleDropdownToggle}
              className="p-1.5 rounded-full bg-[#121212]/80 backdrop-blur-sm text-gray-400 hover:text-white transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            {showDropdown && (
              <div 
                className="absolute right-0 mt-1 w-40 bg-[#1f1f1f] rounded-lg border border-[#333] shadow-xl py-1 z-30"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-2.5 py-1.5 text-[9px] font-extrabold text-gray-400 uppercase tracking-widest border-b border-[#2d2d2d]">Add to Playlist</div>
                {playlists.length === 0 ? (
                  <div className="px-3 py-2 text-[10px] text-gray-500 italic">No custom playlists</div>
                ) : (
                  playlists.map((pl) => {
                    const alreadyIn = pl.songs.some((s) => s.id === song.id);
                    return (
                      <button
                        key={pl.id}
                        onClick={() => {
                          onAddToPlaylist(pl.id, song);
                          setShowDropdown(false);
                        }}
                        className="w-full px-3 py-1.5 text-left text-[11px] text-gray-300 hover:bg-[#282828] hover:text-[#E8B54D] flex items-center justify-between"
                      >
                        <span className="truncate">{pl.name}</span>
                        {alreadyIn && <Check className="w-3 h-3 text-[#E8B54D]" />}
                      </button>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Info labels */}
      <div className="flex flex-col gap-1 min-w-0" id="card-labels">
        <h4 className="text-sm font-bold text-white truncate group-hover:text-[#E8B54D] transition-colors">
          {song.songName}
        </h4>
        <p className="text-[11px] text-gray-400 truncate leading-relaxed">
          {song.songDes}
        </p>
      </div>

    </div>
  );
}
