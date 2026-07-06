import React, { useState } from 'react';
import { X, Copy, Check, Twitter, Send, Mail, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { Song, Playlist } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSong: Song | null;
  selectedPlaylist: Playlist | null;
  isFavoritesSelected: boolean;
}

export default function ShareModal({
  isOpen,
  onClose,
  currentSong,
  selectedPlaylist,
  isFavoritesSelected
}: ShareModalProps) {
  const [copiedType, setCopiedType] = useState<'song' | 'view' | null>(null);

  if (!isOpen) return null;

  // Generate links
  const baseUrl = window.location.origin + window.location.pathname;
  
  const viewParam = isFavoritesSelected 
    ? 'view=favorites' 
    : selectedPlaylist 
      ? `playlist=${selectedPlaylist.id}` 
      : 'view=catalog';
      
  const songUrl = currentSong ? `${baseUrl}?song=${currentSong.id}` : '';
  const viewUrl = `${baseUrl}?${viewParam}`;

  const handleCopy = async (url: string, type: 'song' | 'view') => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const getSocialShareUrl = (platform: 'twitter' | 'whatsapp' | 'telegram' | 'email', url: string, title: string) => {
    const text = encodeURIComponent(`${title} 🎵 Check it out on Symphony Ambient Player:`);
    const encodedUrl = encodeURIComponent(url);

    switch (platform) {
      case 'twitter':
        return `https://twitter.com/intent/tweet?text=${text}&url=${encodedUrl}`;
      case 'whatsapp':
        return `https://api.whatsapp.com/send?text=${text}%20${encodedUrl}`;
      case 'telegram':
        return `https://t.me/share/url?url=${encodedUrl}&text=${text}`;
      case 'email':
        return `mailto:?subject=${encodeURIComponent('Check out this music on Symphony')}&body=${text}%20${encodedUrl}`;
      default:
        return '#';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" id="share-modal-container">
      {/* Modal backdrop wrapper to click outside to close */}
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-[#121212] border border-[#242424] rounded-2xl p-6 shadow-2xl overflow-hidden z-10 animate-scale-up" id="share-modal-content">
        {/* Glow decoration */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#E8B54D]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#222] pb-4 mb-4">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <LinkIcon className="w-5 h-5 text-[#E8B54D]" />
            <span>Share Symphony</span>
          </h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info/Warning note for user */}
        <div className="flex items-start gap-2 bg-[#E8B54D]/5 border border-[#E8B54D]/10 p-3 rounded-lg mb-4 text-[11px] text-[#E8B54D]">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <p>
            Symphony generates songs in real-time using your browser's Web Audio synthesizer. Anyone with these links can experience the dynamic synthesis loops.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {/* Option A: Share Current View */}
          <div className="bg-[#181818] p-4 rounded-xl border border-[#242424]" id="share-view-section">
            <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider mb-2">
              Share Current View
            </h4>
            <p className="text-xs text-white font-medium mb-3 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#E8B54D]" />
              {isFavoritesSelected 
                ? 'Liked Songs List' 
                : selectedPlaylist 
                  ? `Playlist: "${selectedPlaylist.name}"` 
                  : 'Symphony Music Catalog'}
            </p>
            
            {/* Copy Row */}
            <div className="flex gap-2 mb-3">
              <input 
                type="text" 
                readOnly 
                value={viewUrl}
                className="flex-1 bg-black border border-[#333] px-3 py-2 rounded-lg text-xs text-gray-300 font-mono outline-none"
              />
              <button
                onClick={() => handleCopy(viewUrl, 'view')}
                className="px-4 py-2 bg-[#E8B54D] hover:bg-[#f0c568] text-black font-extrabold text-xs rounded-lg flex items-center gap-1.5 transition-all shrink-0 active:scale-95"
              >
                {copiedType === 'view' ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Social Sharing Icons */}
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] text-gray-500 mr-2 uppercase font-bold">Quick Share:</span>
              <a 
                href={getSocialShareUrl('twitter', viewUrl, isFavoritesSelected ? 'My Liked Songs List' : selectedPlaylist ? `Playlist: "${selectedPlaylist.name}"` : 'Symphony Music Catalog')}
                target="_blank" 
                rel="noopener noreferrer"
                className="p-1.5 rounded bg-black border border-[#333] hover:border-[#1DA1F2]/50 hover:bg-[#1DA1F2]/10 text-gray-400 hover:text-[#1DA1F2] transition-colors"
                title="Share on X / Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a 
                href={getSocialShareUrl('whatsapp', viewUrl, isFavoritesSelected ? 'My Liked Songs List' : selectedPlaylist ? `Playlist: "${selectedPlaylist.name}"` : 'Symphony Music Catalog')}
                target="_blank" 
                rel="noopener noreferrer"
                className="p-1.5 rounded bg-black border border-[#333] hover:border-[#25D366]/50 hover:bg-[#25D366]/10 text-gray-400 hover:text-[#25D366] transition-colors"
                title="Share on WhatsApp"
              >
                <Send className="w-4 h-4 rotate-45" />
              </a>
              <a 
                href={getSocialShareUrl('telegram', viewUrl, isFavoritesSelected ? 'My Liked Songs List' : selectedPlaylist ? `Playlist: "${selectedPlaylist.name}"` : 'Symphony Music Catalog')}
                target="_blank" 
                rel="noopener noreferrer"
                className="p-1.5 rounded bg-black border border-[#333] hover:border-[#0088cc]/50 hover:bg-[#0088cc]/10 text-gray-400 hover:text-[#0088cc] transition-colors"
                title="Share on Telegram"
              >
                <Send className="w-4 h-4" />
              </a>
              <a 
                href={getSocialShareUrl('email', viewUrl, isFavoritesSelected ? 'My Liked Songs List' : selectedPlaylist ? `Playlist: "${selectedPlaylist.name}"` : 'Symphony Music Catalog')}
                className="p-1.5 rounded bg-black border border-[#333] hover:border-white/50 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                title="Share via Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Option B: Share Current Playing Song */}
          {currentSong ? (
            <div className="bg-[#181818] p-4 rounded-xl border border-[#242424]" id="share-song-section">
              <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider mb-2">
                Share Playing Song
              </h4>
              <p className="text-xs text-white font-medium mb-3 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#E8B54D] animate-ping" />
                <span>{currentSong.songName} — {currentSong.songDes}</span>
              </p>
              
              {/* Copy Row */}
              <div className="flex gap-2 mb-3">
                <input 
                  type="text" 
                  readOnly 
                  value={songUrl}
                  className="flex-1 bg-black border border-[#333] px-3 py-2 rounded-lg text-xs text-gray-300 font-mono outline-none"
                />
                <button
                  onClick={() => handleCopy(songUrl, 'song')}
                  className="px-4 py-2 bg-[#E8B54D] hover:bg-[#f0c568] text-black font-extrabold text-xs rounded-lg flex items-center gap-1.5 transition-all shrink-0 active:scale-95"
                >
                  {copiedType === 'song' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Social Sharing Icons */}
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-gray-500 mr-2 uppercase font-bold">Quick Share:</span>
                <a 
                  href={getSocialShareUrl('twitter', songUrl, `Listening to "${currentSong.songName}"`)}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-1.5 rounded bg-black border border-[#333] hover:border-[#1DA1F2]/50 hover:bg-[#1DA1F2]/10 text-gray-400 hover:text-[#1DA1F2] transition-colors"
                  title="Share on X / Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a 
                  href={getSocialShareUrl('whatsapp', songUrl, `Listening to "${currentSong.songName}"`)}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-1.5 rounded bg-black border border-[#333] hover:border-[#25D366]/50 hover:bg-[#25D366]/10 text-gray-400 hover:text-[#25D366] transition-colors"
                  title="Share on WhatsApp"
                >
                  <Send className="w-4 h-4 rotate-45" />
                </a>
                <a 
                  href={getSocialShareUrl('telegram', songUrl, `Listening to "${currentSong.songName}"`)}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-1.5 rounded bg-black border border-[#333] hover:border-[#0088cc]/50 hover:bg-[#0088cc]/10 text-gray-400 hover:text-[#0088cc] transition-colors"
                  title="Share on Telegram"
                >
                  <Send className="w-4 h-4" />
                </a>
                <a 
                  href={getSocialShareUrl('email', songUrl, `Listening to "${currentSong.songName}"`)}
                  className="p-1.5 rounded bg-black border border-[#333] hover:border-white/50 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                  title="Share via Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-black/50 rounded-xl border border-[#222] text-center text-xs text-gray-500 italic">
              Play a track to unlock quick song-sharing links.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
