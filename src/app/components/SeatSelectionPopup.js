"use client";
import React, { useState } from 'react';

const SeatSelectionPopup = ({ isOpen, onClose, onConfirm }) => {
  const [seatCount, setSeatCount] = useState(2);

  if (!isOpen) return null;

  const priceCategories = [
    // { label: 'Club', price: 450, status: 'ALMOST FULL', color: '#ff4d61' },
    { label: 'Platinum', price: 220, status: 'AVAILABLE', color: '#4caf50' },
    { label: 'Gold', price: 150, status: 'AVAILABLE', color: '#4caf50' },
    { label: 'Silver', price: 150, status: 'AVAILABLE', color: '#4caf50' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
        <h2 className="text-center text-gray-800 font-semibold text-lg mb-4">How many seats?</h2>
        
        {/* Scooter Illustration Placeholder */}
        <div className="flex justify-center mb-6">
           <img src="/assets/img/images/scooter.gif" alt="Scooter" className="w-24 h-auto" />
        </div>

        {/* Seat Number Selection */}
        <div className="flex justify-between items-center mb-8 px-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
            <button
              key={num}
              onClick={() => setSeatCount(num)}
              className={`w-8 h-8 rounded-full text-sm font-medium transition-colors
                ${seatCount === num ? 'bg-[#f28c28] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              {num}
            </button>
          ))}
        </div>

        <hr className="border-gray-100 mb-6" />

        {/* Price Categories Grid */}
        <div className="grid grid-cols-4 gap-2 mb-8 text-center">
          {priceCategories.map((cat) => (
            <div key={cat.label} className="flex flex-col">
              <span className="text-[10px] text-gray-400 font-bold">{cat.label}</span>
              <span className="text-sm font-bold text-gray-800">₹{cat.price}</span>
              <span className="text-[9px] font-bold mt-1" style={{ color: cat.color }}>
                {cat.status}
              </span>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <button
          onClick={() => onConfirm(seatCount)}
          className="w-full bg-[#f28c28] text-white py-3 rounded-md font-bold text-sm tracking-wide hover:bg-[#f28c29] transition-colors"
        >
          Select Seats
        </button>
      </div>
    </div>
  );
};

export default SeatSelectionPopup;