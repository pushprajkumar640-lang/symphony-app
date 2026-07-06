import React from 'react';
import { Disc, Search, FolderOpen, Shield, Download, CreditCard, HelpCircle, LogOut, User as UserIcon } from 'lucide-react';
import { ActiveTab, UserProfile } from '../types';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  user: UserProfile | null;
  onLogout: () => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSelectPlaylist: (playlistId: string | null) => void;
  onClearFavorites: () => void;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  user,
  onLogout,
  onOpenAuth,
  searchQuery,
  setSearchQuery,
  onSelectPlaylist,
  onClearFavorites
}: NavbarProps) {
  const handleHomeClick = () => {
    setActiveTab('home');
    onSelectPlaylist(null);
    onClearFavorites();
  };

  const userInitial = user 
    ? (user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase())
    : '';

  return (
    <nav className="flex items-center justify-between px-4 py-2 bg-black text-white sticky top-0 z-50 gap-4" id="symphony-navbar">
      
      {/* Left Portion */}
      <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1 md:flex-initial">
        {/* Logo */}
        <div 
          onClick={handleHomeClick}
          className="flex items-center gap-1.5 md:gap-2 cursor-pointer group shrink-0"
          id="navbar-logo"
        >
          <Disc className="w-7 h-7 md:w-8 md:h-8 text-[#E8B54D] group-hover:rotate-45 transition-transform duration-500 animate-spin-slow shrink-0" />
          <span className="text-sm md:text-xl font-black tracking-tight text-white font-sans hidden sm:inline-block">Symphony</span>
        </div>

        {/* Home Icon */}
        <button
          onClick={handleHomeClick}
          className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm transition-all duration-200 shrink-0 ${
            activeTab === 'home' 
              ? 'bg-[#E8B54D] text-[#121212] font-bold scale-105' 
              : 'bg-[#181818] hover:bg-[#282828] text-white hover:scale-105'
          }`}
          id="navbar-home-btn"
          title="Home"
        >
          <svg className="w-4.5 h-4.5 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </button>

        {/* Search Bar */}
        <div className="relative flex items-center bg-[#181818] rounded-full border border-transparent focus-within:border-white focus-within:bg-[#282828] transition-all px-2.5 md:px-3 py-1.5 md:py-2 flex-1 md:flex-initial w-full max-w-[130px] xs:max-w-[180px] sm:max-w-[220px] md:w-72" id="navbar-search-bar">
          <Search className="w-3.5 h-3.5 text-gray-400 mr-1.5 shrink-0" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-white text-[11px] md:text-xs w-full placeholder-gray-500 font-sans"
            id="navbar-search-input"
          />
          <button 
            onClick={() => alert("Browse categories feature coming soon!")}
            className="ml-1.5 pl-1.5 border-l border-[#282828] text-gray-400 hover:text-white shrink-0"
            title="Browse Folders"
          >
            <FolderOpen className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Right Portion */}
      <div className="flex items-center gap-2 md:gap-6 shrink-0">
        
        {/* Navigation Tabs (Premium, Support, Download) */}
        <div className="hidden md:flex items-center gap-6 font-semibold text-xs text-gray-400 uppercase tracking-wider" id="navbar-nav-tabs">
          <button
            onClick={() => setActiveTab('premium')}
            className={`flex items-center gap-1.5 transition-colors hover:text-white ${
              activeTab === 'premium' ? 'text-[#E8B54D] font-bold' : ''
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Premium</span>
          </button>
          
          <button
            onClick={() => setActiveTab('support')}
            className={`flex items-center gap-1.5 transition-colors hover:text-white ${
              activeTab === 'support' ? 'text-[#E8B54D] font-bold' : ''
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Support</span>
          </button>
          
          <button
            onClick={() => setActiveTab('download')}
            className={`flex items-center gap-1.5 transition-colors hover:text-white ${
              activeTab === 'download' ? 'text-[#E8B54D] font-bold' : ''
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>

        {/* Auth status display or login trigger */}
        <div className="flex items-center gap-2 md:gap-3" id="navbar-auth-controls">
          <button
            onClick={() => setActiveTab('install')}
            className={`hidden sm:inline-block px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-transform hover:scale-105 ${
              activeTab === 'install' 
                ? 'bg-[#E8B54D] text-[#121212]' 
                : 'text-gray-300 hover:text-white bg-[#181818]'
            }`}
          >
            Install App
          </button>

          {user ? (
            <div className="flex items-center gap-2 md:gap-3 bg-[#181818] pl-2 md:pl-3 pr-1.5 md:pr-2 py-1 md:py-1.5 rounded-full border border-[#282828]" id="profile-container">
              <span className="text-xs font-bold text-gray-200 hidden sm:inline-block truncate max-w-[100px]">
                {user.displayName || user.email.split('@')[0]}
              </span>
              <div 
                className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-[#E8B54D] text-[#121212] flex items-center justify-center text-[10px] md:text-xs font-bold uppercase shadow-inner shrink-0"
                title={user.email}
              >
                {userInitial}
              </div>
              <button
                onClick={onLogout}
                className="p-1 rounded-full hover:bg-[#282828] text-gray-400 hover:text-red-400 transition-colors"
                title="Log Out"
                id="btn-navbar-logout"
              >
                <LogOut className="w-3 h-3 md:w-3.5 md:h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 md:gap-2">
              <button
                onClick={() => onOpenAuth('signup')}
                className="px-2 py-1.5 md:px-4 md:py-2 text-[10px] md:text-xs font-bold text-gray-300 hover:text-white transition-all hover:scale-105"
                id="btn-navbar-signup"
              >
                Sign Up
              </button>
              <button
                onClick={() => onOpenAuth('login')}
                className="px-3 py-1.5 md:px-5 md:py-2 text-[10px] md:text-xs font-extrabold bg-[#E8B54D] hover:bg-[#f0c568] text-[#121212] rounded-full transition-all hover:scale-105 shadow-md active:scale-95 shrink-0"
                id="btn-navbar-login"
              >
                Log In
              </button>
            </div>
          )}

        </div>

      </div>

    </nav>
  );
}
