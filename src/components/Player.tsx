import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Repeat, Shuffle, Mic2, ListMusic, MonitorSpeaker, Maximize2 } from 'lucide-react';
import { Track } from '../data/mockData';
import { useLibrary } from '../LibraryContext';

interface PlayerProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  isShuffle: boolean;
  onToggleShuffle: () => void;
  repeatMode: 'OFF' | 'ALL' | 'ONE';
  onToggleRepeat: () => void;
  showLyrics: boolean;
  onToggleLyrics: () => void;
  showQueue: boolean;
  onToggleQueue: () => void;
  onToggleFullscreen: () => void;
}

export function Player({ 
  currentTrack, 
  isPlaying, 
  onPlayPause, 
  onNext, 
  onPrev,
  isShuffle,
  onToggleShuffle,
  repeatMode,
  onToggleRepeat,
  showLyrics,
  onToggleLyrics,
  showQueue,
  onToggleQueue,
  onToggleFullscreen
}: PlayerProps) {
  const { isLiked, toggleLike } = useLibrary();
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number>();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isDraggingProgress, setIsDraggingProgress] = useState(false);
  const [isDraggingVolume, setIsDraggingVolume] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (!(audio as any)._sourceNode) {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        const audioCtx = new AudioContext();
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 128;
        const source = audioCtx.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(audioCtx.destination);
        
        (audio as any)._sourceNode = source;
        (audio as any)._analyser = analyser;
        (audio as any)._audioCtx = audioCtx;
        
        analyserRef.current = analyser;
        audioCtxRef.current = audioCtx;
      } else {
        analyserRef.current = (audio as any)._analyser;
        audioCtxRef.current = (audio as any)._audioCtx;
      }
    } catch (e) {
      console.error("Audio context error:", e);
    }
  }, []);

  const drawVisualizer = () => {
    if (!analyserRef.current || !canvasRef.current || !isPlaying) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const barWidth = (canvas.width / bufferLength) * 2.5;
    let x = 0;

    let bassSum = 0;
    for (let i = 0; i < 5; i++) {
      bassSum += dataArray[i];
    }
    const bassAvg = bassSum / 5;
    
    const scale = 1 + (bassAvg / 255) * 0.15;
    const glow = (bassAvg / 255) * 20;
    const opacity = (bassAvg / 255) * 0.4;
    
    document.documentElement.style.setProperty('--beat-scale', scale.toString());
    document.documentElement.style.setProperty('--beat-glow', `${glow}px`);
    document.documentElement.style.setProperty('--beat-opacity', opacity.toString());

    for (let i = 0; i < bufferLength; i++) {
      const barHeight = (dataArray[i] / 255) * canvas.height;
      
      const gradient = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - barHeight);
      gradient.addColorStop(0, 'rgba(29, 185, 84, 0.05)');
      gradient.addColorStop(1, 'rgba(29, 185, 84, 0.4)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
      x += barWidth + 1;
    }

    animationRef.current = requestAnimationFrame(drawVisualizer);
  };

  useEffect(() => {
    if (isPlaying) {
      drawVisualizer();
    } else {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      document.documentElement.style.setProperty('--beat-scale', '1');
      document.documentElement.style.setProperty('--beat-glow', '0px');
      document.documentElement.style.setProperty('--beat-opacity', '0');
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Playback prevented:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleTimeUpdate = () => {
    if (audioRef.current && !isDraggingProgress) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    if (repeatMode === 'ONE') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else {
      onNext();
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement> | MouseEvent) => {
    if (!audioRef.current || duration === 0 || !progressRef.current) return;
    const bounds = progressRef.current.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - bounds.left) / bounds.width));
    setCurrentTime(percent * duration);
    if (e.type === 'click' || e.type === 'mouseup') {
      audioRef.current.currentTime = percent * duration;
    }
  };

  const handleVolume = (e: React.MouseEvent<HTMLDivElement> | MouseEvent) => {
    if (!audioRef.current || !volumeRef.current) return;
    const bounds = volumeRef.current.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - bounds.left) / bounds.width));
    setVolume(percent);
    setIsMuted(percent === 0);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingProgress) handleSeek(e);
      if (isDraggingVolume) handleVolume(e);
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (isDraggingProgress) {
        handleSeek(e);
        setIsDraggingProgress(false);
      }
      if (isDraggingVolume) {
        setIsDraggingVolume(false);
      }
    };

    if (isDraggingProgress || isDraggingVolume) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingProgress, isDraggingVolume, duration]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handlePlayPauseClick = () => {
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    onPlayPause();
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!currentTrack) return null;

  const liked = isLiked(currentTrack.id);

  return (
    <div className="h-[90px] bg-player-bg border-t border-border-subdued px-4 flex items-center justify-between z-50 relative transition-colors duration-200 overflow-hidden">
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
        width={1000}
        height={90}
      />
      <audio 
        ref={audioRef} 
        src={currentTrack.audioUrl} 
        crossOrigin="anonymous"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />
      
      {/* Track Info */}
      <div className="flex items-center gap-4 w-[30%] min-w-[180px]">
        <img 
          src={currentTrack.coverUrl} 
          alt={currentTrack.title} 
          className="w-14 h-14 rounded shadow-sm transition-transform duration-75"
          style={{ 
            transform: 'scale(var(--beat-scale, 1))',
            boxShadow: '0 0 var(--beat-glow, 0px) rgba(29, 185, 84, 0.8)'
          }}
          referrerPolicy="no-referrer"
        />
        <div className="flex flex-col justify-center max-w-[calc(100%-80px)]">
          <a href="#" className="text-sm text-text-base hover:underline text-truncate-1" title={currentTrack.title}>
            {currentTrack.title}
          </a>
          <div className="text-xs text-text-subdued text-truncate-1" title={`${currentTrack.artist} • ${currentTrack.album}`}>
            <a href="#" className="hover:underline hover:text-text-base">{currentTrack.artist}</a>
            <span className="mx-1">•</span>
            <a href="#" className="hover:underline hover:text-text-base">{currentTrack.album}</a>
          </div>
        </div>
        <button 
          onClick={() => toggleLike(currentTrack)}
          className={`ml-2 transition-colors ${liked ? 'text-accent hover:text-accent-hover' : 'text-icon-subdued hover:text-icon-hover'}`}
          title={liked ? "Remove from Favorites" : "Add to Favorites"}
        >
          <HeartIcon filled={liked} />
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center max-w-[40%] w-full">
        <div className="flex items-center gap-6 mb-2">
          <button 
            onClick={onToggleShuffle} 
            className={`transition-colors relative ${isShuffle ? 'text-accent hover:text-accent-hover' : 'text-icon-subdued hover:text-icon-hover'}`}
            title="Shuffle"
          >
            <Shuffle className="w-4 h-4" />
            {isShuffle && <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-accent rounded-full"></span>}
          </button>
          <button onClick={onPrev} className="text-icon-subdued hover:text-icon-hover transition-colors">
            <SkipBack className="w-5 h-5 fill-current" />
          </button>
          <button 
            onClick={handlePlayPauseClick}
            className="w-8 h-8 flex items-center justify-center bg-btn-primary-bg text-btn-primary-text rounded-full hover:scale-105 transition-transform"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-1" />
            )}
          </button>
          <button onClick={onNext} className="text-icon-subdued hover:text-icon-hover transition-colors">
            <SkipForward className="w-5 h-5 fill-current" />
          </button>
          <button 
            onClick={onToggleRepeat} 
            className={`transition-colors relative ${repeatMode !== 'OFF' ? 'text-accent hover:text-accent-hover' : 'text-icon-subdued hover:text-icon-hover'}`}
            title={`Repeat: ${repeatMode}`}
          >
            <Repeat className="w-4 h-4" />
            {repeatMode !== 'OFF' && <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-accent rounded-full"></span>}
            {repeatMode === 'ONE' && <span className="absolute -top-1.5 -right-1.5 text-[8px] font-bold bg-bg-base rounded-full w-3 h-3 flex items-center justify-center">1</span>}
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="flex items-center gap-2 w-full text-xs text-text-subdued">
          <span className="w-10 text-right">{formatTime(currentTime)}</span>
          <div 
            ref={progressRef}
            className="h-1 bg-progress-bg rounded-full flex-1 group cursor-pointer flex items-center py-2" 
            onMouseDown={(e) => {
              setIsDraggingProgress(true);
              handleSeek(e);
            }}
          >
            <div className="h-1 bg-progress-bg rounded-full w-full relative overflow-hidden group-hover:overflow-visible">
              <div 
                className="h-full bg-progress-fg group-hover:bg-accent rounded-full absolute left-0 top-0" 
                style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
              >
                <div className={`w-3 h-3 bg-progress-fg rounded-full absolute right-0 top-1/2 -translate-y-1/2 shadow translate-x-1/2 ${isDraggingProgress ? 'opacity-100 bg-accent' : 'opacity-0 group-hover:opacity-100'}`}></div>
              </div>
            </div>
          </div>
          <span className="w-10">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Extra Controls */}
      <div className="flex items-center justify-end gap-4 w-[30%] min-w-[180px] text-icon-subdued">
        <button 
          onClick={onToggleLyrics} 
          className={`hover:text-icon-hover transition-colors ${showLyrics ? 'text-accent' : ''}`}
          title="Lyrics"
        >
          <Mic2 className="w-4 h-4" />
        </button>
        <button 
          onClick={onToggleQueue} 
          className={`hover:text-icon-hover transition-colors ${showQueue ? 'text-accent' : ''}`}
          title="Queue"
        >
          <ListMusic className="w-4 h-4" />
        </button>
        <button className="hover:text-icon-hover transition-colors" title="Devices">
          <MonitorSpeaker className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2 w-24 group">
          <button onClick={toggleMute} className="hover:text-icon-hover transition-colors">
            {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <div 
            ref={volumeRef}
            className="h-1 bg-progress-bg rounded-full flex-1 cursor-pointer flex items-center py-2 group" 
            onMouseDown={(e) => {
              setIsDraggingVolume(true);
              handleVolume(e);
            }}
          >
            <div className="h-1 bg-progress-bg rounded-full w-full relative overflow-hidden group-hover:overflow-visible">
              <div 
                className="h-full bg-progress-fg group-hover:bg-accent rounded-full absolute left-0 top-0" 
                style={{ width: `${isMuted ? 0 : volume * 100}%` }}
              >
                 <div className={`w-3 h-3 bg-progress-fg rounded-full absolute right-0 top-1/2 -translate-y-1/2 shadow translate-x-1/2 ${isDraggingVolume ? 'opacity-100 bg-accent' : 'opacity-0 group-hover:opacity-100'}`}></div>
              </div>
            </div>
          </div>
        </div>
        <button onClick={onToggleFullscreen} className="hover:text-icon-hover transition-colors" title="Fullscreen">
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function HeartIcon({ filled }: { filled?: boolean }) {
  if (filled) {
    return (
      <svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16" fill="currentColor">
        <path d="M1.69 2A4.582 4.582 0 0 1 8 2.023 4.583 4.583 0 0 1 11.88.817h.002a4.618 4.618 0 0 1 3.782 3.65v.003a4.543 4.543 0 0 1-1.011 3.84L9.35 14.629a1.765 1.765 0 0 1-2.093.464 1.762 1.762 0 0 1-1.15-1.33L.81 8.315A4.544 4.544 0 0 1 1.69 2z"></path>
      </svg>
    );
  }
  return (
    <svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16" fill="currentColor">
      <path d="M1.69 2A4.582 4.582 0 0 1 8 2.023 4.583 4.583 0 0 1 11.88.817h.002a4.618 4.618 0 0 1 3.782 3.65v.003a4.543 4.543 0 0 1-1.011 3.84L9.35 14.629a1.765 1.765 0 0 1-2.093.464 1.762 1.762 0 0 1-1.15-1.33L.81 8.315A4.544 4.544 0 0 1 1.69 2zm1.441 1.25a3.082 3.082 0 0 0-1.2 4.223l5.26 6.188a.265.265 0 0 0 .314.07.262.262 0 0 0 .172-.199l5.258-6.186a3.043 3.043 0 0 0 .679-2.573 3.118 3.118 0 0 0-2.551-2.462 3.083 3.083 0 0 0-2.671 1.05l-.653.766a.75.75 0 0 1-1.14 0l-.653-.766a3.082 3.082 0 0 0-2.812-1.11z"></path>
    </svg>
  );
}

