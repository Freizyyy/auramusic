import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Player } from './components/Player';
import { MainContent } from './components/MainContent';
import { PlaylistView } from './components/PlaylistView';
import { QueueView } from './components/QueueView';
import { LyricsView } from './components/LyricsView';
import { AuthScreen } from './components/AuthScreen';
import { mockPlaylists, Track } from './data/mockData';
import { useLibrary } from './LibraryContext';
import { useAuth } from './AuthContext';

export default function App() {
  const { user, loading } = useAuth();
  const [currentTrack, setCurrentTrack] = useState<Track | null>(mockPlaylists[0].tracks[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | string>('home');
  const { userPlaylists } = useLibrary();
  
  const [queue, setQueue] = useState<Track[]>(mockPlaylists[0].tracks);
  const [queueIndex, setQueueIndex] = useState(0);
  const [originalQueue, setOriginalQueue] = useState<Track[]>([]);
  
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'OFF' | 'ALL' | 'ONE'>('ALL');
  
  const [showLyrics, setShowLyrics] = useState(false);
  const [showQueue, setShowQueue] = useState(false);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-bg-base">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  const handlePlayTrack = (track: Track, contextQueue?: Track[]) => {
    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
      if (contextQueue) {
        if (isShuffle) {
          setOriginalQueue(contextQueue);
          const shuffled = [...contextQueue].sort(() => Math.random() - 0.5);
          const currentIndex = shuffled.findIndex(t => t.id === track.id);
          if (currentIndex > 0) {
            const [curr] = shuffled.splice(currentIndex, 1);
            shuffled.unshift(curr);
          }
          setQueue(shuffled);
          setQueueIndex(0);
        } else {
          setQueue(contextQueue);
          setQueueIndex(contextQueue.findIndex(t => t.id === track.id));
        }
      } else {
        const idx = queue.findIndex(t => t.id === track.id);
        if (idx !== -1) setQueueIndex(idx);
      }
    }
  };

  const handleNext = () => {
    if (queue.length === 0) return;
    if (repeatMode === 'OFF' && queueIndex === queue.length - 1) {
      setIsPlaying(false);
      return;
    }
    const nextIndex = (queueIndex + 1) % queue.length;
    setCurrentTrack(queue[nextIndex]);
    setQueueIndex(nextIndex);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    if (queue.length === 0) return;
    const prevIndex = queueIndex === 0 ? queue.length - 1 : queueIndex - 1;
    setCurrentTrack(queue[prevIndex]);
    setQueueIndex(prevIndex);
    setIsPlaying(true);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleShuffle = () => {
    if (!isShuffle) {
      setOriginalQueue([...queue]);
      const shuffled = [...queue].sort(() => Math.random() - 0.5);
      const currentIndex = shuffled.findIndex(t => t.id === currentTrack?.id);
      if (currentIndex > 0) {
        const [curr] = shuffled.splice(currentIndex, 1);
        shuffled.unshift(curr);
      }
      setQueue(shuffled);
      setQueueIndex(0);
      setIsShuffle(true);
    } else {
      setQueue(originalQueue);
      setQueueIndex(originalQueue.findIndex(t => t.id === currentTrack?.id));
      setIsShuffle(false);
    }
  };

  const toggleRepeat = () => {
    const modes: ('OFF' | 'ALL' | 'ONE')[] = ['OFF', 'ALL', 'ONE'];
    setRepeatMode(modes[(modes.indexOf(repeatMode) + 1) % modes.length]);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const activePlaylist = userPlaylists.find(p => p.id === currentView);

  return (
    <div className="h-screen flex flex-col bg-bg-base text-text-base overflow-hidden transition-colors duration-200 relative">
      {/* Dynamic Background Glow */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-75"
        style={{ 
          background: 'radial-gradient(circle at 50% 100%, rgba(29, 185, 84, var(--beat-opacity, 0)) 0%, transparent 60%)'
        }}
      />
      <div className="flex-1 flex overflow-hidden z-10">
        <Sidebar onViewChange={setCurrentView} currentView={currentView} />
        {currentView === 'home' || !activePlaylist ? (
          <MainContent 
            playlists={mockPlaylists} 
            onPlayTrack={handlePlayTrack} 
          />
        ) : (
          <PlaylistView 
            playlist={activePlaylist} 
            onPlayTrack={handlePlayTrack} 
            onBack={() => setCurrentView('home')}
          />
        )}
        
        {/* Right Sidebar for Queue / Lyrics */}
        {(showQueue || showLyrics) && (
          <div className="flex flex-col transition-all">
            {showQueue && (
              <QueueView 
                queue={queue} 
                currentTrack={currentTrack} 
                onPlayTrack={handlePlayTrack} 
                onClose={() => setShowQueue(false)} 
              />
            )}
            {showLyrics && (
              <LyricsView 
                track={currentTrack} 
                onClose={() => setShowLyrics(false)} 
              />
            )}
          </div>
        )}
      </div>
      <Player 
        currentTrack={currentTrack} 
        isPlaying={isPlaying} 
        onPlayPause={handlePlayPause}
        onNext={handleNext}
        onPrev={handlePrev}
        isShuffle={isShuffle}
        onToggleShuffle={toggleShuffle}
        repeatMode={repeatMode}
        onToggleRepeat={toggleRepeat}
        showLyrics={showLyrics}
        onToggleLyrics={() => { setShowLyrics(!showLyrics); setShowQueue(false); }}
        showQueue={showQueue}
        onToggleQueue={() => { setShowQueue(!showQueue); setShowLyrics(false); }}
        onToggleFullscreen={toggleFullscreen}
      />
    </div>
  );
}
