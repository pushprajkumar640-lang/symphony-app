import React from 'react';
import { Play } from 'lucide-react';
import { Artist } from '../types';

interface ArtistCardProps {
  artist: Artist;
  onSelect: (artist: Artist) => void;
}

export default function ArtistCard({ artist, onSelect }: ArtistCardProps) {
  return (
    <div 
      onClick={() => onSelect(artist)}
      className="group relative flex flex-col items-center text-center gap-3 p-4 bg-[#181818] hover:bg-[#282828] rounded-xl cursor-pointer transition-all duration-300"
      id={`artist-card-${artist.id}`}
    >
      {/* Avatar Container */}
      <div className="relative w-full aspect-square rounded-full overflow-hidden shadow-lg shadow-black/40" id="artist-avatar-container">
        <img 
          src={artist.image} 
          alt={artist.artistName} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />

        {/* Hover play button overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(artist);
            }}
            className="w-12 h-12 rounded-full bg-[#E8B54D] text-[#121212] flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all transform translate-y-2 group-hover:translate-y-0 duration-300"
            id={`btn-artist-play-${artist.id}`}
          >
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-0.5 min-w-0 px-1" id="artist-labels">
        <h4 className="text-sm font-bold text-white truncate group-hover:text-[#E8B54D] transition-colors">
          {artist.artistName}
        </h4>
        <p className="text-[11px] text-gray-400">
          Artist
        </p>
      </div>

    </div>
  );
}
