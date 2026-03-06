import React from 'react';
import { Track } from '../data/mockData';
import { X, Play } from 'lucide-react';

interface QueueViewProps {
  queue: Track[];
  currentTrack: Track | null;
  onPlayTrack: (track: Track) => void;
  onClose: () => void;
}

export function QueueView({ queue, currentTrack, onPlayTrack, onClose }: QueueViewProps) {
  return (
    <div className="flex flex-col h-full w-80 bg-bg-elevated border-l border-border-subdued transition-colors duration-200">
      <div className="p-4 flex items-center justify-between border-b border-border-subdued">
        <h2 className="font-bold text-text-base">Очередь</h2>
        <button onClick={onClose} className="text-text-subdued hover:text-text-base transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
        <h3 className="px-2 py-3 text-sm font-bold text-text-base">Далее</h3>
        <div className="flex flex-col gap-1">
          {queue.map((track, index) => {
            const isPlaying = currentTrack?.id === track.id;
            return (
              <div 
                key={`${track.id}-${index}`} 
                className={`flex items-center gap-3 p-2 rounded-md cursor-pointer group transition-colors ${isPlaying ? 'bg-bg-press' : 'hover:bg-bg-highlight'}`}
                onClick={() => onPlayTrack(track)}
              >
                <div className="relative w-10 h-10 flex-shrink-0">
                  <img src={track.coverUrl} alt={track.title} className={`w-full h-full object-cover rounded ${isPlaying ? 'opacity-50' : ''}`} referrerPolicy="no-referrer" />
                  {isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Play className="w-4 h-4 text-white fill-current" />
                    </div>
                  )}
                  {!isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 rounded">
                      <Play className="w-4 h-4 text-white fill-current ml-0.5" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className={`text-sm font-medium text-truncate-1 ${isPlaying ? 'text-accent' : 'text-text-base'}`}>
                    {track.title}
                  </span>
                  <span className="text-xs text-text-subdued text-truncate-1">
                    {track.artist}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
