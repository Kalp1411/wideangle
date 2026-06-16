"use client";
import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaDownload, FaShareAlt, FaHome, FaTicketAlt } from 'react-icons/fa';
import confetti from 'canvas-confetti';

export default function TicketSuccessAnimation({ orderData, onHomeClick }) {
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    // 1. Fire Cinematic Confetti (Royal Gold and Cyan Palette)
    const end = Date.now() + 3000;
    const colors = ['#d4a017', '#31d7f9', '#ffffff'];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: colors
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());

    // 2. Trigger the "Rising Ticket" reveal
    const timer = setTimeout(() => setIsRevealed(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[200] bg-[#0a0b0d] flex flex-col items-center justify-center p-4 overflow-hidden pt-130">
      
      {/* Step 1: Success Acknowledgment */}
      <div className="text-center mb-10 animate-in fade-in slide-in-from-top-10 duration-1000">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <FaCheckCircle className="text-green-500 text-6xl shadow-lg" />
            <div className="absolute inset-0 bg-green-500 blur-3xl opacity-20 animate-pulse"></div>
          </div>
        </div>
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Booking Successful</h2>
        <p className="text-gray-500 text-[10px] uppercase tracking-[0.5em] mt-2">Your royal experience awaits</p>
      </div>

      {/* Step 2: The Rising Ticket (Creative Perforation Design) */}
      <div className={`relative transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] transform ${
        isRevealed ? 'translate-y-0 opacity-100' : 'translate-y-60 opacity-0'
      }`}>
        <div className="bg-[#1a1c20] rounded-[2.5rem] w-full max-w-sm overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/5 relative">
          
          {/* Top Gold Foil Accent */}
          <div className="h-1.5 bg-gradient-to-r from-[#b88a14] via-[#d4a017] to-[#b88a14]"></div>

          <div className="p-8 pb-4">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-[8px] text-gray-500 uppercase tracking-widest font-bold">Cinema Ticket</p>
                <h3 className="text-xl font-black text-white uppercase tracking-tighter">{orderData?.movieName || 'Aaryan'}</h3>
              </div>
              <div className="bg-white/5 px-3 py-1 rounded-lg border border-white/10">
                <p className="text-[10px] font-mono text-orange-500 font-bold">#RZ-99281</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-y-4 py-6 border-y border-white/5">
              <div className="space-y-1">
                <p className="text-[8px] text-gray-500 uppercase tracking-widest">Date</p>
                <p className="text-xs font-bold text-white uppercase">30 Jan, 2026</p>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-[8px] text-gray-500 uppercase tracking-widest">Time</p>
                <p className="text-xs font-bold text-white uppercase">09:00 PM</p>
              </div>
              <div className="space-y-1">
                <p className="text-[8px] text-gray-500 uppercase tracking-widest">Hall</p>
                <p className="text-xs font-bold text-white uppercase">Audi 04</p>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-[8px] text-gray-500 uppercase tracking-widest">Seats</p>
                <p className="text-sm font-black text-[#31d7f9] uppercase tracking-tighter">{orderData?.seats || 'D13, D14'}</p>
              </div>
            </div>

            {/* Dynamic QR Code */}
            <div className="flex flex-col items-center py-8">
              <div className="bg-white p-3 rounded-2xl mb-4 shadow-2xl scale-110">
                <img 
                  src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=RZ-2026-99281" 
                  alt="QR Code" 
                  className="w-24 h-24"
                />
              </div>
              <p className="text-[9px] text-gray-600 uppercase tracking-[0.4em] font-medium">Entry Pass</p>
            </div>
          </div>

          {/* Creative Perforation Effect (Negative Space Logic) */}
          <div className="relative flex items-center px-4 mb-2">
            <div className="w-10 h-10 bg-[#0a0b0d] rounded-full -ml-9 shadow-inner" />
            <div className="flex-grow border-t-2 border-dashed border-white/10 mx-2" />
            <div className="w-10 h-10 bg-[#0a0b0d] rounded-full -mr-9 shadow-inner" />
          </div>

          <div className="p-8 pt-4">
             <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
               <span className="text-[10px] text-gray-400 uppercase tracking-widest">Paid Amount</span>
               <span className="text-2xl font-black text-orange-500 leading-none">₹{orderData?.grandTotal}</span>
             </div>
          </div>
        </div>
      </div>

      {/* Step 3: Delayed Actions */}
      <div className={`mt-12 flex gap-4 transition-all duration-1000 delay-700 ${
        isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <button className="flex items-center gap-3 bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold px-8 py-4 rounded-xl border border-white/10 uppercase tracking-[0.2em] transition-all">
          <FaDownload size={14} /> Download
        </button>
        <button className="flex items-center gap-3 bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold px-8 py-4 rounded-xl border border-white/10 uppercase tracking-[0.2em] transition-all">
          <FaShareAlt size={14} /> Share
        </button>
        <button 
          onClick={onHomeClick}
          className="flex items-center gap-3 bg-orange-500 hover:bg-orange-600 text-black text-[10px] font-black px-10 py-4 rounded-xl uppercase tracking-[0.2em] transition-all shadow-lg shadow-orange-500/30 active:scale-95"
        >
          <FaHome size={14} /> Home
        </button>
      </div>
    </div>
  );
}