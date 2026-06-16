"use client";
import { useEffect, useState } from 'react';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaTicketAlt, FaShareAlt, FaEnvelope, FaPaperPlane, FaTimes } from 'react-icons/fa';

export default function SuccessPage() {
  const [order, setOrder] = useState(null);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem('lastOrder');
    if (data) setOrder(JSON.parse(data));
  }, []);

  if (!order) return <div className="min-h-screen bg-[#0a0b0d] flex items-center justify-center text-white">Loading Ticket...</div>;

  return (
    <div className="min-h-screen bg-[#0a0b0d] flex flex-col items-center justify-center p-6 font-sans">
      
      {/* Animated Ticket Container */}
      <div className="relative w-full max-w-md bg-[#1a1c20] rounded-[2rem] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.7)] border border-white/5 animate-in fade-in zoom-in duration-700">
        
        {/* Header/Poster Area */}
        <div className="relative h-44 bg-gray-800">
          <div className="absolute inset-0 bg-[url('/assets/img/bg/tv_series_bg02.jpg')] bg-cover bg-center opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1c20] to-transparent" />
          <div className="absolute bottom-4 left-6">
            <span className="bg-orange-500 text-[9px] font-bold px-2 py-0.5 rounded text-white tracking-widest uppercase">Confirmed</span>
            <h2 className="text-2xl font-black text-white mt-1 uppercase">{order.movieName}</h2>
          </div>
        </div>

        {/* Info Grid */}
        <div className="p-7 space-y-5">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest flex items-center gap-2"><FaCalendarAlt className="text-orange-500"/> Date</p>
              <p className="text-xs text-white font-medium">Jan 30, 2026</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest flex items-center gap-2"><FaClock className="text-orange-500"/> Time</p>
              <p className="text-xs text-white font-medium">09:00 PM</p>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest flex items-center gap-2"><FaMapMarkerAlt className="text-orange-500"/> Cinema</p>
            <p className="text-xs text-white font-medium">{order.theater}</p>
          </div>

          <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl">
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Seats</p>
              <p className="text-sm font-bold text-[#31d7f9]">{order.seats}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Grand Total</p>
              <p className="text-lg font-black text-orange-500">₹{order.grandTotal}</p>
            </div>
          </div>
        </div>

        {/* Perforation Effect */}
        <div className="relative flex items-center px-2">
          <div className="w-6 h-6 bg-[#0a0b0d] rounded-full -ml-5" />
          <div className="flex-grow border-t-2 border-dashed border-white/10 mx-2" />
          <div className="w-6 h-6 bg-[#0a0b0d] rounded-full -mr-5" />
        </div>

        {/* QR Section */}
        <div className="p-7 pt-2 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[9px] text-gray-500 uppercase font-bold tracking-[0.2em]">Booking ID</p>
            <p className="text-xs font-mono text-white/80">#RZ-2026-99281</p>
          </div>
          <div className="bg-white p-1.5 rounded-lg shadow-lg">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=RZ-2026-99281" alt="QR" className="w-16 h-16" />
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="p-7 pt-0 flex gap-3">
          <button className="flex-1 bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold py-3.5 rounded-xl border border-white/10 transition-all uppercase tracking-widest">Download</button>
          <button 
            onClick={() => setIsShareOpen(true)}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-[10px] font-bold py-3.5 rounded-xl transition-all uppercase tracking-widest shadow-lg shadow-orange-500/20"
          >
            Share Ticket
          </button>
        </div>
      </div>

      {/* --- Gmail Share Popup --- */}
      {isShareOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#1a1c20] w-full max-w-sm rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden">
            <button onClick={() => setIsShareOpen(false)} className="absolute top-5 right-5 text-gray-500 hover:text-white transition-colors"><FaTimes /></button>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-orange-500/20">
                <FaShareAlt className="text-orange-500 text-xl" />
              </div>
              <h3 className="text-xl font-bold text-white uppercase tracking-tight">Share Ticket</h3>
              <p className="text-gray-400 text-[10px] mt-2 uppercase tracking-widest">Enter Gmail ID</p>
            </div>

            {!isSent ? (
              <form onSubmit={(e) => { e.preventDefault(); setIsSent(true); setTimeout(() => setIsShareOpen(false), 2000); }} className="space-y-4">
                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
                  <input 
                    type="email" required placeholder="recipient@gmail.com" 
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white text-xs outline-none focus:border-orange-500 transition-all"
                    value={email} onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <button className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all uppercase tracking-widest shadow-lg shadow-orange-500/20">
                  <FaPaperPlane className="text-[10px]" /> Send via Gmail
                </button>
              </form>
            ) : (
              <div className="text-center py-6 animate-in zoom-in duration-500">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/20">
                  <span className="text-green-500 text-xl">✓</span>
                </div>
                <p className="text-white text-xs font-bold uppercase tracking-widest">Shared Successfully!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}