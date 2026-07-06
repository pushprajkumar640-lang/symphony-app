import React, { useEffect, useRef } from 'react';
import { audioEngine } from '../utils/audioEngine';

interface VisualizerProps {
  isPlaying: boolean;
  synthType: string;
}

export default function Visualizer({ isPlaying, synthType }: VisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const parent = canvas.parentElement;
    const rect = parent ? parent.getBoundingClientRect() : canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    let width = rect.width;
    let height = rect.height;

    // Retrieve analyzer from our audio engine
    const analyser = audioEngine.getAnalyser();
    const bufferLength = analyser ? analyser.frequencyBinCount : 128;
    const dataArray = new Uint8Array(bufferLength);

    // Warm, ambient animation parameters
    let phase = 0;

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);

      // Clear with dark subtle fade
      ctx.fillStyle = 'rgba(18, 18, 18, 0.15)';
      ctx.fillRect(0, 0, width, height);

      if (analyser && isPlaying) {
        analyser.getByteFrequencyData(dataArray);

        // Circular or linear bars representation
        ctx.beginPath();
        ctx.lineWidth = 2.5;

        // Draw multiple beautiful glowing waveforms or lines
        const barWidth = width / (bufferLength * 0.6);
        let x = 0;

        for (let i = 0; i < bufferLength * 0.6; i++) {
          const value = dataArray[i];
          const percent = value / 255;
          const barHeight = percent * (height * 0.7);

          // Custom visual profiles depending on synthType
          let hue = 41; // Symphony Gold (#E8B54D) is roughly hue 41
          let saturation = 75;
          let lightness = 61;

          if (synthType === 'techno') {
            hue = 15; // Orange
          } else if (synthType === 'devotional' || synthType === 'bell' || synthType === 'chime') {
            hue = 210; // Ethereal Blue
            lightness = 70;
          } else if (synthType === 'piano') {
            hue = 45; // Golden Amber
          }

          // Dynamic radial gradients or bars
          const alpha = 0.2 + percent * 0.8;
          ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
          ctx.strokeStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;

          // Rounded bars with neon glow
          ctx.shadowBlur = percent * 15;
          ctx.shadowColor = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.5)`;

          ctx.fillRect(x, height - barHeight - 10, barWidth - 2, barHeight);
          x += barWidth;
        }

        // Draw an elegant center overlay wave
        ctx.shadowBlur = 0; // reset
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(232, 181, 77, 0.4)';
        for (let i = 0; i < width; i++) {
          const y = height / 2 + Math.sin(i * 0.02 + phase) * 10 * (dataArray[Math.floor((i / width) * bufferLength)] / 255 + 0.1);
          if (i === 0) ctx.moveTo(i, y);
          else ctx.lineTo(i, y);
        }
        ctx.stroke();

      } else {
        // Draw a gentle, slow sinusoidal wave when idle
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = 'rgba(232, 181, 77, 0.15)'; // Muted gold

        for (let i = 0; i < width; i++) {
          const y = height / 2 + Math.sin(i * 0.015 + phase) * 8;
          if (i === 0) {
            ctx.moveTo(i, y);
          } else {
            ctx.lineTo(i, y);
          }
        }
        ctx.stroke();
      }

      phase += 0.04;
    };

    draw();

    // Handle Resize
    const handleResize = () => {
      if (!canvas) return;
      const currentParent = canvas.parentElement;
      const r = currentParent ? currentParent.getBoundingClientRect() : canvas.getBoundingClientRect();
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
      width = r.width;
      height = r.height;
      const context = canvas.getContext('2d');
      if (context) {
        context.scale(dpr, dpr);
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(() => {
        handleResize();
      });
    });

    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    } else {
      resizeObserver.observe(canvas);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      resizeObserver.disconnect();
    };
  }, [isPlaying, synthType]);

  return (
    <div className="relative w-full h-full bg-[#121212]/30 rounded-lg overflow-hidden border border-[#282828]/50 min-h-[180px]" id="visualizer-container">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" id="visualizer-canvas" />
      <div className="absolute top-3 left-4 flex items-center gap-2 pointer-events-none" id="visualizer-label">
        <span className="w-2 h-2 rounded-full bg-[#E8B54D] animate-ping" />
        <span className="text-[10px] font-mono tracking-wider uppercase text-[#E8B54D]/80">
          {isPlaying ? `Symphony Engine - ${synthType} ACTIVE` : 'Symphony Engine - IDLE'}
        </span>
      </div>
    </div>
  );
}
