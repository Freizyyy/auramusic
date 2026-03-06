import React from 'react';
import { Home, Search, Library, PlusSquare, Heart, ListMusic, Trash2, LogOut } from 'lucide-react';
import { useLibrary } from '../LibraryContext';
import { useAuth } from '../AuthContext';

interface SidebarProps {
  onViewChange: (view: string) => void;
  currentView: string;
}

export function Sidebar({ onViewChange, currentView }: SidebarProps) {
  const { userPlaylists, createPlaylist, deletePlaylist } = useLibrary();
  const { profile, logout } = useAuth();

  const handleCreatePlaylist = (e: React.MouseEvent) => {
    e.preventDefault();
    const name = prompt("Enter playlist name:", `My Playlist #${userPlaylists.length + 1}`);
    if (name) {
      createPlaylist(name);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="w-64 bg-sidebar-bg h-full flex flex-col text-sm font-medium text-text-subdued transition-colors duration-200">
      {/* Logo Area */}
      <div className="p-6 flex items-center gap-2 text-text-base">
        <ListMusic className="w-8 h-8 text-text-base" />
        <span className="text-xl font-bold tracking-tight">Aura Music</span>
      </div>

      {/* Main Navigation */}
      <div className="px-3 space-y-1">
        <a 
          href="#" 
          onClick={(e) => { e.preventDefault(); onViewChange('home'); }}
          className={`flex items-center gap-4 px-3 py-2 rounded-md transition-colors ${currentView === 'home' ? 'text-text-base bg-bg-press' : 'hover:text-text-base'}`}
        >
          <Home className="w-6 h-6" />
          Главная
        </a>
        <a href="#" className="flex items-center gap-4 px-3 py-2 hover:text-text-base transition-colors">
          <Search className="w-6 h-6" />
          Поиск
        </a>
        <a href="#" className="flex items-center gap-4 px-3 py-2 hover:text-text-base transition-colors">
          <Library className="w-6 h-6" />
          Моя медиатека
        </a>
      </div>

      {/* Secondary Navigation */}
      <div className="mt-6 px-3 space-y-1">
        <a href="#" onClick={handleCreatePlaylist} className="flex items-center gap-4 px-3 py-2 hover:text-text-base transition-colors">
          <div className="w-6 h-6 bg-icon-subdued text-bg-base flex items-center justify-center rounded-sm">
            <PlusSquare className="w-4 h-4" />
          </div>
          Создать плейлист
        </a>
        <a href="#" className="flex items-center gap-4 px-3 py-2 hover:text-text-base transition-colors">
          <div className="w-6 h-6 bg-gradient-to-br from-indigo-600 to-blue-300 text-white flex items-center justify-center rounded-sm">
            <Heart className="w-4 h-4 fill-current" />
          </div>
          Любимые треки
        </a>
      </div>

      <div className="px-6 py-2">
        <hr className="border-border-subdued" />
      </div>

      {/* Playlists */}
      <div className="flex-1 overflow-y-auto px-6 py-2 space-y-3 custom-scrollbar">
        {userPlaylists.map(playlist => (
          <div key={playlist.id} className="flex items-center justify-between group">
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); onViewChange(playlist.id); }}
              className={`block transition-colors text-truncate-1 flex-1 ${currentView === playlist.id ? 'text-text-base font-bold' : 'hover:text-text-base'}`}
            >
              {playlist.title}
            </a>
            <button 
              onClick={(e) => { 
                e.preventDefault(); 
                deletePlaylist(playlist.id); 
                if (currentView === playlist.id) onViewChange('home');
              }}
              className="opacity-0 group-hover:opacity-100 text-text-subdued hover:text-red-500 transition-all"
              title="Delete Playlist"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        <a href="#" className="block hover:text-text-base transition-colors text-truncate-1">Газгольдер Классика</a>
        <a href="#" className="block hover:text-text-base transition-colors text-truncate-1">Пацанский цитатник</a>
        <a href="#" className="block hover:text-text-base transition-colors text-truncate-1">Русский Рэп 2010-х</a>
        <a href="#" className="block hover:text-text-base transition-colors text-truncate-1">На районе</a>
        <a href="#" className="block hover:text-text-base transition-colors text-truncate-1">Лирика</a>
        <a href="#" className="block hover:text-text-base transition-colors text-truncate-1">Новинки</a>
        <a href="#" className="block hover:text-text-base transition-colors text-truncate-1">Discover Weekly</a>
        <a href="#" className="block hover:text-text-base transition-colors text-truncate-1">Release Radar</a>
      </div>

      {/* User Profile & Logout */}
      <div className="mt-auto p-4 border-t border-border-subdued">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-accent text-black flex items-center justify-center font-bold shrink-0">
              {profile?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span className="text-sm font-medium text-text-base truncate">
              {profile?.username || 'User'}
            </span>
          </div>
          <button 
            onClick={handleLogout}
            className="text-text-subdued hover:text-red-500 transition-colors p-2"
            title="Выйти"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
