import React, { createContext, useContext, useState, useEffect } from 'react';
import { Track, Playlist } from './data/mockData';

interface LibraryContextType {
  likedTracks: Track[];
  toggleLike: (track: Track) => void;
  isLiked: (trackId: string) => boolean;
  
  userPlaylists: Playlist[];
  createPlaylist: (name: string) => void;
  deletePlaylist: (playlistId: string) => void;
  addTrackToPlaylist: (playlistId: string, track: Track) => void;
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => void;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const [likedTracks, setLikedTracks] = useState<Track[]>([]);
  const [userPlaylists, setUserPlaylists] = useState<Playlist[]>([]);

  // Load from local storage on mount
  useEffect(() => {
    const savedLiked = localStorage.getItem('aura_liked_tracks');
    const savedPlaylists = localStorage.getItem('aura_user_playlists');
    
    if (savedLiked) {
      try { setLikedTracks(JSON.parse(savedLiked)); } catch (e) {}
    }
    if (savedPlaylists) {
      try { setUserPlaylists(JSON.parse(savedPlaylists)); } catch (e) {}
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('aura_liked_tracks', JSON.stringify(likedTracks));
  }, [likedTracks]);

  useEffect(() => {
    localStorage.setItem('aura_user_playlists', JSON.stringify(userPlaylists));
  }, [userPlaylists]);

  const toggleLike = (track: Track) => {
    setLikedTracks(prev => {
      if (prev.find(t => t.id === track.id)) {
        return prev.filter(t => t.id !== track.id);
      }
      return [...prev, track];
    });
  };

  const isLiked = (trackId: string) => {
    return likedTracks.some(t => t.id === trackId);
  };

  const createPlaylist = (name: string) => {
    const newPlaylist: Playlist = {
      id: `up_${Date.now()}`,
      title: name,
      description: 'My custom playlist',
      coverUrl: `https://picsum.photos/seed/${Date.now()}/400/400`,
      tracks: []
    };
    setUserPlaylists(prev => [...prev, newPlaylist]);
  };

  const deletePlaylist = (playlistId: string) => {
    setUserPlaylists(prev => prev.filter(p => p.id !== playlistId));
  };

  const addTrackToPlaylist = (playlistId: string, track: Track) => {
    setUserPlaylists(prev => prev.map(p => {
      if (p.id === playlistId) {
        // Prevent duplicates
        if (p.tracks.find(t => t.id === track.id)) return p;
        return { ...p, tracks: [...p.tracks, track] };
      }
      return p;
    }));
  };

  const removeTrackFromPlaylist = (playlistId: string, trackId: string) => {
    setUserPlaylists(prev => prev.map(p => {
      if (p.id === playlistId) {
        return { ...p, tracks: p.tracks.filter(t => t.id !== trackId) };
      }
      return p;
    }));
  };

  return (
    <LibraryContext.Provider value={{
      likedTracks,
      toggleLike,
      isLiked,
      userPlaylists,
      createPlaylist,
      deletePlaylist,
      addTrackToPlaylist,
      removeTrackFromPlaylist
    }}>
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  const context = useContext(LibraryContext);
  if (context === undefined) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
}
