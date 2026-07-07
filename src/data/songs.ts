import { Song, Artist } from '../types';

export const SONGS: Song[] = [
  // Trending Songs
  {
    id: 1,
    songName: 'Gehra Hua',
    songDes: 'From Dhurandhar Movie',
    songImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&auto=format&fit=crop&q=60',
    songPath: "/symphony-app/songs/song1.mp3",
    genre: 'trending',
    tempo: 60,
    synthType: 'file'
  },
  {
    id: 2,
    songName: 'Shararat',
    songDes: 'From Dhurandhar Movie',
    songImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=60',
    songPath: "/symphony-app/songs/song2.mp3",
    genre: 'trending',
    tempo: 120,
    synthType: 'file'
  },
  {
    id: 3,
    songName: 'Tum Ho To',
    songDes: 'From "Saiyaara"',
    songImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=60',
    songPath: "/symphony-app/songs/song3.mp3",
    genre: 'trending',
    tempo: 72,
    synthType: 'file'
  },
  {
    id: 4,
    songName: 'Saiyaara',
    songDes: 'Tanishk Bagchi, Faheem Abdullah',
    songImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&auto=format&fit=crop&q=60',
    songPath: "/symphony-app/songs/song4.mp3",
    genre: 'trending',
    tempo: 80,
    synthType: 'file'
  },
  {
    id: 5,
    songName: 'Dopamine',
    songDes: 'Punjabi song by Guru Randhawa',
    songImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&auto=format&fit=crop&q=60',
    songPath: "/symphony-app/songs/song5.mp3",
    genre: 'trending',
    tempo: 128,
    synthType: 'file'
  },
  {
    id: 6,
    songName: 'Surmedani',
    songDes: 'Bajre Da Sitta',
    songImage: '/symphony-app/images/surmedani.jpeg',
    songPath: "/symphony-app/songs/song6.mp3",
    genre: 'trending',
    tempo: 90,
    synthType: 'file'
  },
  {
    id: 7,
    songName: 'Tere Liye',
    songDes: 'Atif Aslam, Shreya Ghoshal',
    songImage: '/symphony-app/images/tere-liye.jpeg',
    songPath: "/symphony-app/songs/song7.mp3",
    genre: 'trending',
    tempo: 85,
    synthType: 'file'
  },
  {
    id: 8,
    songName: 'Mere Baba',
    songDes: 'Jubin Nautiyal, Payal Dev',
    songImage: '/symphony-app/images/mere-baba.jpeg',
    songPath: "/symphony-app/songs/song8.mp3",
    genre: 'trending',
    tempo: 65,
    synthType: 'file'
  },
  {
    id: 9,
    songName: 'Lo Safar',
    songDes: 'Hit Song by Jubin Nautiyal',
    songImage: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&auto=format&fit=crop&q=60',
    songPath: "/symphony-app/songs/song9.mp3",
    genre: 'trending',
    tempo: 76,
    synthType: 'file'
  },
  {
    id: 10,
    songName: 'Raataan Lambiyan',
    songDes: 'Romantic Song from Shershaah',
    songImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&auto=format&fit=crop&q=60',
    songPath: "/symphony-app/songs/song10.mp3",
    genre: 'trending',
    tempo: 95,
    synthType: 'file'
  },
  // Devotional Hits
  {
    id: 11,
    songName: 'Namo Namo',
    songDes: 'Kedarnath - Amit Trivedi',
    songImage: '/symphony-app/images/namo-namo.jpeg',
    songPath: "/symphony-app/songs/song11.mp3",
    genre: 'devotional',
    tempo: 105,
    synthType: 'file'
  },
  {
    id: 12,
    songName: 'Narayan Mil Jayega',
    songDes: 'Jubin Nautiyal, Manoj Muntashir',
    songImage: '/symphony-app/images/narayan-mil-jayega.jpeg',
    songPath: "/symphony-app/songs/song12.mp3",
    genre: 'devotional',
    tempo: 70,
    synthType: 'file'
  },
  {
    id: 13,
    songName: 'Ram Siya Ram',
    songDes: 'Peaceful Devotional Ambient',
    songImage: '/symphony-app/images/ram-siya-ram.jpeg',
    songPath: "/symphony-app/songs/song13.mp3",
    genre: 'devotional',
    tempo: 60,
    synthType: 'file'
  },
  // Popular Songs
  {
    id: 14,
    songName: 'Sorry Sorry',
    songDes: 'Bhojpuri Hits - Pawan Singh',
    songImage: '/symphony-app/images/sorry-sorry.jpeg',
    songPath: "/symphony-app/songs/song14.mp3",
    genre: 'popular',
    tempo: 135,
    synthType: 'file'
  }
];

export const ARTISTS: Artist[] = [
  {
    id: 1,
    artistName: 'Arijit Singh',
    description: 'Sensational playback singer and heart of modern melodies.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=60'
  },
  {
    id: 2,
    artistName: 'Parampara Tandon',
    description: 'Stunning vocals delivering blockbuster romantic hits.',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=60'
  },
  {
    id: 3,
    artistName: 'Mohit Chauhan',
    description: 'The rustic, soulful voice of Indian rock and indie-pop.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=60'
  },
  {
    id: 4,
    artistName: 'Sachin-Jigar',
    description: 'Dynamic composition duo pushing urban soundtracks.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=60'
  },
  {
    id: 5,
    artistName: 'Sonu Nigam',
    description: 'Legendary versatile playback singer with timeless tracks.',
    image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=60'
  },
  {
    id: 6,
    artistName: 'Shreya Ghoshal',
    description: 'Melodious queen with unparalleled classical range.',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=60'
  },
  {
    id: 7,
    artistName: 'Atif Aslam',
    description: 'Iconic star known for heartfelt energetic ballads.',
    image: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=400&auto=format&fit=crop&q=60'
  }
];
