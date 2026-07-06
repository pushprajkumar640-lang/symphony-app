import React, { useState, useEffect } from 'react';
import { safeOnAuthStateChanged, safeSignOut } from './firebase';
import { Song, Artist, Playlist, UserProfile, ActiveTab } from './types';
import { audioEngine } from './utils/audioEngine';

// Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import MusicPlayer from './components/MusicPlayer';
import SongCard from './components/SongCard';
import ArtistCard from './components/ArtistCard';
import AuthModal from './components/AuthModal';
import Visualizer from './components/Visualizer';
import { PremiumPanel, SupportPanel, DownloadPanel } from './components/SecondaryPanels';
import ShareModal from './components/ShareModal';

// Icons
import { Heart, Trash2, Sparkles, Disc, Plus, ListMusic, Volume2, Share2, Info } from 'lucide-react';


export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [isFavoritesSelected, setIsFavoritesSelected] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // User Authentication State
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const isOwner = user?.email?.toLowerCase() === 'pushprajkumar640@gmail.com';

  // Music Playback State
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shuffleActive, setShuffleActive] = useState(false);
  const [repeatActive, setRepeatActive] = useState(false);

  // User Library Lists State (Playlists & Favorites)
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [favorites, setFavorites] = useState<Song[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const selectedPlaylistObj = playlists.find((p) => p.id === selectedPlaylistId) || null;

  // Load User details and Local Storage State
  useEffect(() => {
    // 1. Subscribe to Authentication
    const unsubscribe = safeOnAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || undefined
        });
      } else {
        setUser(null);
      }
    });

    // 2. Load custom playlists from Local Storage
    const cachedPlaylists = localStorage.getItem('symphony_playlists');
    if (cachedPlaylists) {
      try {
        setPlaylists(JSON.parse(cachedPlaylists));
      } catch (err) {
        console.error("Error loading cached playlists:", err);
      }
    }

    // 3. Load favorites from Local Storage
    const cachedFavorites = localStorage.getItem('symphony_favorites');
    if (cachedFavorites) {
      try {
        setFavorites(JSON.parse(cachedFavorites));
      } catch (err) {
        console.error("Error loading cached favorites:", err);
      }
    }

    // 4. Load curated songs
    const loadAllSongs = async () => {
      try {
        const { SONGS } = await import('./data/songs');
        setSongs(SONGS);
      } catch (err) {
        console.error("Error importing songs:", err);
        setSongs([]);
      }
    };

    loadAllSongs();

    // 5. Global click/touch listener to resume Audio Context (Safari/Chrome autoplay policy)
    const resumeAudio = () => {
      audioEngine.resumeContext();
    };
    window.addEventListener('click', resumeAudio, { once: true });
    window.addEventListener('touchstart', resumeAudio, { once: true });

    return () => {
      unsubscribe();
      window.removeEventListener('click', resumeAudio);
      window.removeEventListener('touchstart', resumeAudio);
    };
  }, []);

  // Handle shared link query parameters on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const songIdParam = params.get('song');
    const viewParam = params.get('view');
    const playlistParam = params.get('playlist');

    if (songIdParam && songs.length > 0) {
      const sId = parseInt(songIdParam, 10);
      const foundSong = songs.find((s) => s.id === sId);
      if (foundSong) {
        setCurrentSong(foundSong);
      }
    }

    if (viewParam) {
      if (viewParam === 'favorites' || viewParam === 'liked') {
        setIsFavoritesSelected(true);
        setSelectedPlaylistId(null);
        setActiveTab('home');
      } else if (['premium', 'support', 'download', 'install'].includes(viewParam)) {
        setActiveTab(viewParam as ActiveTab);
      }
    } else if (playlistParam) {
      setSelectedPlaylistId(playlistParam);
      setIsFavoritesSelected(false);
      setActiveTab('home');
    }
  }, [playlists, songs]);

  // Update localStorage when playlists modify
  const savePlaylistsToStorage = (updatedList: Playlist[]) => {
    setPlaylists(updatedList);
    localStorage.setItem('symphony_playlists', JSON.stringify(updatedList));
  };

  // Update localStorage when favorites modify
  const saveFavoritesToStorage = (updatedFavs: Song[]) => {
    setFavorites(updatedFavs);
    localStorage.setItem('symphony_favorites', JSON.stringify(updatedFavs));
  };



  // Helper to determine what tracks are actively listed in the main container
  const getActiveTracklist = (): Song[] => {
    if (isFavoritesSelected) {
      return favorites;
    }
    if (selectedPlaylistId) {
      const pl = playlists.find((p) => p.id === selectedPlaylistId);
      return pl ? pl.songs : [];
    }
    return songs;
  };

  // Filter tracklist based on search query
  const getFilteredSongs = (): Song[] => {
    const list = getActiveTracklist();
    if (!searchQuery.trim()) return list;
    return list.filter((s) => 
      s.songName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.songDes.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Add Song to Favorite (Like/Unlike)
  const handleToggleFavorite = (song: Song) => {
    const isAlreadyFav = favorites.some((f) => f.id === song.id);
    let updated: Song[];
    if (isAlreadyFav) {
      updated = favorites.filter((f) => f.id !== song.id);
    } else {
      updated = [...favorites, song];
    }
    saveFavoritesToStorage(updated);
  };

  // Create Custom Playlist
  const handleCreatePlaylist = (name: string, description: string) => {
    const newPL: Playlist = {
      id: 'pl_' + Math.random().toString(36).substring(2, 9),
      name,
      description,
      songs: [],
      isCustom: true
    };
    const updated = [...playlists, newPL];
    savePlaylistsToStorage(updated);
  };

  // Delete Custom Playlist
  const handleDeletePlaylist = (id: string) => {
    const updated = playlists.filter((p) => p.id !== id);
    savePlaylistsToStorage(updated);
    if (selectedPlaylistId === id) {
      setSelectedPlaylistId(null);
    }
  };





  // Add Song to custom playlist
  const handleAddSongToPlaylist = (playlistId: string, song: Song) => {
    const updated = playlists.map((pl) => {
      if (pl.id === playlistId) {
        const alreadyIn = pl.songs.some((s) => s.id === song.id);
        if (alreadyIn) {
          // Remove if already in there (acting as toggle)
          return { ...pl, songs: pl.songs.filter((s) => s.id !== song.id) };
        } else {
          return { ...pl, songs: [...pl.songs, song] };
        }
      }
      return pl;
    });
    savePlaylistsToStorage(updated);
  };

  // Remove Song from specific playlist
  const handleRemoveSongFromPlaylist = (playlistId: string, songId: number) => {
    const updated = playlists.map((pl) => {
      if (pl.id === playlistId) {
        return { ...pl, songs: pl.songs.filter((s) => s.id !== songId) };
      }
      return pl;
    });
    savePlaylistsToStorage(updated);
  };

  // Audio Trigger Play Core
  const handlePlaySong = async (song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);

    audioEngine.play(song);
    setActiveTab('home'); // Bring them back to home page visualizer
  };

  // Toggle Play State
  const handlePlayToggle = () => {
    if (!currentSong) {
      if (songs.length > 0) {
        handlePlaySong(songs[0]);
      } else {
        alert("कोई गाना उपलब्ध नहीं है। (No songs available.)");
      }
      return;
    }

    if (isPlaying) {
      audioEngine.stop();
      setIsPlaying(false);
    } else {
      audioEngine.play(currentSong);
      setIsPlaying(true);
    }
  };

  // Handle Next Song in queue
  const handleNextSong = () => {
    const list = getFilteredSongs();
    if (list.length === 0) return;

    if (shuffleActive) {
      const randIdx = Math.floor(Math.random() * list.length);
      handlePlaySong(list[randIdx]);
      return;
    }

    let nextIdx = 0;
    if (currentSong) {
      const currIdx = list.findIndex((s) => s.id === currentSong.id);
      if (currIdx !== -1) {
        nextIdx = (currIdx + 1) % list.length;
      }
    }
    handlePlaySong(list[nextIdx]);
  };

  // Handle Previous Song in queue
  const handlePrevSong = () => {
    const list = getFilteredSongs();
    if (list.length === 0) return;

    if (shuffleActive) {
      const randIdx = Math.floor(Math.random() * list.length);
      handlePlaySong(list[randIdx]);
      return;
    }

    let prevIdx = list.length - 1;
    if (currentSong) {
      const currIdx = list.findIndex((s) => s.id === currentSong.id);
      if (currIdx !== -1) {
        prevIdx = (currIdx - 1 + list.length) % list.length;
      }
    }
    handlePlaySong(list[prevIdx]);
  };

  // Handle User Log out
  const handleUserLogout = async () => {
    const confirmOut = window.confirm("Are you sure you want to log out of Symphony?");
    if (confirmOut) {
      try {
        await safeSignOut();
        setUser(null);
        alert("Logged out successfully.");
      } catch (err: any) {
        console.error("Logout failure:", err);
      }
    }
  };

  // Handle Artist Card click (filters trending/genre display or shows bio)
  const handleSelectArtist = (artist: Artist) => {
    setSearchQuery(artist.artistName);
    setActiveTab('home');
    setSelectedPlaylistId(null);
    setIsFavoritesSelected(false);
  };

  // Clear playlist/favorite filters to go back to main catalog
  const handleClearFilters = () => {
    setSelectedPlaylistId(null);
    setIsFavoritesSelected(false);
  };

  // Render Core content based on tab
  const renderMainContent = () => {
    switch (activeTab) {
      case 'premium':
        return <PremiumPanel />;
      case 'support':
        return <SupportPanel />;
      case 'download':
        return <DownloadPanel />;
      case 'install':
        return (
          <div className="flex flex-col gap-6 text-white max-w-2xl mx-auto py-8 text-center" id="install-guide">
            <h1 className="text-3xl font-extrabold tracking-tight">Install Symphony App</h1>
            <p className="text-gray-400 text-sm">
              Symphony is fully optimized as a Progressive Web App (PWA) to install on your home screen or system doc immediately.
            </p>
            <div className="p-6 bg-[#181818] rounded-xl border border-[#242424] text-left flex flex-col gap-4 mt-4">
              <h3 className="font-bold text-lg text-[#E8B54D]">How to install:</h3>
              <ol className="list-decimal pl-5 flex flex-col gap-2.5 text-xs text-gray-300">
                <li>Click the **Share** or **Options** icon in your browser's address bar.</li>
                <li>Select **Add to Home Screen** or **Install App**.</li>
                <li>Launch Symphony directly from your app drawer for a native, standalone, lightweight desktop experience.</li>
              </ol>
              <button 
                onClick={() => alert("Simulating application installation... Installed successfully!")}
                className="mt-4 py-3 bg-[#E8B54D] hover:bg-[#f0c568] text-black font-bold text-xs rounded-full transition-transform active:scale-95 self-center px-8"
              >
                Trigger PWA Installer
              </button>
            </div>
          </div>
        );
      case 'home':
      default:
        // Render Dashboard Lists
        const activeList = getFilteredSongs();

        return (
          <div className="flex flex-col gap-6" id="home-dashboard">
            
            {/* Mobile Quick Library Access Bar */}
            <div className="md:hidden flex flex-col gap-2.5 pb-2 border-b border-[#1f1f1f]" id="mobile-library-bar">
              <div className="flex items-center justify-between">
                <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-[#E8B54D]">Your Library</h4>
                <button 
                  onClick={() => {
                    const name = window.prompt("Enter Playlist Name:");
                    if (name && name.trim()) {
                      handleCreatePlaylist(name.trim(), "A custom mobile playlist");
                    }
                  }}
                  className="flex items-center gap-1 text-[10px] font-bold text-gray-300 hover:text-white px-2.5 py-1 rounded-full bg-[#1e1e1e] border border-[#282828] transition-transform active:scale-95"
                >
                  <Plus className="w-3 h-3 text-[#E8B54D]" />
                  <span>Create Playlist</span>
                </button>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-[#242424] scrollbar-track-transparent" id="mobile-library-scroll">
                {/* Liked Songs card */}
                <button
                  onClick={() => {
                    setIsFavoritesSelected(true);
                    setSelectedPlaylistId(null);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 border ${
                    isFavoritesSelected
                      ? 'bg-[#E8B54D] text-[#121212] border-transparent'
                      : 'bg-[#181818] text-gray-300 border-[#242424] hover:border-white/20'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isFavoritesSelected ? 'fill-current' : ''}`} />
                  <span>Liked Songs ({favorites.length})</span>
                </button>

                {/* Custom Playlists */}
                {playlists.map((pl) => (
                  <button
                    key={pl.id}
                    onClick={() => {
                      setSelectedPlaylistId(pl.id);
                      setIsFavoritesSelected(false);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 border ${
                      selectedPlaylistId === pl.id && !isFavoritesSelected
                        ? 'bg-[#E8B54D] text-[#121212] border-transparent'
                        : 'bg-[#181818] text-gray-300 border-[#242424] hover:border-white/20'
                    }`}
                  >
                    <ListMusic className="w-3.5 h-3.5 shrink-0 text-[#E8B54D]" />
                    <span className="truncate max-w-[120px]">{pl.name} ({pl.songs.length})</span>
                  </button>
                ))}

                {playlists.length === 0 && (
                  <span className="text-[10px] text-gray-500 italic flex items-center shrink-0 pl-1">No custom playlists yet.</span>
                )}
              </div>
            </div>

            {/* Header Billboard or Visualizer */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch" id="hero-layout">
              {/* Promo Banner / Playlist Header */}
              <div className="lg:col-span-7 p-6 rounded-2xl bg-gradient-to-br from-[#222] to-[#141414] border border-[#282828] relative overflow-hidden flex flex-col justify-between min-h-[180px]" id="dashboard-hero-banner">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#E8B54D]/5 rounded-full blur-3xl" />
                
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E8B54D]/10 text-[#E8B54D] text-[10px] font-bold uppercase tracking-wider mb-3">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Symphony Acoustics</span>
                  </div>

                  {isFavoritesSelected ? (
                    <>
                      <h2 className="text-3xl font-black text-white flex items-center gap-2">
                        <Heart className="w-8 h-8 text-[#E8B54D] fill-current" />
                        <span>Liked Songs</span>
                      </h2>
                      <p className="text-xs text-gray-400 mt-2 max-w-md">
                        Your personal curated tracks. Add or remove songs instantly using the card heart triggers.
                      </p>
                    </>
                  ) : selectedPlaylistObj ? (
                    <>
                      <h2 className="text-3xl font-black text-white flex items-center gap-2">
                        <ListMusic className="w-8 h-8 text-[#E8B54D]" />
                        <span>{selectedPlaylistObj.name}</span>
                      </h2>
                      <p className="text-xs text-gray-400 mt-2 max-w-md">
                        {selectedPlaylistObj.description || 'A custom playlist tailored with selected synthesized tracks.'}
                      </p>
                    </>
                  ) : (
                    <>
                      <h2 className="text-3xl font-black text-white">Symphony Ambient Player</h2>
                      <p className="text-xs text-gray-400 mt-2 max-w-md">
                        Experience dynamic, zero-latency Web Audio waveforms customized individually. Play any card below to experience the synthesis loop!
                      </p>
                    </>
                  )}


                </div>

                <div className="flex items-center gap-3 mt-6">
                  {activeList.length > 0 ? (
                    <button
                      onClick={() => handlePlaySong(activeList[0])}
                      className="px-6 py-2.5 bg-[#E8B54D] hover:bg-[#f0c568] text-black font-extrabold text-xs rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
                    >
                      Play All
                    </button>
                  ) : (
                    <p className="text-xs text-gray-500 italic">No tracks loaded inside this list.</p>
                  )}

                  <button
                    onClick={() => setIsShareOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#242424] hover:bg-[#2e2e2e] border border-[#333] hover:border-white/30 text-white font-bold text-xs rounded-full shadow-lg transition-all hover:scale-105 active:scale-95"
                    title="Share current view or song on social platforms"
                  >
                    <Share2 className="w-4 h-4 text-[#E8B54D]" />
                    <span>Share</span>
                  </button>

                  {selectedPlaylistId && (
                    <button
                      onClick={() => handleDeletePlaylist(selectedPlaylistId)}
                      className="p-2.5 rounded-full bg-[#242424] text-red-400 hover:text-red-300 hover:bg-[#2e2e2e] transition-colors border border-[#333]"
                      title="Delete Playlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Real-time Dynamic Visualizer Canvas */}
              <div className="lg:col-span-5 h-[180px] lg:h-auto" id="visualizer-wrapper">
                <Visualizer 
                  isPlaying={isPlaying} 
                  synthType={currentSong ? currentSong.synthType || 'ambient' : 'idle'} 
                />
              </div>
            </div>

            {/* Custom Filters Indicator */}
            {(selectedPlaylistId || isFavoritesSelected || searchQuery) && (
              <div className="flex items-center justify-between bg-[#181818] p-4 rounded-xl border border-[#242424]" id="filters-bar">
                <div className="text-xs font-bold text-gray-300 flex items-center gap-2">
                  <span>Filtered to:</span>
                  <span className="px-2.5 py-1 rounded-full bg-[#E8B54D]/10 text-[#E8B54D] text-[10px] tracking-wider uppercase">
                    {isFavoritesSelected ? 'Liked Songs' : selectedPlaylistObj ? selectedPlaylistObj.name : 'Symphony Catalog'}
                  </span>
                  {searchQuery && (
                    <span className="px-2.5 py-1 rounded-full bg-white/10 text-white text-[10px] tracking-wider">
                      Search: "{searchQuery}"
                    </span>
                  )}
                </div>
                <button
                  onClick={() => {
                    handleClearFilters();
                    setSearchQuery('');
                  }}
                  className="text-xs text-[#E8B54D] hover:underline font-bold"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Songs Lists Categories / Song Composer Form */}
            {!(selectedPlaylistId || isFavoritesSelected || searchQuery) ? (
              <div className="flex flex-col gap-6" id="dashboard-catalog-root">
                

                {/* Library Catalog Block */}
                <div className="flex flex-col gap-4 mt-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex flex-col gap-1">
                      <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-[#E8B54D] rounded-full" />
                        <span>Symphony Catalog ({songs.length})</span>
                      </h3>
                    </div>
                  </div>

                  {songs.length === 0 ? (
                    <div className="p-12 bg-gradient-to-br from-[#181818] to-[#121212] rounded-2xl border border-[#242424] text-center flex flex-col items-center gap-4 justify-center">
                      <div className="w-16 h-16 rounded-full bg-[#E8B54D]/10 flex items-center justify-center border border-[#E8B54D]/25 text-[#E8B54D]">
                        <Disc className="w-8 h-8 animate-spin" style={{ animationDuration: '6s' }} />
                      </div>
                      <div className="max-w-md">
                        <h4 className="text-lg font-bold text-white mb-1.5">No songs found in catalog</h4>
                        <p className="text-xs text-gray-400">
                          The song library is currently empty.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4" id="grid-custom-songs">
                      {songs.map((song) => (
                        <SongCard
                          key={song.id}
                          song={song}
                          isPlaying={isPlaying}
                          isActive={currentSong?.id === song.id}
                          onPlay={handlePlaySong}
                          playlists={playlists}
                          onAddToPlaylist={handleAddSongToPlaylist}
                          favorites={favorites}
                          onToggleFavorite={handleToggleFavorite}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // Filtered / Custom List View
              <div className="flex flex-col gap-4" id="filtered-songs-list">
                <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-[#E8B54D] rounded-full" />
                  <span>Tracks ({activeList.length})</span>
                </h3>
                {activeList.length === 0 ? (
                  <div className="p-8 bg-[#181818] rounded-xl border border-[#242424] text-center text-gray-500 italic">
                    This list is currently empty. Add songs to favorites or playlists first!
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4" id="grid-filtered">
                    {activeList.map((song) => (
                      <SongCard
                        key={song.id}
                        song={song}
                        isPlaying={isPlaying}
                        isActive={currentSong?.id === song.id}
                        onPlay={handlePlaySong}
                        playlists={playlists}
                        onAddToPlaylist={handleAddSongToPlaylist}
                        favorites={favorites}
                        onToggleFavorite={handleToggleFavorite}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#000] text-white flex flex-col font-sans" id="symphony-root-shell">
      {/* 1. Header Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onLogout={handleUserLogout}
        onOpenAuth={(mode) => {
          setAuthMode(mode);
          setIsAuthOpen(true);
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSelectPlaylist={setSelectedPlaylistId}
        onClearFavorites={() => setIsFavoritesSelected(false)}
      />

      {/* 2. Main Content Split */}
      <div className="flex flex-1 p-1 md:p-2 gap-2 h-[calc(100vh-136px)] md:h-[calc(100vh-170px)] overflow-hidden" id="app-body-container">
        
        {/* Left Sidebar */}
        <div className="hidden md:flex shrink-0" id="sidebar-container-wrapper">
          <Sidebar
            playlists={playlists}
            selectedPlaylistId={selectedPlaylistId}
            onSelectPlaylist={(plId) => {
              setSelectedPlaylistId(plId);
              setIsFavoritesSelected(false);
              setActiveTab('home');
            }}
            onCreatePlaylist={handleCreatePlaylist}
            favorites={favorites}
            onSelectFavorites={() => {
              setIsFavoritesSelected(true);
              setSelectedPlaylistId(null);
              setActiveTab('home');
            }}
            isFavoritesSelected={isFavoritesSelected}
          />
        </div>

        {/* Central Display panel */}
        <div className="flex-1 bg-gradient-to-b from-[#181818] via-[#121212] to-[#121212] rounded-xl border border-[#1f1f1f] p-4 md:p-6 pb-24 md:pb-6 overflow-y-auto" id="main-content-scroll">
          {renderMainContent()}
        </div>

      </div>

      {/* 3. Bottom Music Player bar */}
      <MusicPlayer
        currentSong={currentSong}
        isPlaying={isPlaying}
        onPlayToggle={handlePlayToggle}
        onNext={handleNextSong}
        onPrev={handlePrevSong}
        shuffleActive={shuffleActive}
        onShuffleToggle={() => setShuffleActive(!shuffleActive)}
        repeatActive={repeatActive}
        onRepeatToggle={() => setRepeatActive(!repeatActive)}
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* Auth Popup dialog */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authMode}
        onSuccess={(firebaseUser) => {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || undefined
          });
          alert("Success! Welcome to Symphony.");
        }}
      />

      {/* Share Dialog */}
      <ShareModal 
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        currentSong={currentSong}
        selectedPlaylist={selectedPlaylistObj}
        isFavoritesSelected={isFavoritesSelected}
      />
       <div className="fixed bottom-1 right-6 text-[11px] text-gray-400 z-50">
  Made with ❤️ by Pushpraj Kumar
</div>
    </div>
  );
}
