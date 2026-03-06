import React from 'react';
import { ChevronLeft, ChevronRight, Play, Trash2 } from 'lucide-react';
import { Playlist, Track } from '../data/mockData';
import { useLibrary } from '../LibraryContext';

interface PlaylistViewProps {
  playlist: Playlist;
  onPlayTrack: (track: Track, queue?: Track[]) => void;
  onBack: () => void;
}

export function PlaylistView({ playlist, onPlayTrack, onBack }: PlaylistViewProps) {
  const { removeTrackFromPlaylist } = useLibrary();

  return (
    <div className="flex-1 bg-bg-elevated overflow-y-auto relative rounded-lg m-2 ml-0 transition-colors duration-200">
      {/* Top Bar */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-bg-elevated/90 backdrop-blur-md transition-colors duration-200">
        <div className="flex items-center gap-2">
          <button 
            onClick={onBack}
            className="w-8 h-8 rounded-full bg-nav-btn-bg flex items-center justify-center text-nav-btn-text hover:text-nav-btn-hover transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="w-8 h-8 rounded-full bg-nav-btn-bg flex items-center justify-center text-nav-btn-text hover:text-nav-btn-hover transition-colors opacity-50 cursor-not-allowed">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="px-6 pb-6 pt-4 flex items-end gap-6">
        <img 
          src={playlist.coverUrl} 
          alt={playlist.title} 
          className="w-48 h-48 object-cover shadow-2xl rounded-md"
          referrerPolicy="no-referrer"
        />
        <div className="flex flex-col gap-2">
          <span className="text-sm font-bold text-text-base uppercase">Плейлист</span>
          <h1 className="text-5xl font-black text-text-base tracking-tighter">{playlist.title}</h1>
          <p className="text-sm text-text-subdued mt-2">{playlist.description}</p>
          <div className="text-sm text-text-base font-medium mt-1">
            {playlist.tracks.length} {playlist.tracks.length === 1 ? 'трек' : 'треков'}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="px-6 py-4 flex items-center gap-6">
        <button 
          onClick={() => playlist.tracks.length > 0 && onPlayTrack(playlist.tracks[0], playlist.tracks)}
          className="w-14 h-14 rounded-full bg-accent flex items-center justify-center text-black shadow-lg hover:scale-105 transition-transform"
          disabled={playlist.tracks.length === 0}
        >
          <Play className="w-6 h-6 fill-current ml-1" />
        </button>
      </div>

      {/* Track List */}
      <div className="px-6 pb-8">
        <div className="flex items-center justify-between p-2 border-b border-border-subdued mb-4 text-text-subdued text-sm font-medium">
          <div className="flex items-center gap-4 flex-1">
            <span className="w-4 text-right">#</span>
            <span>Название</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Длительность</span>
            <div className="w-8"></div> {/* Spacer for delete button */}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          {playlist.tracks.length === 0 ? (
            <div className="text-center py-12 text-text-subdued">
              В этом плейлисте пока нет треков.
            </div>
          ) : (
            playlist.tracks.map((track, index) => (
              <div 
                key={track.id} 
                className="flex items-center justify-between p-2 hover:bg-bg-highlight rounded-md group cursor-pointer transition-colors"
                onClick={() => onPlayTrack(track, playlist.tracks)}
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
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTrackFromPlaylist(playlist.id, track.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-text-subdued hover:text-red-500 transition-opacity p-2"
                    title="Remove from Playlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
