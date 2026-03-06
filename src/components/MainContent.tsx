import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Play, User, Moon, Sun, Plus, Check, LogOut } from 'lucide-react';
import { Playlist, Track, mockTracks } from '../data/mockData';
import { useTheme } from '../ThemeContext';
import { useLibrary } from '../LibraryContext';
import { useAuth } from '../AuthContext';

interface MainContentProps {
  playlists: Playlist[];
  onPlayTrack: (track: Track, queue?: Track[]) => void;
}

export function MainContent({ playlists, onPlayTrack }: MainContentProps) {
  const { theme, toggleTheme } = useTheme();
  const { userPlaylists, addTrackToPlaylist } = useLibrary();
  const { profile, logout } = useAuth();
  const [showPlaylistMenu, setShowPlaylistMenu] = useState<string | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleAddToPlaylist = (e: React.MouseEvent, track: Track, playlistId: string) => {
    e.stopPropagation();
    addTrackToPlaylist(playlistId, track);
    setShowPlaylistMenu(null);
  };

  return (
    <div className="flex-1 bg-bg-elevated overflow-y-auto relative rounded-lg m-2 ml-0 transition-colors duration-200" onClick={() => { setShowPlaylistMenu(null); setShowProfileMenu(false); }}>
      {/* Top Bar */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-bg-elevated/90 backdrop-blur-md transition-colors duration-200">
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 rounded-full bg-nav-btn-bg flex items-center justify-center text-nav-btn-text hover:text-nav-btn-hover transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="w-8 h-8 rounded-full bg-nav-btn-bg flex items-center justify-center text-nav-btn-text hover:text-nav-btn-hover transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="w-8 h-8 rounded-full bg-nav-btn-bg flex items-center justify-center text-nav-btn-text hover:text-nav-btn-hover transition-colors"
            title="Toggle Dark Mode"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          {profile ? (
            <div className="relative">
              <button 
                onClick={(e) => { e.stopPropagation(); setShowProfileMenu(!showProfileMenu); }}
                className="flex items-center gap-2 bg-nav-btn-bg hover:bg-bg-press transition-colors rounded-full p-1 pr-3"
              >
                <div className="w-8 h-8 rounded-full bg-accent text-black flex items-center justify-center font-bold">
                  {profile.username.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-bold text-text-base max-w-[100px] truncate">
                  {profile.username}
                </span>
              </button>
              
              {showProfileMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-card-bg border border-border-subdued rounded-md shadow-xl z-50 py-1" onClick={e => e.stopPropagation()}>
                  <div className="px-4 py-3 border-b border-border-subdued mb-1">
                    <p className="text-sm font-bold text-text-base truncate">{profile.username}</p>
                    <p className="text-xs text-text-subdued truncate">{profile.email}</p>
                  </div>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-bg-highlight transition-colors text-text-base hover:text-red-500"
                  >
                    <LogOut className="w-4 h-4" />
                    Выйти
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button className="text-sm font-bold text-text-subdued hover:text-text-base hover:scale-105 transition-all">
                Зарегистрироваться
              </button>
              <button className="bg-btn-primary-bg text-btn-primary-text text-sm font-bold px-8 py-3 rounded-full hover:scale-105 transition-all">
                Войти
              </button>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-8">
        {/* Greeting */}
        <h2 className="text-2xl font-bold text-text-base mb-6 mt-2">Добрый вечер</h2>
        
        {/* Featured Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {playlists.slice(0, 6).map((playlist) => (
            <div 
              key={playlist.id}
              className="group flex items-center bg-bg-highlight hover:bg-bg-press transition-colors rounded overflow-hidden cursor-pointer"
              onClick={() => onPlayTrack(playlist.tracks[0], playlist.tracks)}
            >
              <img 
                src={playlist.coverUrl} 
                alt={playlist.title} 
                className="w-16 h-16 object-cover shadow-md"
                referrerPolicy="no-referrer"
              />
              <span className="font-bold text-text-base px-4 flex-1 text-truncate-2">{playlist.title}</span>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity pr-4">
                <button className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-black shadow-lg hover:scale-105 transition-transform">
                  <Play className="w-5 h-5 fill-current ml-1" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Section: Popular Tracks */}
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-2xl font-bold text-text-base hover:underline cursor-pointer">Популярные треки</h2>
        </div>
        
        <div className="flex flex-col gap-2 mb-8">
          {mockTracks.map((track, index) => (
            <div 
              key={track.id} 
              className="flex items-center justify-between p-2 hover:bg-bg-highlight rounded-md group cursor-pointer transition-colors relative"
              onClick={() => onPlayTrack(track, mockTracks)}
            >
              <div className="flex items-center gap-4 flex-1">
                <span className="text-text-subdued w-4 text-right">{index + 1}</span>
                <img src={track.coverUrl} alt={track.title} className="w-10 h-10 rounded shadow-sm" referrerPolicy="no-referrer" />
                <div className="flex flex-col">
                  <span className="text-text-base font-medium">{track.title}</span>
                  <span className="text-text-subdued text-sm">{track.artist}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-text-subdued text-sm">{track.duration}</span>
                <div className="relative">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowPlaylistMenu(showPlaylistMenu === track.id ? null : track.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-text-subdued hover:text-text-base transition-opacity p-2"
                    title="Add to Playlist"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                  
                  {/* Playlist Menu */}
                  {showPlaylistMenu === track.id && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-card-bg border border-border-subdued rounded-md shadow-lg z-50 py-1" onClick={e => e.stopPropagation()}>
                      <div className="px-3 py-2 text-xs font-bold text-text-subdued uppercase tracking-wider">
                        Add to Playlist
                      </div>
                      {userPlaylists.length === 0 ? (
                        <div className="px-3 py-2 text-sm text-text-subdued">No playlists created</div>
                      ) : (
                        userPlaylists.map(playlist => {
                          const hasTrack = playlist.tracks.some(t => t.id === track.id);
                          return (
                            <button
                              key={playlist.id}
                              onClick={(e) => handleAddToPlaylist(e, track, playlist.id)}
                              disabled={hasTrack}
                              className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between hover:bg-bg-highlight transition-colors ${hasTrack ? 'text-text-subdued cursor-not-allowed' : 'text-text-base'}`}
                            >
                              <span className="text-truncate-1">{playlist.title}</span>
                              {hasTrack && <Check className="w-4 h-4 text-accent" />}
                            </button>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Section: Made for you */}
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-2xl font-bold text-text-base hover:underline cursor-pointer">Специально для вас</h2>
          <span className="text-sm font-bold text-text-subdued hover:underline cursor-pointer">Показать все</span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
          {playlists.map((playlist) => (
            <div 
              key={playlist.id} 
              className="bg-card-bg hover:bg-card-hover p-4 rounded-md transition-colors cursor-pointer group"
              onClick={() => onPlayTrack(playlist.tracks[0], playlist.tracks)}
            >
              <div className="relative mb-4">
                <img 
                  src={playlist.coverUrl} 
                  alt={playlist.title} 
                  className="w-full aspect-square object-cover rounded shadow-md"
                  referrerPolicy="no-referrer"
                />
                <button className="absolute bottom-2 right-2 w-12 h-12 rounded-full bg-accent flex items-center justify-center text-black shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all hover:scale-105 hover:bg-accent-hover">
                  <Play className="w-6 h-6 fill-current ml-1" />
                </button>
              </div>
              <h3 className="font-bold text-text-base mb-1 text-truncate-1">{playlist.title}</h3>
              <p className="text-sm text-text-subdued text-truncate-2">{playlist.description}</p>
            </div>
          ))}
        </div>

        {/* Section: Popular Artists */}
        <div className="flex items-end justify-between mb-4 mt-8">
          <h2 className="text-2xl font-bold text-text-base hover:underline cursor-pointer">Популярные артисты</h2>
          <span className="text-sm font-bold text-text-subdued hover:underline cursor-pointer">Показать все</span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {[
            { name: 'Баста', type: 'Исполнитель', img: 'https://picsum.photos/seed/basta/400/400' },
            { name: 'Ноггано', type: 'Исполнитель', img: 'https://picsum.photos/seed/noggano/400/400' },
            { name: 'Каспийский Груз', type: 'Исполнитель', img: 'https://picsum.photos/seed/kaspiyskiy/400/400' },
            { name: 'N1NT3ND0', type: 'Исполнитель', img: 'https://picsum.photos/seed/nintendo/400/400' },
            { name: '5Плюх', type: 'Исполнитель', img: 'https://picsum.photos/seed/5plyuh/400/400' }
          ].map((artist, i) => (
            <div key={i} className="bg-card-bg hover:bg-card-hover p-4 rounded-md transition-colors cursor-pointer group">
              <div className="relative mb-4">
                <img 
                  src={artist.img} 
                  alt={artist.name} 
                  className="w-full aspect-square object-cover rounded-full shadow-md"
                  referrerPolicy="no-referrer"
                />
                <button className="absolute bottom-2 right-2 w-12 h-12 rounded-full bg-accent flex items-center justify-center text-black shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all hover:scale-105 hover:bg-accent-hover">
                  <Play className="w-6 h-6 fill-current ml-1" />
                </button>
              </div>
              <h3 className="font-bold text-text-base mb-1 text-truncate-1">{artist.name}</h3>
              <p className="text-sm text-text-subdued">{artist.type}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
