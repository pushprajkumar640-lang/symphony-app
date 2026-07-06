import React, { useEffect, useState, useRef } from 'react';
import { 
  Play, Pause, SkipForward, SkipBack, Shuffle, Repeat, Volume2, VolumeX, Heart, Music
} from 'lucide-react';
import { Song } from '../types';
import { audioEngine } from '../utils/audioEngine';

interface MusicPlayerProps {
  currentSong: Song | null;
  isPlaying: boolean;
  onPlayToggle: () => void;
  onNext: () => void;
  onPrev: () => void;
  shuffleActive: boolean;
  onShuffleToggle: () => void;
  repeatActive: boolean;
  onRepeatToggle: () => void;
  favorites: Song[];
  onToggleFavorite: (song: Song) => void;
}

export default function MusicPlayer({
  currentSong,
  isPlaying,
  onPlayToggle,
  onNext,
  onPrev,
  shuffleActive,
  onShuffleToggle,
  repeatActive,
  onRepeatToggle,
  favorites,
  onToggleFavorite
}: MusicPlayerProps) {
  // Progress and state tracking for active audio playback
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(160);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const timerRef = useRef<number | null>(null);

  // Hook up next song event from the audio engine
  useEffect(() => {
    audioEngine.onEnded = () => {
      if (repeatActive) {
        if (currentSong) {
          audioEngine.setCurrentTime(0);
          audioEngine.play(currentSong);
        } else {
          setCurrentTime(0);
        }
      } else {
        onNext();
      }
    };
    return () => {
      audioEngine.onEnded = null;
    };
  }, [currentSong, repeatActive, onNext]);

  useEffect(() => {
    // Reset timer on song switch
    setCurrentTime(0);
    setDuration(160);
  }, [currentSong]);

  useEffect(() => {
    // Poll actual progress values from audioEngine
    timerRef.current = window.setInterval(() => {
      const d = audioEngine.getDuration();
      const t = audioEngine.getCurrentTime();
      if (!isNaN(d) && d > 0) {
        setDuration(Math.floor(d));
      }
      setCurrentTime(Math.floor(t));
    }, 250);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, currentSong]);

  // Handle Volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setVolume(val);
    if (val === 0) {
      setIsMuted(true);
      audioEngine.setVolume(0);
    } else {
      setIsMuted(false);
      audioEngine.setVolume(val);
    }
  };

  const handleMuteToggle = () => {
    if (isMuted) {
      setIsMuted(false);
      audioEngine.setVolume(volume);
    } else {
      setIsMuted(true);
      audioEngine.setVolume(0);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setCurrentTime(val);
    audioEngine.setCurrentTime(val);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
  const isFav = currentSong ? favorites.some((f) => f.id === currentSong.id) : false;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 md:h-24 bg-[#121212]/95 backdrop-blur-md border-t border-[#242424] px-4 md:px-6 flex items-center justify-between z-40 shadow-2xl" id="symphony-now-playing-bar">
      
      {/* Absolute top progress line for mobile */}
      <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-[#222] md:hidden" id="mobile-progress-tracker">
        <div 
          className="h-full bg-[#E8B54D] transition-all duration-300" 
          style={{ width: `${progressPercentage}%` }} 
        />
      </div>

      {/* Track Details */}
      <div className="flex items-center gap-2.5 md:gap-4 flex-1 md:flex-initial md:w-[280px] min-w-0" id="player-track-info">
        {currentSong ? (
          <>
            <img 
              src={currentSong.songImage} 
              alt={currentSong.songName} 
              className="w-10 h-10 md:w-14 md:h-14 rounded-md object-cover border border-[#282828] shadow-md shadow-black/40 shrink-0"
              id="player-track-img"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-xs md:text-sm font-bold text-white truncate hover:underline cursor-pointer" id="player-track-name">
                {currentSong.songName}
              </h4>
              <p className="text-[10px] md:text-[11px] text-gray-400 truncate mt-0.5" id="player-track-artist">
                {currentSong.songDes}
              </p>
            </div>
            <button
              onClick={() => onToggleFavorite(currentSong)}
              className={`p-1 rounded-full transition-colors hover:bg-white/5 ${
                isFav ? 'text-[#E8B54D]' : 'text-gray-400 hover:text-white'
              }`}
              id="player-heart-btn"
            >
              <Heart className={`w-3.5 h-3.5 md:w-4 md:h-4 ${isFav ? 'fill-current' : ''}`} />
            </button>
          </>
        ) : (
          <div className="flex items-center gap-2.5 text-gray-500 min-w-0">
            <div className="w-10 h-10 md:w-14 md:h-14 rounded-md bg-[#181818] border border-[#242424] flex items-center justify-center shrink-0">
              <Music className="w-4 h-4 md:w-5 md:h-5 text-gray-600 animate-pulse" />
            </div>
            <div className="min-w-0">
              <h4 className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-gray-400 truncate">No Song</h4>
              <p className="text-[9px] md:text-[10px] text-gray-600 mt-0.5 truncate">Select a song</p>
            </div>
          </div>
        )}
      </div>

      {/* Main Controls & Slider */}
      <div className="flex-1 max-w-xl flex flex-col items-center gap-1 md:gap-2 px-2" id="player-center-controls">
        
        {/* Buttons */}
        <div className="flex items-center gap-3.5 sm:gap-5">
          <button 
            onClick={onShuffleToggle}
            className={`p-1 rounded-full transition-colors ${
              shuffleActive ? 'text-[#E8B54D]' : 'text-gray-400 hover:text-white'
            } hidden sm:inline-block`}
            id="control-shuffle"
            title="Shuffle"
          >
            <Shuffle className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </button>

          <button 
            onClick={onPrev}
            className="p-1 rounded-full text-gray-400 hover:text-white transition-colors"
            id="control-backward"
            title="Previous"
          >
            <SkipBack className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </button>

          <button 
            onClick={onPlayToggle}
            className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-[#E8B54D] hover:bg-[#f0c568] hover:scale-105 active:scale-95 text-[#121212] flex items-center justify-center shadow-lg shadow-[#E8B54D]/10 transition-all shrink-0"
            id="control-play"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-4.5 h-4.5 md:w-5 md:h-5 fill-current" />
            ) : (
              <Play className="w-4.5 h-4.5 md:w-5 md:h-5 fill-current ml-0.5" />
            )}
          </button>

          <button 
            onClick={onNext}
            className="p-1 rounded-full text-gray-400 hover:text-white transition-colors"
            id="control-forward"
            title="Next"
          >
            <SkipForward className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </button>

          <button 
            onClick={onRepeatToggle}
            className={`p-1 rounded-full transition-colors ${
              repeatActive ? 'text-[#E8B54D]' : 'text-gray-400 hover:text-white'
            } hidden sm:inline-block`}
            id="control-repeat"
            title="Repeat"
          >
            <Repeat className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </button>
        </div>

        {/* Progress Bar (Desktop only) */}
        <div className="w-full hidden md:flex items-center gap-3" id="player-progress-container">
          <span className="text-[10px] font-mono text-gray-500 w-8 text-right">{formatTime(currentTime)}</span>
          <div className="flex-1 relative group py-2 flex items-center">
            <input 
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={handleProgressChange}
              className="w-full h-1 bg-[#333] rounded-lg appearance-none cursor-pointer outline-none focus:outline-none focus:ring-0 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:opacity-0 [&::-webkit-slider-thumb]:group-hover:opacity-100 [&::-webkit-slider-thumb]:transition-opacity"
              style={{
                background: `linear-gradient(to right, #E8B54D 0%, #E8B54D ${progressPercentage}%, #333 ${progressPercentage}%, #333 100%)`
              }}
              id="player-progress-slider"
            />
          </div>
          <span className="text-[10px] font-mono text-gray-500 w-8 text-left">{formatTime(duration)}</span>
        </div>

      </div>

      {/* Auxiliary Controls (Volume, Visualizer toggle - Desktop only) */}
      <div className="w-[280px] hidden md:flex items-center justify-end gap-3 text-gray-400" id="player-auxiliary-controls">
        
        <button
          onClick={handleMuteToggle}
          className="hover:text-white transition-colors p-1 rounded-full"
          id="btn-volume-mute"
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-red-400" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </button>

        <input 
          type="range"
          min="0"
          max="100"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className="w-24 h-1 bg-[#333] rounded-lg appearance-none cursor-pointer outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
          style={{
            background: `linear-gradient(to right, #E8B54D 0%, #E8B54D ${isMuted ? 0 : volume}%, #333 ${isMuted ? 0 : volume}%, #333 100%)`
          }}
          id="player-volume-slider"
        />

      </div>

    </div>
  );
}
