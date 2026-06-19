"use client";

import Link from "next/link";
import Script from "next/script";

import React, { useMemo, useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation"; // Needed to get the ID
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
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAvailableShowtimes,
  fetchMovies,
  fetchSeatOfShowtime,
  fetchSingleMovieDetail,
} from "@/store/movieSlice";
import { capitalizeName, formatDuration } from "@/utils/helper";
import { convertTo12HourFormat } from "@/utils/helper";
import { MdEventSeat } from "react-icons/md";
import { toast } from "sonner";
import { holdBoxOfficeTicket } from "@/store/boxOfficeSlice";

export default function MovieDetails() {
  const params = useParams();
  const slug = params?.slug;

  const dispatch = useDispatch();
  const router = useRouter();

  const { singleMovieDetail, nowstreamingmovies, loading } = useSelector((state) => state.movies);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requiredSeats, setRequiredSeats] = useState(0);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [isTncOpen, setIsTncOpen] = useState(false);
  const [pendingTime, setPendingTime] = useState(null);

  useEffect(() => {
    setIsModalOpen(true);
  }, []);

  const handleSelectionConfirm = (count) => {
    setRequiredSeats(count);
    setIsModalOpen(false);
  };

  const [isOpen, setOpen] = useState(false);
  const [recIsBeginning, setRecIsBeginning] = useState(true);
  const [recIsEnd, setRecIsEnd] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null); // Track active date
  const [showSticky, setShowSticky] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);

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

  //   useEffect(() => {
  //     if (daysToShow.length > 0 && !selectedDate) setSelectedDate(daysToShow[0].fullDate);
  //     const movieData = streamingItems.Items.find((item) => item.id === Number(id));
  //     if (movieData) setMovie(movieData);
  //   }, [slug, daysToShow]);

  useEffect(() => {
    if (slug) {
      dispatch(fetchSingleMovieDetail(slug));
    }
  }, [slug]);

  useEffect(() => {
    if (!nowstreamingmovies?.length) {
      dispatch(fetchMovies({ is_now_streaming: 1 }));
    }
  }, []);

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

  const recommendations = useMemo(() => {
    return nowstreamingmovies
      .filter((m) => m.slug !== slug)
      .slice(0, 10);
  }, [nowstreamingmovies, slug]);

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

  //   useEffect(() => {
  //     if (selectedDate) {
  //         const fetchAvailableTimes = async () => {
  //             const res = await dispatch(fetchAvailableShowtimes({ movie_id: singleMovieDetail?.id, date: selectedDate })).unwrap();
  //             setAvailableTimes(res.data || []);
  //         };
  //         fetchAvailableTimes();
  //     }
  //   }, [selectedDate]);

  useEffect(() => {
    if (!selectedDate || !singleMovieDetail?.id) return;

    const fetchTimes = async () => {
      try {
        const res = await dispatch(
          fetchAvailableShowtimes({
            movie_id: singleMovieDetail.id,
            date: selectedDate,
          }),
        ).unwrap();
        setSelectedTime(null);
        setAvailableTimes(res?.shows || []);
      } catch (err) {
        console.error("Error fetching times:", err);
        setAvailableTimes([]);
      }
    };

    fetchTimes();
  }, [selectedDate, singleMovieDetail?.id]);

  useEffect(() => {
    if (!selectedTime) return;
    const fetchScreen = async () => {
      try {
        const res = await dispatch(fetchSeatOfShowtime(selectedTime));
        if (fetchSeatOfShowtime.fulfilled.match(res)) {
          setRows(transformSeatsToRows(res.payload));
        } else {
          toast.error(
            res.payload ||
              res.payload?.message ||
              "Something went wrong, please try later.",
          );
        }
      } catch (err) {
        console.error("Error fetching times:", err);
        setRows([]);
      }
    };
    fetchScreen();
  }, [selectedDate, singleMovieDetail?.id, selectedTime]);

  const [rows, setRows] = useState([]);

  function transformSeatsToRows(apiData) {
    if (!apiData?.classes) return [];
    const result = [];

    apiData.classes.forEach((cls, classIdx) => {
      const seatsByRow = {};
      cls.seats.forEach((seat) => {
        if (!seatsByRow[seat.row_label]) seatsByRow[seat.row_label] = [];
        seatsByRow[seat.row_label].push(seat);
      });

      const sortedLabels = Object.keys(seatsByRow).sort(
        (a, b) => seatsByRow[a][0].row_num - seatsByRow[b][0].row_num,
      );

      sortedLabels.forEach((label, rowIdx) => {
        const seats = seatsByRow[label].sort(
          (a, b) => a.colum_num - b.colum_num,
        );
        result.push({
          label,
          price: cls.price,
          payablePrice: cls.payable_price,
          category: cls.class_name,
          classId: cls.id,
          classIndex: classIdx,
          isFirstInClass: rowIdx === 0,
          seats: seats.map((seat) => {
            if (seat.status === 1) return "gap";
            const isAvailable =
              seat.is_booked === 0 &&
              seat.is_hold === 0 &&
              seat.in_quota === 1 &&
              seat.quota?.id === 3 &&
              seat.in_freeze === 0;
            return isAvailable ? "available" : "booked";
          }),
          seatNumbers: seats.map((seat) => seat.seat_number),
          seatIds: seats.map((seat) => seat.id),
          seatPricing: seats.map((seat) => ({
            screen_seat_id: seat.screen_seat_id ?? seat.id,
            price: cls.price,
            base_amount: cls.base_amount,
            payable_price: cls.payable_price,
            cgst_percentage: cls.cgst_percentage,
            sgst_percentage: cls.sgst_percentage,
            cgst_amount: cls.cgst_amount,
            sgst_amount: cls.sgst_amount,
            service_charge: cls.service_charge,
            service_charge_admit_amount: cls.service_charge_admit_amount,
            cgst_service_percentage: cls.cgst_service_percentage,
            sgst_service_percentage: cls.sgst_service_percentage,
            cgst_service_amount: cls.cgst_service_amount,
            sgst_service_amount: cls.sgst_service_amount,
            cgst_rebate_amount: cls.cgst_rebate_amount ?? 0,
            sgst_rebate_amount: cls.sgst_rebate_amount ?? 0,
            cgst_service_rebate_amount: cls.cgst_service_rebate_amount ?? 0,
            sgst_service_rebate_amount: cls.sgst_service_rebate_amount ?? 0,
            glass_3d_charge: cls.glass_3d_charge ?? 0,
            glass_3d_admit_amount: cls.glass_3d_admit_amount ?? 0,
            cgst_glass_amount: cls.cgst_glass_amount ?? 0,
            sgst_glass_amount: cls.sgst_glass_amount ?? 0,
          })),
        });
      });

      if (classIdx < apiData.classes.length - 1) {
        result.push({ label: "-", isAisle: true });
      }
    });    
    return result;
  }

  const selectedSeatsData = useMemo(() => {
    const selected = [];
    rows.forEach((row) => {      
      if (row.isAisle) return;
      row.seats.forEach((status, idx) => {
        if (status === "selected") {
          selected.push({
            rowLabel: row.label,
            seatNumber: row.seatNumbers[idx],
            seatId: row.seatIds[idx],
            price: row.payablePrice,
            category: row.category,
            pricing: row.seatPricing?.[idx] ?? null,
          });
        }
      });
    });
    return {
      seats: selected,
      totalPrice: selected.reduce((sum, s) => sum + s.price, 0),
      count: selected.length,
    };
  }, [rows]);

  const handleSeatClick = (rIdx, sIdx) => {
    const row = rows[rIdx];
    const status = row?.seats[sIdx];
    if (!status || status === "gap" || status === "booked") return;

    const isSelecting = status === "available";
    if (
      isSelecting &&
      requiredSeats > 0 &&
      selectedSeatsData.count >= requiredSeats
    ) {
      toast.error(
        `You can only select ${requiredSeats} seat${requiredSeats > 1 ? "s" : ""}`,
      );
      return;
    }

    setRows((prev) =>
      prev.map((r, ri) => {
        if (ri !== rIdx) return r;
        const newSeats = [...r.seats];
        newSeats[sIdx] = isSelecting ? "selected" : "available";
        return { ...r, seats: newSeats };
      }),
    );
  };

  const canvasRef = useRef(null);
  const seatMapRef = useRef(null);
  const SS = 25; // seat size (square)
  const SG = 4; // gap between seats
  const LW = 32; // row label column width
  const RH = SS + 10; // row height (seat + vertical padding)
  const CAT_H = 46;
  const AISLE_H = 20;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !rows.length) return;
    const ctx = canvas.getContext("2d");
    const validRows = rows.filter((r) => !r.isAisle);
    const maxCols = validRows.length
      ? Math.max(...validRows.map((r) => r.seats.length))
      : 0;
    if (!maxCols) return;

    const dpr = window.devicePixelRatio || 1;
    const cssW = LW + maxCols * (SS + SG) + LW;
    let cssH = 10;
    rows.forEach((row) => {
      if (row.isFirstInClass) cssH += CAT_H;
      cssH += row.isAisle ? AISLE_H : RH;
    });

    canvas.width = cssW * dpr;
    canvas.height = cssH * dpr;
    canvas.style.width = cssW + "px";
    canvas.style.height = cssH + "px";
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, cssW, cssH);

    const rr = (x, y, w, h, r) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    };

    let y = 0;
    rows.forEach((row) => {
      // Category header
      if (row.isFirstInClass) {
        const accent = row.classIndex === 0 ? "#d4a017" : "#31d7f9";
        const lineC =
          row.classIndex === 0
            ? "rgba(212,160,23,0.3)"
            : "rgba(49,215,249,0.3)";
        const text = `${row.category?.toUpperCase() ?? ""} — ₹${row.price}`;
        ctx.font = "bold 10px sans-serif";
        const tw = ctx.measureText(text).width;
        const tx = cssW / 2,
          ty = y + CAT_H / 2 + 4;
        ctx.strokeStyle = lineC;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(LW, ty - 4);
        ctx.lineTo(tx - tw / 2 - 8, ty - 4);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(tx + tw / 2 + 8, ty - 4);
        ctx.lineTo(cssW - LW, ty - 4);
        ctx.stroke();
        ctx.fillStyle = accent;
        ctx.textAlign = "center";
        ctx.fillText(text, tx, ty);
        y += CAT_H;
      }

      if (row.isAisle) {
        y += AISLE_H;
        return;
      }

      // Row label (left)
      ctx.font = "bold 11px sans-serif";
      ctx.fillStyle = "#9ca3af";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(row.label, LW / 2, y + RH / 2);

      // Seats
      row.seats.forEach((status, sIdx) => {
        if (status === "gap") return;
        const sx = LW + sIdx * (SS + SG);
        const sy = y + (RH - SS) / 2; // vertically center in row

        // Box colors
        const isSelected = status === "selected";
        const isBooked = status === "booked";
        ctx.fillStyle = isSelected
          ? "#31d7f9"
          : isBooked
            ? "#1e2330"
            : "rgba(255,255,255,0.06)";
        ctx.strokeStyle = isSelected
          ? "#31d7f9"
          : isBooked
            ? "#374151"
            : "rgba(255,255,255,0.45)";
        ctx.lineWidth = 1.2;
        rr(sx, sy, SS, SS, 5);
        ctx.fill();
        ctx.stroke();

        // Seat number centered inside box
        const num = String(row.seatNumbers?.[sIdx] ?? sIdx + 1);
        ctx.font = "bold 10px sans-serif";
        ctx.fillStyle = isSelected
          ? "#0b0d12"
          : isBooked
            ? "rgba(255,255,255,0.25)"
            : "rgba(255,255,255,0.8)";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(num, sx + SS / 2, sy + SS / 2);
      });

      y += RH;
    });
  }, [rows]);

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    let y = 0;
    rows.forEach((row, rIdx) => {
      if (row.isFirstInClass) y += CAT_H;
      if (row.isAisle) {
        y += AISLE_H;
        return;
      }
      const sy = y + (RH - SS) / 2;
      if (my >= sy && my <= sy + SS) {
        row.seats.forEach((_, sIdx) => {
          const sx = LW + sIdx * (SS + SG);
          if (mx >= sx && mx <= sx + SS) handleSeatClick(rIdx, sIdx);
        });
      }
      y += RH;
    });
  };

  const handleProceedBooking = async (data) => {
    
    const seats = [];
    data.seats.forEach((seat) => {
      
      seats.push({
        screen_seat_id: seat.pricing.screen_seat_id,
        price: seat.pricing.price,
        base_amount: seat.pricing.base_amount,
        payable_price: seat.pricing.payable_price,
        cgst_percentage: seat.pricing.cgst_percentage,
        sgst_percentage: seat.pricing.sgst_percentage,
        cgst_amount: seat.pricing.cgst_amount,
        sgst_amount: seat.pricing.sgst_amount,
        service_charge: seat.pricing.service_charge,
        service_charge_admit_amount: seat.pricing.service_charge_admit_amount,
        cgst_service_percentage: seat.pricing.cgst_service_percentage,
        sgst_service_percentage: seat.pricing.sgst_service_percentage,
        cgst_service_amount: seat.pricing.cgst_service_amount,
        sgst_service_amount: seat.pricing.sgst_service_amount,
        cgst_rebate_amount: seat.pricing.cgst_rebate_amount,
        sgst_rebate_amount: seat.pricing.sgst_rebate_amount,
        cgst_service_rebate_amount: seat.pricing.cgst_service_rebate_amount,
        sgst_service_rebate_amount: seat.pricing.sgst_service_rebate_amount,
      });
    });
    const dataToSubmit = {
      screen_assign_id: selectedTime,
      seats,
    };
    // console.log('dataToSubmit',dataToSubmit);
    // return;
    
       

    try {
      const res = await dispatch(holdBoxOfficeTicket(dataToSubmit));
      if (holdBoxOfficeTicket.fulfilled.match(res)) {
        const { hold_token, expires_at } = res.payload;
        sessionStorage.setItem(
          "ticket_hold",
          JSON.stringify({
            hold_token,
            expires_at,
          }),
        );
        router.push("/food");
      } else {
        toast.error(res.payload || "Failed to hold seats");
      }
    } catch (error) {
      toast.error("Checkout failed. Please try again.");
    }
  };

  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <ModalVideo
        channel="youtube"
        isOpen={isOpen}
        videoId={(() => {
          const url = singleMovieDetail?.trailer_url;
          if (!url) return "";
          const match = url.match(/(?:v=|youtu\.be\/|embed\/)([^&?/]+)/);
          return match ? match[1] : url;
        })()}
        onClose={() => setOpen(false)}
      />

      {isDetailsOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate__animated animate__fadeIn">
          <div className="bg-[#1c212c] border border-[#d4a01744] w-full max-w-4xl rounded-xl overflow-hidden shadow-2xl animate__animated animate__zoomIn">
            <div className="relative w-full">
              <button
                onClick={() => setIsDetailsOpen(false)}
                className="absolute top-4 right-4 bg-black/50 hover:bg-[#d4a017] text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6 text-white">
              <div className="Title">
                <h2 className="text-3xl font-bold text-white mb-3">Cast</h2>
                <ul className="cast-details mb-3">
                  {singleMovieDetail?.star_casts?.map((castMember, index) => (
                    <li key={index}>
                      <img
                        src={castMember?.image?.thumbnail["200x200"]}
                        alt={castMember.name}
                      />
                      <div className="nameinfo mt-1">
                        <span>{castMember.name}</span>
                        <span className="nameact">{castMember.role_name}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {singleMovieDetail?.crew?.length > 0 && (
                <div className="Title">
                  <h2 className="text-3xl font-bold text-white mb-3">Crew</h2>
                  <ul className="cast-details mb-3">
                    {singleMovieDetail?.crew?.map((crewMember, index) => (
                      <li key={index}>
                        <img
                          src={crewMember?.image?.original}
                          alt={crewMember.name}
                        />
                        <div className="nameinfo mt-1">
                          <span>{crewMember.name}</span>
                          <span className="nameact">
                            {crewMember.role_name}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {isTncOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate__animated animate__fadeIn">
          <div className="bg-[#1c212c] border border-[#31d7f944] w-full max-w-lg rounded-xl overflow-hidden shadow-2xl animate__animated animate__zoomIn">
            <div className="p-6 text-white">
              <h3
                className="text-xl font-bold mb-4"
                style={{ color: "#f28c28" }}
              >
                Terms &amp; Conditions
              </h3>
              <div className="text-sm text-gray-300 overflow-y-auto mb-6">
                <p className="mb-3">
                  By proceeding to book tickets, you agree to the following
                  terms:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Tickets once booked cannot be cancelled or refunded.</li>
                  <li>
                    Please arrive at least 15 minutes before the show time.
                  </li>
                  <li>
                    Outside food and beverages are not permitted inside the
                    cinema.
                  </li>
                  <li>
                    The management reserves the right to refuse entry without
                    refund in case of misconduct.
                  </li>
                  <li>Ticket prices are inclusive of applicable taxes.</li>
                  <li>
                    In case of show cancellation, a full refund will be
                    processed within 5–7 business days.
                  </li>
                </ul>
              </div>
              <div className="d-flex gap-3 justify-content-end">
                <button
                  onClick={() => {
                    setIsTncOpen(false);
                    setPendingTime(null);
                  }}
                  className="btn btn-sm"
                  style={{
                    background: "#374151",
                    color: "#fff",
                    borderRadius: "30px",
                    padding: "8px 24px",
                  }}
                >
                  Decline
                </button>
                <button
                  onClick={() => {
                    setSelectedTime(pendingTime);
                    setPendingTime(null);
                    setIsTncOpen(false);
                    setTimeout(
                      () =>
                        seatMapRef.current?.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        }),
                      100,
                    );
                  }}
                  className="btn btn-sm"
                  style={{
                    background: "#f28c28",
                    color: "#0b0d12",
                    borderRadius: "30px",
                    padding: "8px 24px",
                    fontWeight: 700,
                  }}
                >
                  Accept &amp; Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <section
        className="movie-details-area"
        style={{
          backgroundImage: `url(${"/assets/img/bg/movie_details_bg.jpg"})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container">
          <div className="row align-items-center position-relative">
            <div className="col-xl-3 col-lg-4 col-md-3">
              <div className="movie-details-img">
                <img
                  src={`${singleMovieDetail?.image?.original || singleMovieDetail?.thumbnail || "/assets/img/poster/placeholder.webp"}`}
                  alt={singleMovieDetail?.title}
                />
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
                <h5>
                  {singleMovieDetail?.categories
                    ?.map((cat) => cat.category_name)
                    .join(", ")}
                </h5>
                <h2>{singleMovieDetail?.movie_name}</h2>
                <div className="banner-meta">
                  <ul>
                    <li className="quality">
                      <span>
                        {singleMovieDetail?.movie_types
                          ?.map((t) => t.type_name)
                          .join(", ")}
                      </span>
                      <span>{singleMovieDetail?.rating?.name}</span>
                    </li>
                    <li className="category">
                      <a href="#">{singleMovieDetail?.category}</a>
                    </li>
                    <li className="release-time">
                      {/* <span className="d-flex align-items-center gap-3">
                        <FaCalendarAlt size={14} fill="#F28C28" />{" "}
                        {singleMovieDetail?.year}
                      </span> */}
                      <span className="d-flex align-items-center gap-3">
                        <FaClock size={14} fill="#F28C28" />{" "}
                        {singleMovieDetail?.totalduration
                          ? formatDuration(singleMovieDetail.totalduration)
                          : "N/A"}
                      </span>
                    </li>
                  </ul>
                </div>
                <p>{singleMovieDetail?.description}</p>
                <div className="" id="booktickets">
                  <Link href={`#booktickets`} className="btn mt-3">
                    Book Tickets
                  </Link>
                  {/* <button
                    onClick={() => setIsDetailsOpen(true)}
                    className="btn ml-3 mt-3"
                  >
                    View Details
                  </button> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div
        className="booking-main-wrapper pt-0"
        style={{
          backgroundColor: "#0b0d12",
          color: "#fff",
        }}
      >
        <Script src="https://checkout.razorpay.com/v1/checkout.js" />
        <section
          className="booking-selection-area py-2"
          style={{ background: "#0b0d12", borderBottom: "1px solid #1c212c" }}
        >
          <div className="container">
            <div className="row g-4 align-items-end">
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

        <section
          className="booking-movie-info pt-20 pb-50"
          style={{
            backgroundImage: `url(${
              singleMovieDetail?.background || "/assets/img/bg/episode_bg.jpg"
            })`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
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
              {selectedDate ? (
                <div className="mb-4 col-xl-12">
                  <div className="row gap-4 justify-content-center creative--pill">
                    {availableTimes.length > 0 ? (
                      availableTimes.map((t, i) => (
                        <button
                          key={i}
                          className={`creative-time-pill ${selectedTime === t.screen_assign_id ? "active" : ""}`}
                          onClick={() => {
                            setPendingTime(t.screen_assign_id);
                            setIsTncOpen(true);
                          }}
                        >
                          {convertTo12HourFormat(t.start_time)}{" "}
                        </button>
                      ))
                    ) : (
                      <div className="text-white-50 small p-3 bg-dark rounded text-center">
                        No shows available
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-white-50 small p-3 bg-dark rounded text-center">
                  Please select a date to check available showtimes.
                </div>
              )}
            </div>
          </div>
          <div className="container px-5 mt-5">
            {selectedDate && selectedTime && (
              <div className="row" ref={seatMapRef}>
                {/* RIGHT SEATING MAP: Layout matches screenshot exactly */}
                <div className="col-xl-9 col-lg-8">
                  <div className=" py-10 text-white font-sans">
                    <div className="max-w-4xl mx-auto px-4">
                      {/* Curved Screen */}
                      <div className="relative mb-16 text-center">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-[50px] bg-gradient-to-b from-[#d4a01722] to-transparent blur-xl"></div>
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

                      <div className="flex justify-center gap-8 mb-12 text-xs text-gray-400">
                        {[
                          {
                            label: "Available",
                            fill: "rgba(255,255,255,0.08)",
                            stroke: "rgba(255,255,255,0.55)",
                          },
                          { label: "Booked", fill: "#2a2a2a", stroke: "#444" },
                          {
                            label: "Selected",
                            fill: "#31d7f9",
                            stroke: "#31d7f9",
                          },
                        ].map(({ label, fill, stroke }) => (
                          <div key={label} className="flex items-center gap-2">
                            <div
                              style={{
                                width: 22,
                                height: 22,
                                background: fill,
                                border: `1px solid ${stroke}`,
                                borderRadius: 3,
                                flexShrink: 0,
                              }}
                            />
                            {label}
                          </div>
                        ))}
                      </div>

                      <div className="overflow-x-auto pb-10">
                        <canvas
                          ref={canvasRef}
                          onClick={handleCanvasClick}
                          style={{
                            display: "block",
                            margin: "0 auto",
                            cursor: "pointer",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* LEFT SIDEBAR */}
                <div className="col-xl-3 col-lg-4">
                  <div className="booking-summary-sidebar">
                    <h6 className="text-white mb-3">Your Selected Seats</h6>

                    {/* Category-wise breakdown */}
                    <div className="category-breakdown mb-3">
                      {(() => {
                        const catMap = {};
                        selectedSeatsData.seats.forEach((s) => {
                          if (!catMap[s.category])
                            catMap[s.category] = { count: 0, price: s.price };
                          catMap[s.category].count += 1;
                        });
                        return (
                          Object.keys(catMap).length > 0 &&
                          Object.entries(catMap).map(
                            ([cat, { count, price }]) => (
                              <div
                                key={cat}
                                className="d-flex justify-content-between align-items-center mb-1"
                              >
                                <span
                                  style={{ fontSize: "13px", color: "#31d7f9" }}
                                >
                                  {capitalizeName(cat)}
                                </span>
                                <span
                                  className="badge"
                                  style={{
                                    background: "#1c212c",
                                    border: "1px solid #333",
                                  }}
                                >
                                  {count} {count > 1 ? "Seats" : "Seat"} × ₹
                                  {price}
                                </span>
                              </div>
                            ),
                          )
                        );
                      })()}
                    </div>

                    {/* Individual seat tags */}
                    <div
                      className="seat-tags-container mb-3"
                      style={{ minHeight: "40px" }}
                    >
                      {selectedSeatsData.seats.length > 0 ? (
                        <div className="d-flex flex-wrap gap-2">
                          {selectedSeatsData.seats.map((s) => (
                            <span
                              key={s.seatId}
                              style={{
                                background: "#1c212c",
                                color: "#31d7f9",
                                padding: "4px 10px",
                                borderRadius: "4px",
                                fontSize: "12px",
                                border: "1px solid #31d7f9",
                              }}
                            >
                              {s.rowLabel}
                              {s.seatNumber}
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
                        src={`${singleMovieDetail?.image?.original || singleMovieDetail?.thumbnail || "/assets/img/poster/placeholder.webp"}`}
                        alt={singleMovieDetail?.title}
                        style={{ borderRadius: "4px", objectFit: "cover" }}
                      />
                    </div>

                    {/* Price summary */}
                    <div className="price-breakdown mt-3">
                      {/* <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">Total ticket price</span>
                        <span className="text-white">₹ {selectedSeatsData.totalPrice.toFixed(2)}</span>
                      </div> */}
                      <div className="d-flex justify-content-between align-items-center mt-3">
                        <h4 className="mb-0 text-white">Total price</h4>
                        <h4 className="mb-0" style={{ color: "#31d7f9" }}>
                          ₹ {selectedSeatsData.totalPrice.toFixed(2)}/-
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
                    {selectedSeatsData.seats.length > 0 && (
                      <button
                        onClick={() => handleProceedBooking(selectedSeatsData)}
                        className="btn w-100 mt-3 py-3 text-uppercase fw-bold"
                        style={{ borderRadius: "30px" }}
                      >
                        Proceed
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
      <section
        className="tv-series-area tv-series-bg"
        style={{
          backgroundImage: `url(${"/assets/img/bg/tv_series_bg02.jpg"})`,
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
                {!recIsBeginning && (
                  <button className="rec-prev nav-btn-circle">
                    <FaChevronLeft />
                  </button>
                )}
                {!recIsEnd && (
                  <button className="rec-next nav-btn-circle">
                    <FaChevronRight />
                  </button>
                )}
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
              onSwiper={(swiper) => {
                setRecIsBeginning(swiper.isBeginning);
                setRecIsEnd(swiper.isEnd);
              }}
              onSlideChange={(swiper) => {
                setRecIsBeginning(swiper.isBeginning);
                setRecIsEnd(swiper.isEnd);
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
                      <Link href={`/movie/${item.slug}`}>
                        <img
                          src={
                            item.image?.thumbnail?.["317x422"] ||
                            item.image?.original ||
                            "/assets/img/poster/placeholder.webp"
                          }
                          alt={item.movie_name}
                        />
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
                            href={`/movie/${item.slug}`}
                            className="text-white text-decoration-none"
                          >
                            {item.movie_name}
                          </Link>
                        </h5>
                        <Link href={`/movie/${item.slug}`} className="btn btn-sm">
                          <span className="year" style={{ color: "#e2d191" }}>
                            Book Now
                          </span>
                        </Link>
                      </div>
                      <div
                        className="bottom"
                        style={{ fontSize: "12px", color: "#5b616e" }}>
                        <ul>
                          <li>
                            <span className="quality">
                              {item.movie_type?.map((t) => t.type_name).join(", ")}
                            </span>
                          </li>
                          <li className="gap-4">
                            <span className="language">
                              {item.language?.map((l) => l.language_name).join(", ")}
                            </span>
                            <span className="duration d-flex align-items-center gap-1">
                              <FaClock size={14} fill="#F28C28" />{" "}
                              {item.totalduration ? formatDuration(item.totalduration) : ""}
                            </span>
                            {/* <span className="rating d-flex align-items-center gap-1">
                              <FaThumbsUp size={14} fill="#F28C28" />{" "}
                              {item.rating?.name}
                            </span> */}
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
                src={`${singleMovieDetail?.thumbnail || singleMovieDetail?.image?.original || "/assets/img/poster/placeholder.webp"}`}
                alt={singleMovieDetail?.title}
                style={{
                  width: "40px",
                  height: "60px",
                  borderRadius: "4px",
                  objectFit: "cover",
                }}
              />
              <div>
                <h6 className="text-white mb-0">
                  {singleMovieDetail?.movie_name}
                </h6>
                <small style={{ color: "#e2d191" }}>
                  {singleMovieDetail?.categories
                    ?.map((cat) => cat.category_name)
                    .join(", ")}
                </small>
              </div>
            </div>

            {selectedSeatsData.seats.length > 0 && (
              <button
                onClick={() => handleProceedBooking(selectedSeatsData)}
                className="btn w-100 mt-3 py-3 text-uppercase fw-bold"
                style={{ borderRadius: "30px" }}
              >
                Proceed
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}