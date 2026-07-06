import { Song } from '../types';

/**
 * Symphony Procedural Audio Engine
 * Uses Web Audio API to play sound loops and route to an analyser
 */

class AudioEngine {
  private ctx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private mainGain: GainNode | null = null;
  private isPlaying = false;
  
  // Real File Playback properties
  private audioEl: HTMLAudioElement | null = null;
  private audioSource: MediaElementAudioSourceNode | null = null;
  private currentFileUrl = '';
  public onEnded: (() => void) | null = null;

  constructor() {
    // Lazy initialisation to comply with browser audio autostart policies
  }

  private init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    this.ctx = new AudioContextClass();
    
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 256;
    
    this.mainGain = this.ctx.createGain();
    this.mainGain.gain.value = 0.8; // Default volume

    this.analyser.connect(this.mainGain);
    this.mainGain.connect(this.ctx.destination);

    // Setup HTML5 audio element connected to Web Audio analyzer
    this.audioEl = new Audio();
    this.audioEl.crossOrigin = "anonymous";
    this.audioEl.addEventListener('ended', () => {
      if (this.onEnded) {
        this.onEnded();
      }
    });

    try {
      this.audioSource = this.ctx.createMediaElementSource(this.audioEl);
      this.audioSource.connect(this.analyser);
    } catch (e) {
      console.error("Failed to create MediaElementSource", e);
    }
  }

  public resumeContext() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(err => {
        console.error("Failed to resume AudioContext on interaction:", err);
      });
    }
  }

  public getAnalyser(): AnalyserNode | null {
    this.init();
    return this.analyser;
  }

  public setVolume(volume: number) {
    this.init();
    if (this.mainGain && this.ctx) {
      const targetVol = Math.max(0, Math.min(1, volume / 100));
      this.mainGain.gain.setValueAtTime(targetVol, this.ctx.currentTime);
    }
  }

  public getDuration(): number {
    if (this.audioEl) {
      return this.audioEl.duration || 160;
    }
    return 160;
  }

  public getCurrentTime(): number {
    if (this.audioEl) {
      return this.audioEl.currentTime || 0;
    }
    return 0;
  }

  public setCurrentTime(seconds: number) {
    if (this.audioEl) {
      this.audioEl.currentTime = seconds;
    }
  }

  public play(song: Song) {
    this.init();
    if (!this.ctx) return;

    if (this.isPlaying) {
      this.stop();
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(err => console.error("Failed to resume AudioContext:", err));
    }

    this.isPlaying = true;

    if (this.audioEl) {
      if (this.currentFileUrl !== song.songPath) {
        this.audioEl.src = song.songPath;
        this.currentFileUrl = song.songPath;
      }
      this.audioEl.play().catch(err => console.error("Audio playback error:", err));
    }
  }

  public stop() {
    this.isPlaying = false;
    if (this.audioEl) {
      this.audioEl.pause();
    }
  }
}

export const audioEngine = new AudioEngine();
