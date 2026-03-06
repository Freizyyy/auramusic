import React from 'react';
import { Track } from '../data/mockData';
import { X, Mic2 } from 'lucide-react';

interface LyricsViewProps {
  track: Track | null;
  onClose: () => void;
}

export function LyricsView({ track, onClose }: LyricsViewProps) {
  return (
    <div className="flex flex-col h-full w-80 bg-gradient-to-b from-accent/10 to-bg-elevated border-l border-border-subdued transition-colors duration-200">
      <div className="p-4 flex items-center justify-between">
        <h2 className="font-bold text-text-base flex items-center gap-2">
          <Mic2 className="w-5 h-5 text-accent" />
          Текст песни
        </h2>
        <button onClick={onClose} className="text-text-subdued hover:text-text-base transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-6 text-lg font-medium leading-relaxed custom-scrollbar">
        {track ? (
          <div className="flex flex-col gap-4 text-text-base">
            <p className="text-2xl font-black mb-4">{track.title}</p>
            {track.lyrics ? (
              <div className="whitespace-pre-wrap text-text-base">{track.lyrics}</div>
            ) : (
              <>
                <p className="opacity-80">Текст песни "{track.title}" от {track.artist} пока недоступен.</p>
                <p className="text-text-subdued mt-4 text-sm font-normal">
                  Здесь будет отображаться синхронизированный текст песни, когда он появится в нашей базе данных.
                </p>
              </>
            )}
          </div>
        ) : (
          <p className="text-text-subdued">Включите трек, чтобы увидеть текст.</p>
        )}
      </div>
    </div>
  );
}
