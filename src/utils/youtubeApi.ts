import { toast } from "sonner";

// Interface for a single video
export interface Video {
  id: string;
  title: string;
  duration: number; // in seconds
  thumbnail: string;
  publishedAt: string;
  views?: number;
}

// Interface for playlist data
export interface PlaylistData {
  id: string;
  title: string;
  description: string;
  channelId: string;
  channelTitle: string;
  videos: Video[];
  thumbnail: string;
  totalDuration: number;
  videoCount: number;
  averageDuration: number;
  totalViews?: number;
  createdAt: number; // timestamp
}

// YouTube API Key - in a real app, this would be stored securely on the server
const API_KEY =import.meta.env.VITE_API_KEY;
// const API_KEY ="AIzaSyBv04nEakXvDp7YbJL7YHR4R4lf1mXqVPY";

/**
 * Extract the playlist ID from a YouTube URL
 */
export const extractPlaylistId = (url: string): string | null => {
  // Match playlist ID in various YouTube URL formats
  const regExp = /^.*(youtu.be\/|list=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  
  if (match && match[2]) {
    return match[2];
  }
  
  return null;
};

/**
 * Convert ISO 8601 duration format to seconds
 */
export const parseDuration = (duration: string): number => {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  
  const hours = (match && match[1]) ? parseInt(match[1], 10) : 0;
  const minutes = (match && match[2]) ? parseInt(match[2], 10) : 0;
  const seconds = (match && match[3]) ? parseInt(match[3], 10) : 0;
  
  return hours * 3600 + minutes * 60 + seconds;
};

/**
 * Format seconds to human-readable duration
 */
export const formatDuration = (seconds: number): string => {
  if (!seconds) return '0 seconds';
  
  const days = Math.floor(seconds / 86400);
  seconds %= 86400;
  
  const hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  
  const minutes = Math.floor(seconds / 60);
  seconds %= 60;
  
  const parts = [];
  
  if (days > 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`);
  if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
  if (minutes > 0) parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
  if (seconds > 0) parts.push(`${seconds} second${seconds !== 1 ? 's' : ''}`);
  
  return parts.join(', ');
};

/**
 * Format seconds to compact duration format (HH:MM:SS)
 */
export const formatCompactDuration = (seconds: number): string => {
  if (!seconds) return '00:00';
  
  const hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  const minutes = Math.floor(seconds / 60);
  seconds %= 60;
  
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Fetch a YouTube playlist's data
 */
export const fetchPlaylistData = async (playlistId: string): Promise<PlaylistData | null> => {
  try {
    // First, get the playlist info
    const playlistResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${playlistId}&key=${API_KEY}`
    );
    
    if (!playlistResponse.ok) {
      throw new Error('Failed to fetch playlist info');
    }
    
    const playlistData = await playlistResponse.json();
    
    if (!playlistData.items || playlistData.items.length === 0) {
      throw new Error('Playlist not found or is private');
    }
    
    const playlistInfo = playlistData.items[0];
    
    // Now get all playlist items (videos)
    const videos: Video[] = [];
    let nextPageToken: string | null = null;
    
    do {
      const playlistItemsUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${API_KEY}${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`;
      
      const playlistItemsResponse = await fetch(playlistItemsUrl);
      
      if (!playlistItemsResponse.ok) {
        throw new Error('Failed to fetch playlist items');
      }
      
      const playlistItemsData = await playlistItemsResponse.json();
      
      // Get the video IDs to fetch their details
      const videoIds = playlistItemsData.items
        .map((item: any) => item.snippet.resourceId.videoId)
        .join(',');
      
      // Get video details including duration
      const videoDetailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet,statistics&id=${videoIds}&key=${API_KEY}`;
      
      const videoDetailsResponse = await fetch(videoDetailsUrl);
      
      if (!videoDetailsResponse.ok) {
        throw new Error('Failed to fetch video details');
      }
      
      const videoDetailsData = await videoDetailsResponse.json();
      
      // Map the video details
      const newVideos = videoDetailsData.items.map((item: any) => ({
        id: item.id,
        title: item.snippet.title,
        duration: parseDuration(item.contentDetails.duration),
        thumbnail: item.snippet.thumbnails.medium.url,
        publishedAt: item.snippet.publishedAt,
        views: item.statistics?.viewCount ? parseInt(item.statistics.viewCount, 10) : undefined
      }));
      
      videos.push(...newVideos);
      
      nextPageToken = playlistItemsData.nextPageToken || null;
    } while (nextPageToken);
    
    // Calculate statistics
    const totalDuration = videos.reduce((acc, video) => acc + video.duration, 0);
    const totalViews = videos.reduce((acc, video) => acc + (video.views || 0), 0);
    
    return {
      id: playlistInfo.id,
      title: playlistInfo.snippet.title,
      description: playlistInfo.snippet.description,
      channelId: playlistInfo.snippet.channelId,
      channelTitle: playlistInfo.snippet.channelTitle,
      thumbnail: playlistInfo.snippet.thumbnails.high?.url || playlistInfo.snippet.thumbnails.default?.url,
      videos,
      totalDuration,
      videoCount: videos.length,
      averageDuration: videos.length > 0 ? totalDuration / videos.length : 0,
      totalViews: totalViews > 0 ? totalViews : undefined,
      createdAt: Date.now()
    };
  } catch (error) {
    console.error('Error fetching playlist data:', error);
    toast.error(`Failed to fetch playlist data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return null;
  }
};

/**
 * Save a playlist to local storage
 */
export const savePlaylistToHistory = (playlist: PlaylistData): void => {
  try {
    // Get existing history
    const historyString = localStorage.getItem('playlist-history');
    const history: PlaylistData[] = historyString ? JSON.parse(historyString) : [];
    
    // Check if playlist already exists
    const existingIndex = history.findIndex(p => p.id === playlist.id);
    
    if (existingIndex !== -1) {
      // Update existing entry
      history[existingIndex] = playlist;
    } else {
      // Add new entry (limit to last 10)
      history.unshift(playlist);
      if (history.length > 10) {
        history.pop();
      }
    }
    
    // Save back to storage
    localStorage.setItem('playlist-history', JSON.stringify(history));
  } catch (error) {
    console.error('Error saving playlist to history:', error);
  }
};

/**
 * Get playlist history from local storage
 */
export const getPlaylistHistory = (): PlaylistData[] => {
  try {
    const historyString = localStorage.getItem('playlist-history');
    return historyString ? JSON.parse(historyString) : [];
  } catch (error) {
    console.error('Error getting playlist history:', error);
    return [];
  }
};

/**
 * Get a specific playlist from local storage by ID
 */
export const getPlaylistById = (id: string): PlaylistData | null => {
  try {
    const history = getPlaylistHistory();
    return history.find(playlist => playlist.id === id) || null;
  } catch (error) {
    console.error('Error getting playlist by ID:', error);
    return null;
  }
};

/**
 * Clear playlist history
 */
export const clearPlaylistHistory = (): void => {
  try {
    localStorage.removeItem('playlist-history');
  } catch (error) {
    console.error('Error clearing playlist history:', error);
  }
};

/**
 * Group videos by duration categories
 */
export const groupVideosByDuration = (videos: Video[]): Record<string, number> => {
  const groups: Record<string, number> = {
    'Very Short (< 3 min)': 0,
    'Short (3-10 min)': 0,
    'Medium (10-20 min)': 0,
    'Long (20-60 min)': 0,
    'Very Long (> 60 min)': 0
  };
  
  videos.forEach(video => {
    const durationInMinutes = video.duration / 60;
    
    if (durationInMinutes < 3) {
      groups['Very Short (< 3 min)']++;
    } else if (durationInMinutes < 10) {
      groups['Short (3-10 min)']++;
    } else if (durationInMinutes < 20) {
      groups['Medium (10-20 min)']++;
    } else if (durationInMinutes < 60) {
      groups['Long (20-60 min)']++;
    } else {
      groups['Very Long (> 60 min)']++;
    }
  });
  
  return groups;
};