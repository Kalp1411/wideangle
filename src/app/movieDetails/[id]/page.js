"use client";

import Link from "next/link";
import Script from "next/script";
import { streamingItems } from "@/data/streamingItems";
import React, { useMemo, useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Needed to get the ID
import ModalVideo from "react-modal-video";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "animate.css";
import "react-modal-video/css/modal-video.css";
import NewsLatter from "@/app/components/newslatter";
import {
  FaClock,
  FaThumbsUp,
  FaChevronLeft,
  FaChevronRight,
  FaCalendarAlt,
  FaRegClock,
  FaPlay,
  FaPercentage,
} from "react-icons/fa";
import SeatSelectionPopup from "@/app/components/SeatSelectionPopup";
import { toast } from "sonner";
import { Asset } from "next/font/google";

export default function MovieDetails() {
  const params = useParams();
  const id = params.id; // This is your dynamic ID from the URL

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requiredSeats, setRequiredSeats] = useState(0);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isOfferDrawerOpen, setIsOfferDrawerOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);

  // Mock offers list
  const offers = [
    {
      id: 1,
      code: "WELCOME20",
      discount: 20,
      description: "20% off on first booking",
    },
    {
      id: 2,
      code: "MOVIEBUFF",
      discount: 50,
      description: "Flat ₹50 off on 2+ tickets",
    },
  ];

  // Open popup automatically on load
  useEffect(() => {
    setIsModalOpen(true);
  }, []);

  const handleSelectionConfirm = (count) => {
    setRequiredSeats(count);
    setIsModalOpen(false);
    console.log(`User wants to book ${count} seats`);
  };

  const [rows, setRows] = useState([
    {
      label: "A",
      price: 220,
      category: "Platinum",
      seats: Array(15).fill("available"),
    },
    {
      label: "B",
      price: 220,
      category: "Platinum",
      seats: Array(15).fill("available"),
    },
    { label: "-", isAisle: true },
    {
      label: "C",
      price: 150,
      category: "Gold",
      seats: Array(15).fill("available"),
    },
    {
      label: "D",
      price: 150,
      category: "Gold",
      seats: Array(15).fill("available"),
    },
    {
      label: "E",
      price: 150,
      category: "Gold",
      seats: Array(15).fill("available"),
    },
    {
      label: "F",
      price: 150,
      category: "Silver",
      seats: Array(15).fill("available"),
    },
    {
      label: "G",
      price: 150,
      category: "Silver",
      seats: Array(15).fill("available"),
    },
  ]);

  // 2. CALCULATE SELECTED SEATS DYNAMICALLY
  const selectedSeatsData = useMemo(() => {
    const selected = [];
    let totalPrice = 0;
    const categoryCount = {};

    rows.forEach((row, rIdx) => {
      if (row.isAisle) return;
      row.seats.forEach((status, sIdx) => {
        if (status === "selected") {
          const seatName = `${row.label}${sIdx + 1}`;
          selected.push(seatName);
          totalPrice += row.price;

          // Group by category for the summary table
          categoryCount[row.category] = (categoryCount[row.category] || 0) + 1;
        }
      });
    });

    return { selected, totalPrice, categoryCount, count: selected.length };
  }, [rows]);

  // 2. Toggle Selection Function
  const handleSeatClick = (rIdx, sIdx) => {
    const status = rows[rIdx]?.seats[sIdx];
    if (!status || status === "booked") return;

    const isSelecting = status === "available";
    if (isSelecting && requiredSeats > 0 && selectedSeatsData.count >= requiredSeats) {
      toast.error(`You can only select ${requiredSeats} seat${requiredSeats > 1 ? "s" : ""}`);
      return;
    }

    setRows((prev) =>
      prev.map((r, ri) => {
        if (ri !== rIdx) return r;
        const newSeats = [...r.seats];
        newSeats[sIdx] = isSelecting ? "selected" : "available";
        return { ...r, seats: newSeats };
      })
    );
  };

  const LuxurySeatIcon = ({ status, color }) => {
    const fillColor =
      status === "selected" ? "#31d7f9" : status === "booked" ? "#333" : "#fff";
    const strokeColor = status === "selected" ? "#31d7f9" : color;

    return (
      <svg
        width="40"
        height="32"
        viewBox="0 0 23 23"
        fill={fillColor}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3.71299 12.5778C2.87358 12.581 2.18303 11.8957 2.17981 11.0563L2.16228 6.48016C2.1593 5.64093 2.84449 4.95019 3.68377 4.94697L18.3262 4.89089C19.1654 4.88782 19.856 5.57323 19.8594 6.41237L19.8769 10.9885C19.8785 11.3935 19.7191 11.7828 19.4338 12.0703C19.1485 12.3578 18.7605 12.5201 18.3555 12.5217C17.9504 12.5232 17.5612 12.3639 17.2737 12.0786C16.9861 11.7932 16.8238 11.4053 16.8223 11.0002L16.8106 7.95238L5.2228 7.99677L5.23448 11.0446C5.23769 11.8839 4.55225 12.5744 3.71299 12.5778ZM15.6269 17.1084L6.47562 17.1434C5.6363 17.1466 4.94579 16.4612 4.94244 15.6219L4.93565 13.8504C6.00508 13.3794 6.75985 12.3133 6.75508 11.0661L6.74912 9.51144L15.295 9.47871L15.301 11.0431C15.3059 12.2808 16.0685 13.3485 17.1416 13.8125L17.1484 15.5752C17.1515 16.4145 16.4662 17.1051 15.6269 17.1084Z"
          stroke={strokeColor}
          strokeWidth="0.605714"
        />
      </svg>
    );
  };

  const [isOpen, setOpen] = useState(false);
  const [movie, setMovie] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null); // Track active date
  const [showSticky, setShowSticky] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);

  const availableTimes = useMemo(() => {
    if (!movie || !movie.schedules || !selectedDate) return [];

    const scheduleForDate = movie.schedules.find(
      (s) => s.date === selectedDate,
    );

    return scheduleForDate ? scheduleForDate.times : [];
  }, [selectedDate, movie]);

  useEffect(() => {
    setSelectedTime(null);
  }, [selectedDate]);

  const daysToShow = useMemo(() => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push({
        month: date.toLocaleString("en-US", { month: "short" }),
        dayNum: date.getDate(),
        dayName: date.toLocaleString("en-US", { weekday: "short" }),
        fullDate: date.toISOString().split("T")[0],
      });
    }
    return dates;
  }, []);

  useEffect(() => {
    if (daysToShow.length > 0 && !selectedDate)
      setSelectedDate(daysToShow[0].fullDate);
    const movieData = streamingItems.Items.find(
      (item) => item.id === Number(id),
    );
    if (movieData) setMovie(movieData);
  }, [id, daysToShow]);

  useEffect(() => {
    // 1. Fetching logic - Replace this with your actual API or WordPress endpoint
    // For now, we simulate finding a movie by ID
    const fetchMovie = async () => {
      // Example: const res = await fetch(`https://your-api.com/movies/${id}`);
      // const data = await res.json();

      // Mock Data for demonstration
      console.log("selected id is ", id);
      console.log("movies are ", streamingItems.Items);
      const movie = streamingItems.Items.find((item) => item.id === Number(id));
      if (movie != null) {
        setMovie(movie);
      } else {
        console.log("Movie not found");
      }
    };

    fetchMovie();

    // 2. Background and WOW.js logic
    const elements = document.querySelectorAll("[data-background]");
    elements.forEach((el) => {
      const bg = el.getAttribute("data-background");
      if (bg) el.style.backgroundImage = `url(${bg})`;
    });

    if (typeof window !== "undefined") {
      const { WOW } = require("wowjs");
      const wow = new WOW({ live: false });
      wow.init();
    }
  }, [id, daysToShow]);

  const makePayment = async () => {
    try {
      // 1. Create order on the server
      const res = await fetch("/api/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: selectedSeatsData.totalPrice }),
      });

      const order = await res.json();

      if (!order.id) throw new Error("Order creation failed");

      // 2. Initialize Razorpay Checkout
      const options = {
        key: "rzp_test_RnA0qucHHHkFWN",
        name: "Your Movie App",
        description: `Payment for movie booking`,
        order_id: order.id,
        handler: function (response) {
          alert(
            "Payment Successful! Payment ID: " + response.razorpay_payment_id,
          );
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
        },
        theme: { color: "#31d7f9" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment failed", err);
      alert("Could not initialize payment. Check console for details.");
    }
  };

  // Updated Total Calculation
  const finalPrice = useMemo(() => {
    let total = selectedSeatsData.totalPrice; //
    if (selectedOffer) {
      total =
        selectedOffer.code === "WELCOME20"
          ? total * 0.8
          : Math.max(0, total - selectedOffer.discount);
    }
    return total;
  }, [selectedSeatsData.totalPrice, selectedOffer]);

  const recommendations = useMemo(() => {
    return streamingItems.Items.filter((item) => item.id !== Number(id)).slice(
      0,
      10,
    );
  }, [id]);

  // 2. Scroll Listener for Sticky Bar
  useEffect(() => {
    const handleScroll = () => {
      // Show sticky bar after scrolling 400px
      if (window.scrollY > 400) {
        setShowSticky(true);
      } else {
        setShowSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!movie) return null; // Or return your skeleton loading here

  return (
    <>
      
      <ModalVideo
        channel="youtube"
        isOpen={isOpen}
        videoId={movie.videoUrl}
        onClose={() => setOpen(false)}
      />
      {isDetailsOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate__animated animate__fadeIn">
          <div className="bg-[#1c212c] border border-[#d4a01744] w-full max-w-4xl rounded-xl overflow-hidden shadow-2xl animate__animated animate__zoomIn">
            {/* Modal Header */}
            <div className="relative w-full">
              <button
                onClick={() => setIsDetailsOpen(false)}
                className="absolute top-4 right-4 bg-black/50 hover:bg-[#d4a017] text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 text-white">
              <div className="Title">
                <h2 className="text-3xl font-bold text-white mb-3">Cast</h2>
                <ul className="cast-details mb-3">
                  <li>
                    <img src="/assets/img/poster/huma.webp" />
                    <div className="nameinfo mt-1">
                      <span>Huma Qureshi</span>
                      <span className="nameact">Actor</span>
                    </div>
                  </li>
                  <li>
                    <img src="/assets/img/poster/akshay.webp" />
                    <div className="nameinfo mt-1">
                      <span>Akshay Kumar</span>
                      <span className="nameact">Actor</span>
                    </div>
                  </li>
                  <li>
                    <img src="/assets/img/poster/arshad.webp" />
                    <div className="nameinfo mt-1">
                      <span>Arshad Warsi</span>
                      <span className="nameact">Actor</span>
                    </div>
                  </li>
                  <li>
                    <img src="/assets/img/poster/saurabh.webp" />
                    <div className="nameinfo mt-1">
                      <span>Saurabh Shukla</span>
                      <span className="nameact">Actor</span>
                    </div>
                  </li>
                  <li>
                    <img src="/assets/img/poster/amrita.webp" />
                    <div className="nameinfo mt-1">
                      <span>Amrita Rao</span>
                      <span className="nameact">Actor</span>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="Title">
                <h2 className="text-3xl font-bold text-white mb-3">Crew</h2>
                <ul className="cast-details mb-3">
                  <li>
                    <img src="/assets/img/poster/subhash.webp" />
                    <div className="nameinfo mt-1">
                      <span>Subhash Kapoor</span>
                      <span className="nameact">Director, Writer</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Movie Details */}
      <section
        className="movie-details-area"
        style={{
          backgroundImage: `url(${
            movie?.background || "/assets/img/bg/movie_details_bg.jpg"
          })`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container">
          <div className="row align-items-center position-relative">
            <div className="col-xl-3 col-lg-4 col-md-3">
              <div className="movie-details-img">
                <img src={`/${movie.thumbnail}`} alt={movie.title} />
                <Link
                  href="#!"
                  onClick={(e) => {
                    e.preventDefault();
                    setOpen(true);
                  }}
                  className="popup-video wow fadeInUp"
                  data-wow-delay=".8s"
                  data-wow-duration="1.8s"
                >
                  <img src="/assets/img/images/play_icon.png" alt="Play" />
                </Link>
              </div>
            </div>

            <div className="col-xl-6 col-lg-8 col-md-9">
              <div className="movie-details-content">
                <h5>{movie.genre}</h5>
                <h2>{movie.title}</h2>
                <div className="banner-meta">
                  <ul>
                    <li className="quality">
                      <span>Pg 18</span>
                      <span>hd</span>
                    </li>
                    <li className="category">
                      <a href="#">{movie.category}</a>
                    </li>
                    <li className="release-time">
                      <span className="d-flex align-items-center gap-3">
                        <FaCalendarAlt size={14} fill="#F28C28" /> {movie.years}
                      </span>
                      <span className="d-flex align-items-center gap-3">
                        <FaClock size={14} fill="#F28C28" /> {movie.minitus}
                      </span>
                    </li>
                  </ul>
                </div>
                <p>
                  This is the dynamic description for movie {id}. You can pull
                  this content from your WordPress ACF fields or Laravel
                  database.
                </p>
                <div className="" id="booktickets">
                  <Link href={`#booktickets`} className="btn mt-3">
                    Book Tickets
                  </Link>
                  <button
                    onClick={() => setIsDetailsOpen(true)}
                    className="btn ml-3 mt-3"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/*Movie Details end*/}

      
      <div
        className="booking-main-wrapper pt-0"
        style={{
          backgroundColor: "#0b0d12",
          color: "#fff",
        }}
      >
        <Script src="https://checkout.razorpay.com/v1/checkout.js" />

        {/* Header / Date Selector */}
        <section
          className="booking-selection-area py-2"
          style={{ background: "#0b0d12", borderBottom: "1px solid #1c212c" }}
        >
          <div className="container">
            <div className="row g-4 align-items-end">
              {/* 1. CREATIVE DATE SELECTOR */}
              <div className="col-lg-12">
                <div className="row">
                  <div className="col-xl-1 col-lg-1 col-sm-1 col-md-1 calendar__icon">
                    <FaCalendarAlt
                      className="text-warning"
                      style={{ width: "2em", height: "2em", color: "#e2d191" }}
                    />
                  </div>
                  <div className="col-xl-11 col-lg-11 col-sm-11 col-md-11">
                    <div className="date-swiper-wrapper select__date-wrapper">
                      <Swiper
                        modules={[Navigation]}
                        spaceBetween={12}
                        slidesPerView={2}
                        navigation
                        breakpoints={{
                          480: { slidesPerView: 3 },
                          768: { slidesPerView: 5 },
                          1200: { slidesPerView: 7 },
                        }}
                      >
                        {daysToShow.map((item) => (
                          <SwiperSlide key={item.fullDate}>
                            <div
                              className={`creative-date-pill ${selectedDate === item.fullDate ? "active" : ""}`}
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

        {/* Movie Info Start*/}
        <section
          className="booking-movie-info pt-20 pb-50"
          style={{
            backgroundImage: `url(${
              movie?.background || "/assets/img/bg/episode_bg.jpg"
            })`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Time Selector */}
          <div className="container">
            <div className="row">
              <div className="d-flex align-items-center gap-2 mb-3 col-xl-12 justify-content-center">
                <FaRegClock className="" style={{ color: "#fff" }} />
                <span
                  className="text-uppercase fw-bold"
                  style={{ fontSize: "16px", letterSpacing: "2px" }}
                >
                  Available Time
                </span>
              </div>

              <div className="mb-4 col-xl-12">
                <div className="row gap-4 justify-content-center creative--pill">
                  {availableTimes.length > 0 ? (
                    availableTimes.map((t, i) => (
                      <button
                        key={i}
                        className={`creative-time-pill ${selectedTime === t ? "active" : ""}`}
                        onClick={() => setSelectedTime(t)}
                      >
                        {t}
                      </button>
                    ))
                  ) : (
                    <div className="text-white-50 small p-3 bg-dark rounded">
                      No shows today
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="container px-5 mt-5">
            <div className="row">
              {/* Big Screen Selector  */}
              {/* RIGHT SEATING MAP: Layout matches screenshot exactly */}
              <div className="col-xl-9 col-lg-8">
                <div className=" py-10 text-white font-sans">
                  <div className="max-w-4xl mx-auto px-4">
                    {/* Curved Screen */}
                    <div className="relative mb-16 text-center">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-[50px] bg-gradient-to-b from-[#d4a01722] to-transparent blur-xl"></div>

                      {/* The Single Curved Line */}
                      <svg viewBox="0 0 800 40" className="w-full h-auto">
                        <path
                          d="M10,35 Q400,5 790,35"
                          fill="none"
                          stroke="#fff"
                          strokeWidth="3"
                          strokeLinecap="round"
                          style={{
                            filter:
                              "drop-shadow(0px 0px 8px rgba(212, 160, 23, 0.8))",
                          }}
                        />
                      </svg>

                      <p className="text-center mt-4 text-[11px] tracking-[8px] text-gray-500 font-light">
                        SCREEN THIS WAY
                      </p>
                    </div>

                    {/* Legend */}
                    <div className="flex justify-center gap-8 mb-12 text-xs text-gray-400">
                      <div className="flex items-center gap-2">
                        <LuxurySeatIcon status="available" color="#5b616e" />{" "}
                        Available
                      </div>
                      <div className="flex items-center gap-2">
                        <LuxurySeatIcon status="booked" color="#333" /> Booked
                      </div>
                      <div className="flex items-center gap-2">
                        <LuxurySeatIcon status="selected" color="#31d7f9" />{" "}
                        Selected
                      </div>
                    </div>

                    {/* Seating Grid */}
                    <div className="overflow-x-auto pb-10">
                      <table className="mx-auto border-separate border-spacing-y-4 border-spacing-x-2 tablepro">
                        <tbody>
                          {rows.map((row, rIdx) => (
                            <React.Fragment key={rIdx}>
                              {/* Category Header */}
                              {(row.label === "A" || row.label === "C") && (
                                <tr>
                                  <td colSpan="100%">
                                    <div className="flex items-center gap-4 my-6">
                                      <div
                                        className={`h-[1px] flex-grow ${row.label === "A" ? "bg-[#d4a01744]" : "bg-[#31d7f944]"}`}
                                      ></div>
                                      <span
                                        className={`text-[10px] font-bold tracking-widest ${row.label === "A" ? "text-[#d4a017]" : "text-[#31d7f9]"}`}
                                      >
                                        {row.category} — ₹ {row.price}
                                      </span>
                                      <div
                                        className={`h-[1px] flex-grow ${row.label === "A" ? "bg-[#d4a01744]" : "bg-[#31d7f944]"}`}
                                      ></div>
                                    </div>
                                  </td>
                                </tr>
                              )}

                              {row.isAisle ? (
                                <tr className="h-8"></tr>
                              ) : (
                                <tr>
                                  <td className="pr-6 text-gray-500 text-xs font-bold">
                                    {row.label}
                                  </td>
                                  {row.seats.map((status, sIdx) => (
                                    <td key={sIdx} className="relative group">
                                      <button
                                        onClick={() =>
                                          handleSeatClick(rIdx, sIdx)
                                        }
                                        disabled={status === "booked"}
                                        className="transition-transform duration-200 hover:scale-110 outline-none seats_button"
                                      >
                                        <LuxurySeatIcon
                                          status={status}
                                          color={
                                            row.label < "C" ? "#fff" : "#fff"
                                          }
                                        />
                                        {status !== "booked" && (
                                          <span
                                            className={` text-[11px] font-bold mt-1 ${status === "selected" ? "text-black" : "text-black"}`}
                                          >
                                            {sIdx + 1}
                                          </span>
                                        )}
                                      </button>
                                    </td>
                                  ))}
                                  <td className="pl-6 text-gray-500 text-xs font-bold">
                                    {row.label}
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              {/* Your Selected Seats */}
              {/* LEFT SIDEBAR: Layout matches screenshot exactly */}
              <div className="col-xl-3 col-lg-4">
                <div className="booking-summary-sidebar">
                  <h6 className="text-white mb-3">Your Selected Seats</h6>
                  {/* Category-wise Breakdown */}
                  <div className="category-breakdown mb-3">
                    {Object.keys(selectedSeatsData.categoryCount).length > 0 ? (
                      Object.entries(selectedSeatsData.categoryCount).map(
                        ([category, count]) => (
                          <div
                            key={category}
                            className="d-flex justify-content-between align-items-center mb-1"
                          >
                            <span
                              style={{
                                fontSize: "13px",
                                color:
                                  category === "Platinum"
                                    ? "#d4a017"
                                    : "#31d7f9",
                              }}
                            >
                              {category}
                            </span>
                            <span
                              className="badge"
                              style={{
                                background: "#1c212c",
                                border: "1px solid #333",
                              }}
                            >
                              {count} {count > 1 ? "Seats" : "Seat"}
                            </span>
                          </div>
                        ),
                      )
                    ) : (
                      <span className="text-muted" style={{ fontSize: "13px" }}>
                        No categories selected
                      </span>
                    )}
                  </div>

                  {/* Visual Seat Tags (Individual Seat Numbers) */}
                  <div
                    className="seat-tags-container mb-4"
                    style={{ minHeight: "40px" }}
                  >
                    {selectedSeatsData.selected.length > 0 ? (
                      <div className="d-flex flex-wrap gap-2">
                        {selectedSeatsData.selected.map((seat) => (
                          <span
                            key={seat}
                            style={{
                              background: "#1c212c",
                              color: "#31d7f9",
                              padding: "4px 10px",
                              borderRadius: "4px",
                              fontSize: "12px",
                              border: "1px solid #31d7f9",
                            }}
                          >
                            {seat}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span
                        className="text-muted"
                        style={{
                          fontSize: "13px",
                          background: "#1c212c",
                          padding: "5px 15px",
                          borderRadius: "4px",
                        }}
                      >
                        No seats selected
                      </span>
                    )}
                  </div>
                  <div className="thumbnail_area">
                    <img
                      src={`/${movie.thumbnail}`}
                      alt={movie.title}
                      style={{ borderRadius: "4px", objectFit: "cover" }}
                    />
                  </div>
                  <button
                    onClick={() => setIsOfferDrawerOpen(true)}
                    className="btn w-100 mt-4 mb-3 d-flex align-items-center justify-content-center gap-2"
                    style={{
                      background: "transparent",
                      border: "1px dashed #d4a017",
                      color: "#d4a017",
                    }}
                  >
                    <FaPercentage /> View Offers
                  </button>
                  <div className="price-breakdown mt-4">
                    {/* 1. Total Ticket Price (Original) */}
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Total ticket price</span>
                      <span className="text-white">
                        ₹ {selectedSeatsData.totalPrice}
                      </span>
                    </div>

                    {/* 2. Dynamic Offer Row with Remove Action */}
                    {selectedOffer && (
                      <div
                        className="d-flex justify-content-between align-items-center mb-2 p-2 rounded"
                        style={{
                          background: "#1c212c",
                          border: "1px dashed #d4a017",
                        }}
                      >
                        <div>
                          <span className="text-success small d-block">
                            Offer Applied:
                          </span>
                          <span
                            className="text-white fw-bold"
                            style={{ fontSize: "12px" }}
                          >
                            {selectedOffer.code}
                          </span>
                        </div>
                        <div className="text-end">
                          <span className="text-success d-block">
                            - ₹ {selectedSeatsData.totalPrice - finalPrice}
                          </span>
                          <button
                            onClick={() => setSelectedOffer(null)}
                            className="btn-sm p-0 border-0 bg-transparent text-danger mt-1"
                            style={{
                              fontSize: "10px",
                              textDecoration: "underline",
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    )}

                    {/* 3. Final Total Price */}
                    <div className="d-flex justify-content-between align-items-center mt-4">
                      <h4 className="mb-0 text-white">Total price</h4>
                      <h4 className="mb-0" style={{ color: "#31d7f9" }}>
                        ₹ {finalPrice}/-
                      </h4>
                    </div>
                    <div
                      style={{
                        height: "2px",
                        background: "#d4a017",
                        width: "100%",
                        marginTop: "5px",
                      }}
                    ></div>
                  </div>

                  <Link
                    href={{
                      pathname: "/food",
                      query: {
                        movieId: movie.id,
                        date: selectedDate,
                        time: selectedTime,
                        seats: selectedSeatsData.selected.join(","),
                      },
                    }}
                  >
                    <button
                      className="btn w-100 mt-3 py-3 text-uppercase fw-bold"
                      style={{ borderRadius: "30px" }}
                    >
                      Continue
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>


      {/* You might also like Start */}
      <section
        className="tv-series-area tv-series-bg"
        style={{
          backgroundImage: `url(${
            "/assets/img/bg/tv_series_bg02.jpg"
          })`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="section-title text-left mb-50">
                <h2 className="title">You might also like</h2>
              </div>
            </div>
            <div className="col-md-4 text-md-end">
              <div className="custom-swiper-nav d-flex gap-2 justify-content-md-end">
                <button className="rec-prev nav-btn-circle">
                  <FaChevronLeft />
                </button>
                <button className="rec-next nav-btn-circle">
                  <FaChevronRight />
                </button>
              </div>
            </div>
          </div>
          <div className="recommendation-slider">
            <Swiper
              modules={[Navigation]}
              spaceBetween={25}
              slidesPerView={1}
              navigation={{
                prevEl: ".rec-prev",
                nextEl: ".rec-next",
              }}
              breakpoints={{
                480: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1200: { slidesPerView: 4 },
              }}
            >
              {recommendations.map((item) => (
                <SwiperSlide key={item.id}>
                  <div className="movie-card-creative">
                    <div className="movie-poster">
                      <Link href={`/movieDetails/${item.id}`}>
                        <img src={`/${item.thumbnail}`} alt={item.title} />
                      </Link>
                      <div className="poster-overlay">
                        <Link
                          href="#!"
                          onClick={(e) => {
                            e.preventDefault();
                            setOpen(true);
                          }}
                          className="play-btn popup-video"
                        >
                          <FaPlay size={20} fill="" />
                        </Link>
                      </div>
                    </div>
                    <div className="movie-content mt-3">
                      <div className="top">
                        <h5 className="title mb-0">
                          <Link
                            href={`/movieDetails/${item.id}`}
                            className="text-white text-decoration-none"
                          >
                            {item.title}
                          </Link>
                        </h5>
                        <Link
                          href={`/movieDetails/${item.id}`}
                          className="btn btn-sm"
                        >
                          <span className="year" style={{ color: "#e2d191" }}>
                            Book Now
                          </span>
                        </Link>
                      </div>
                      <div
                        className="bottom"
                        style={{ fontSize: "12px", color: "#5b616e" }}
                      >
                        <ul>
                          <li>
                            <span className="quality">{item.quality}</span>
                          </li>
                          <li className="gap-4">
                            <span className="language">{item.language}</span>
                            <span className="duration d-flex align-items-center gap-1">
                              <FaClock size={14} fill="#F28C28" />{" "}
                              {item.minitus}
                            </span>
                            <span className="rating d-flex align-items-center gap-1">
                              <FaThumbsUp size={14} fill="#F28C28" />{" "}
                              {item.like}
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>
      <NewsLatter />
      {/* --- NEW STICKY BOTTOM AREA --- */}
      <div className={`sticky-booking-bar ${showSticky ? "active" : ""}`}>
        <div className="container">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-3">
              <img
                src={`/${movie.thumbnail}`}
                alt={movie.title}
                style={{
                  width: "40px",
                  height: "60px",
                  borderRadius: "4px",
                  objectFit: "cover",
                }}
              />
              <div>
                <h6 className="text-white mb-0">{movie.title}</h6>
                <small style={{ color: "#e2d191" }}>
                  {movie.genre} • {movie.minitus}
                </small>
              </div>
            </div>

            <Link
              href={{
                pathname: "/food",
                query: {
                  movieId: movie.id,
                  date: selectedDate,
                  time: selectedTime,
                  seats: selectedSeatsData.selected.join(","),
                },
              }}
              className="btn btn-sm"
            >
              Book Tickets
            </Link>
          </div>
        </div>
      </div>
      {/* Offer Drawer Overlay */}
      <div
        className={`fixed inset-0 z-[10000] bg-black/60 transition-opacity duration-300 ${isOfferDrawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsOfferDrawerOpen(false)}
      >
        {/* Drawer Content */}
        <div
          className={`fixed top-0 right-0 h-full w-full max-w-[400px] bg-[#1c212c] shadow-2xl transition-transform duration-300 ease-in-out p-6 available_offers ${isOfferDrawerOpen ? "translate-x-0" : "translate-x-full"}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3 border-[#333]">
            <h5 className="text-white mb-0">Available Offers</h5>
            <button
              onClick={() => setIsOfferDrawerOpen(false)}
              className="text-white"
            >
              ✕
            </button>
          </div>

          <div className="offers-list">
            {offers.map((offer) => (
              <div
                key={offer.id}
                className={`p-3 mb-3 rounded border cursor-pointer transition-all ${selectedOffer?.id === offer.id ? "border-[#d4a017] bg-[#d4a01711]" : "border-[#333] hover:border-[#555]"}`}
                onClick={() => {
                  setSelectedOffer(offer);
                  setIsOfferDrawerOpen(false);
                }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <span className="fw-bold text-white">{offer.code}</span>
                  {selectedOffer?.id === offer.id && (
                    <span className="text-[#d4a017] text-xs">Applied</span>
                  )}
                </div>
                <p className="small text-muted mb-0 mt-1">
                  {offer.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
  // Inline styles for the button and container
  const stickyBarStyle = {
    boxShadow: "0 -10px 30px rgba(0,0,0,0.5)",
  };

  const stickyBtnStyle = {
    backgroundColor: "#e2d191",
    color: "#000",
    fontWeight: "bold",
    padding: "10px 25px",
    borderRadius: "30px",
    fontSize: "14px",
    textTransform: "uppercase",
  };
}
