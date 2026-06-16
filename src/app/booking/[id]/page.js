"use client";

import React, { useMemo, useEffect, useState } from 'react';
import { FaCalendarAlt, FaRegClock } from 'react-icons/fa';
import Link from 'next/link';
import { useParams } from "next/navigation";
import Script from 'next/script';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { streamingItems } from "@/data/streamingItems";
import SeatSelectionPopup from "@/app/components/SeatSelectionPopup";

// Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import NewsLatter from '@/app/components/newslatter';

export default function BookingPage() {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(true);

    const [rows, setRows] = useState([
        { label: 'A', price: 220, category: 'PLATINUM SECTION', seats: Array(15).fill('available') },
        { label: 'B', price: 220, category: 'PLATINUM SECTION', seats: Array(15).fill('available') },
        { label: '-', isAisle: true },
        { label: 'C', price: 150, category: 'GOLD SECTION', seats: Array(15).fill('available') },
        { label: 'D', price: 150, category: 'GOLD SECTION', seats: Array(15).fill('available') },
        { label: 'E', price: 150, category: 'GOLD SECTION', seats: Array(15).fill('available') },
        { label: 'F', price: 150, category: 'GOLD SECTION', seats: Array(15).fill('available') },
        { label: 'G', price: 150, category: 'GOLD SECTION', seats: Array(15).fill('available') },
    ]);

    useEffect(() => {
        const movieData = streamingItems.Items.find((item) => item.id === Number(id));
        if (movieData) setMovie(movieData);
    }, [id]);

    const daysToShow = useMemo(() => {
        const dates = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);
            dates.push({
                month: date.toLocaleString('en-US', { month: 'short' }),
                dayNum: date.getDate(),
                dayName: date.toLocaleString('en-US', { weekday: 'short' }),
                fullDate: date.toISOString().split('T')[0]
            });
        }
        return dates;
    }, []);

    useEffect(() => {
        if (daysToShow.length > 0 && !selectedDate) setSelectedDate(daysToShow[0].fullDate);
    }, [daysToShow]);

    const availableTimes = useMemo(() => {
        if (!movie || !movie.schedules || !selectedDate) return [];
        const schedule = movie.schedules.find(s => s.date === selectedDate);
        return schedule ? schedule.times : [];
    }, [selectedDate, movie]);

    const selectedSeatsData = useMemo(() => {
        const selected = [];
        let totalPrice = 0;
        rows.forEach((row) => {
            if (row.isAisle) return;
            row.seats.forEach((status, sIdx) => {
                if (status === 'selected') {
                    selected.push(`${row.label}${sIdx + 1}`);
                    totalPrice += row.price;
                }
            });
        });
        return { selected, totalPrice };
    }, [rows]);

    const handleSeatClick = (rowIndex, seatIndex) => {
        const newRows = [...rows];
        const currentStatus = newRows[rowIndex].seats[seatIndex];
        if (currentStatus === 'booked') return;
        newRows[rowIndex].seats[seatIndex] = currentStatus === 'selected' ? 'available' : 'selected';
        setRows(newRows);
    };

    if (!movie) return <div className="loading-screen">Loading Wide Angle Booking...</div>;

    return (
        <div className="booking-main-wrapper pt-130" style={{ backgroundColor: '#0b0d12', minHeight: '100vh', color: '#fff' }}>
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />
            <hr className="hrzl_booking" />
            {/* Header / Date & Time Selector */}
           <section className="booking-selection-area py-2" style={{ background: '#0b0d12', borderBottom: '1px solid #1c212c' }}>
    <div className="container">
        <div className="row g-4 align-items-end">
            
            {/* 1. CREATIVE DATE SELECTOR */}
            <div className="col-lg-12">
                
                <div className='row'>
                    <div className='col-xl-1 calendar__icon'>
                    <FaCalendarAlt className="text-warning" style={{width: '2em', height: '2em', color: '#e2d191' }} />
                    </div>
                <div className='col-xl-11'>
                    <div className="date-swiper-wrapper select__date-wrapper">
                        <Swiper 
                            modules={[Navigation]} 
                            spaceBetween={12} 
                            slidesPerView={2}
                            navigation
                            breakpoints={{
                                480: { slidesPerView: 3 },
                                768: { slidesPerView: 5 },
                                1200: { slidesPerView: 7 }
                            }}
                        >
                            {daysToShow.map((item) => (
                                <SwiperSlide key={item.fullDate}>
                                    <div 
                                        className={`creative-date-pill ${selectedDate === item.fullDate ? 'active' : ''}`}
                                        onClick={() => setSelectedDate(item.fullDate)}
                                    >
                                        <span className="month">{item.month}</span>
                                        <span className="date-num">{item.dayNum}</span>
                                        <span className="day-name">{item.dayName}</span>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
                </div>

            </div>
        </div>
    </div>
</section>

            <section className="booking-movie-info pt-20 pb-50" style={{
                backgroundImage: `url(${
                    movie?.background || "/assets/img/bg/episode_bg.jpg"
                })`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                }}>
                    <div className='container'>
                        <div className='row'>
                            <div className="d-flex align-items-center gap-2 mb-3 col-xl-12 justify-content-center">
                                    <FaRegClock className="" style={{ color: '#fff' }} />
                                    <span className="text-uppercase fw-bold" style={{ fontSize: '16px', letterSpacing: '2px' }}>Available Time</span>
                                </div>
                                
                                <div className="mb-4 col-xl-12">
                                    <div className='row gap-4 justify-content-center creative--pill'>
                                    {availableTimes.length > 0 ? (
                                        
                                        availableTimes.map((t, i) => (
                                            <button 
                                                key={i} 
                                                className={`creative-time-pill ${selectedTime === t ? 'active' : ''}`}
                                                onClick={() => setSelectedTime(t)}
                                            >
                                                {t}
                                            </button>
                                        ))
                                    ) : (
                                        <div className="text-white-50 small p-3 bg-dark rounded">No shows today</div>
                                    )}
                                    </div>
                                </div>
                        </div>
                    </div>
                <div className="container px-5 mt-5">
                    
                    <div className="row">
                        {/* RIGHT SEATING MAP: Layout matches screenshot exactly */}
                        <div className="col-xl-9 col-lg-8">
                            <div className="seating-area-container text-center">
                                {/* Screen Curve Graphic */}
                                <div className="screen-wrapper mb-5 mx-auto" style={{ maxWidth: '100%' }}>
                                    <div style={{ height: '4px', background: '#d4a017', borderRadius: '50% / 100% 100% 0 0', boxShadow: '0 -5px 15px rgba(212,160,23,0.5)' }}></div>
                                    <p className="mt-3" style={{ letterSpacing: '5px', fontSize: '12px', color: '#5b616e' }}>SCREEN THIS WAY</p>
                                </div>

                                {/* Legend */}
                                <div className="d-flex justify-content-center gap-4 mb-5" style={{ fontSize: '11px', color: '#5b616e' }}>
                                    <div className="d-flex align-items-center gap-2"><div style={{ width: '12px', height: '12px', border: '1px solid #5b616e' }}></div> Available</div>
                                    <div className="d-flex align-items-center gap-2"><div style={{ width: '12px', height: '12px', background: '#333' }}></div> Booked</div>
                                    <div className="d-flex align-items-center gap-2"><div style={{ width: '12px', height: '12px', background: '#31d7f9' }}></div> Selected</div>
                                </div>

                                {/* Seating Grid */}
                                <div className="seats-grid-wrapper overflow-auto pb-5">
                                    <table className="tablepro mx-auto" style={{ borderCollapse: 'separate', borderSpacing: '8px' }}>
                                        <tbody>
                                            {rows.map((row, rIdx) => (
                                                <React.Fragment key={rIdx}>
                                                    {/* Header for Category */}
                                                    {(row.label === 'A' || row.label === 'C') && (
                                                        <tr>
                                                            <td></td>
                                                            <td colSpan="15">
                                                                <div className="d-flex align-items-center gap-3 my-3">
                                                                    <div className="flex-grow-1" style={{ height: '1px', background: row.label === 'A' ? '#d4a01744' : '#31d7f944' }}></div>
                                                                    <span style={{ color: row.label === 'A' ? '#d4a017' : '#31d7f9', fontSize: '10px', fontWeight: 'bold', letterSpacing: '2px' }}>
                                                                        {row.category} — NRs. {row.price}
                                                                    </span>
                                                                    <div className="flex-grow-1" style={{ height: '1px', background: row.label === 'A' ? '#d4a01744' : '#31d7f944' }}></div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}

                                                    {row.isAisle ? <tr style={{ height: '20px' }}></tr> : (
                                                        <tr>
                                                            <td className="pe-4 text-muted small fw-bold">{row.label}</td>
                                                            {row.seats.map((status, sIdx) => (
                                                                <td key={sIdx}>
                                                                    <div 
                                                                        onClick={() => handleSeatClick(rIdx, sIdx)}
                                                                        className={`seat-box ${status}`}
                                                                        style={{
                                                                            width: '28px', height: '26px', borderRadius: '4px',
                                                                            border: status === 'available' ? `1px solid ${row.label < 'C' ? '#d4a017' : '#31d7f9'}88` : 'none',
                                                                            background: status === 'selected' ? '#31d7f9' : status === 'booked' ? '#333' : 'transparent',
                                                                            cursor: status === 'booked' ? 'not-allowed' : 'pointer',
                                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                            fontSize: '9px', color: status === 'selected' ? '#000' : '#fff'
                                                                        }}
                                                                    >
                                                                        {status !== 'booked' && (sIdx + 1)}
                                                                    </div>
                                                                </td>
                                                            ))}
                                                            <td className="ps-4 text-muted small fw-bold">{row.label}</td>
                                                        </tr>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        
                        {/* LEFT SIDEBAR: Layout matches screenshot exactly */}
                        <div className="col-xl-3 col-lg-4">
                            <div className="booking-summary-sidebar">
                                <h6 className="text-white mb-3">Your Selected Seats</h6>
                                <div className="seat-tags-container mb-4" style={{ minHeight: '40px' }}>
                                    {selectedSeatsData.selected.length > 0 ? (
                                        <div className="d-flex flex-wrap gap-2">
                                            {selectedSeatsData.selected.map(seat => (
                                                <span key={seat} style={{ background: '#1c212c', color: '#31d7f9', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', border: '1px solid #31d7f9' }}>{seat}</span>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="text-muted" style={{ fontSize: '13px', background: '#1c212c', padding: '5px 15px', borderRadius: '4px' }}>No seats selected</span>
                                    )}
                                </div>
                                <div className='thumbnail_area'>

                                    <img 
                                        src={`/${movie.thumbnail}`} 
                                        alt={movie.title} 
                                        style={{borderRadius: '4px', objectFit: 'cover' }} 
                                    />

                                </div>
                                <div className="price-breakdown mt-5">
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-muted">Tickets</span>
                                        <span>NRs. {selectedSeatsData.totalPrice}</span>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center mt-4">
                                        <h4 className=" mb-0">Total</h4>
                                        <h4 className=" mb-0">NRs. {selectedSeatsData.totalPrice}/-</h4>
                                    </div>
                                    <div style={{ height: '2px', background: '#d4a017', width: '100%', marginTop: '5px' }}></div>
                                </div>

                                
                                <Link href="/food">
                                <button className="btn w-100 mt-3 py-3 text-uppercase fw-bold" style={{ borderRadius: '30px'}}>Purchase</button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <SeatSelectionPopup isOpen={isModalOpen} onConfirm={() => setIsModalOpen(false)} />
            <NewsLatter />
        </div>
        
    );
}