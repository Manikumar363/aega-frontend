import React, { useEffect, useRef, useState } from 'react';
import { RefreshCw } from 'lucide-react';

interface CaptchaProps {
  onChange: (code: string) => void;
  onUserInputChange: (input: string) => void;
  userInput: string;
}

export default function Captcha({ onChange, onUserInputChange, userInput }: CaptchaProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [code, setCode] = useState('');

  const generateCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Avoid ambiguous chars like O, 0, I, 1
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCode(result);
    onChange(result);
  };

  const drawCaptcha = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear and background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add noise lines
    for (let i = 0; i < 6; i++) {
      ctx.strokeStyle = `rgba(${Math.random() * 150}, ${Math.random() * 150}, ${Math.random() * 150}, 0.3)`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }

    // Add noise dots
    for (let i = 0; i < 40; i++) {
      ctx.fillStyle = `rgba(${Math.random() * 150}, ${Math.random() * 150}, ${Math.random() * 150}, 0.4)`;
      ctx.beginPath();
      ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw characters with distortion
    ctx.font = 'bold 24px monospace';
    ctx.textBaseline = 'middle';
    
    for (let i = 0; i < code.length; i++) {
      const char = code[i];
      const x = 20 + i * 22;
      const y = canvas.height / 2 + (Math.random() * 10 - 5);
      const angle = (Math.random() * 30 - 15) * Math.PI / 180;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillStyle = `rgba(${Math.random() * 100}, ${Math.random() * 100}, ${Math.random() * 100}, 0.9)`;
      ctx.fillText(char, 0, 0);
      ctx.restore();
    }
  };

  useEffect(() => {
    generateCode();
  }, []);

  useEffect(() => {
    if (code) {
      drawCaptcha();
    }
  }, [code]);

  return (
    <div className="flex flex-col gap-3 p-4 bg-white border border-white/20 rounded">
      <div className="flex items-center gap-3">
        <canvas
          ref={canvasRef}
          width={160}
          height={50}
          onClick={generateCode}
          className="border border-gray-300 rounded cursor-pointer hover:opacity-90 active:scale-95 transition-all shadow-inner"
          title="Click to generate new Captcha"
        />
        <button
          type="button"
          onClick={generateCode}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
          title="Refresh Captcha"
        >
          <RefreshCw size={18} />
        </button>
        <span className="text-xs text-gray-400 font-semibold tracking-wider uppercase ml-auto">Captcha</span>
      </div>
      
      <div className="flex flex-col gap-1">
        <input
          type="text"
          value={userInput}
          onChange={(e) => onUserInputChange(e.target.value)}
          placeholder="Enter Captcha Code"
          required
          maxLength={6}
          className="w-full border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 rounded focus:ring-2 focus:ring-[#F58A07]/50 focus:border-[#F58A07] outline-none"
        />
        <p className="text-[10px] text-gray-400 text-left">Characters are case-insensitive. Click image to reload.</p>
      </div>
    </div>
  );
}
