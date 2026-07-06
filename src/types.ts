export interface Song {
  id: number;
  songName: string;
  songDes: string;
  songImage: string;
  songPath: string;
  genre: string;
  tempo?: number;
  synthType?: string;
}

export interface Artist {
  id: number;
  artistName: string;
  description: string;
  image: string;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  songs: Song[];
  isCustom?: boolean;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  isAnonymous?: boolean;
}

export type ActiveTab = 'home' | 'premium' | 'support' | 'download' | 'install';
