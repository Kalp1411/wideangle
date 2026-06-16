"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FaHome,
  FaUserAlt,
  FaBookmark,
  FaPowerOff,
  FaStar,
  FaTicketAlt,
  FaUtensils,
  FaUser,
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import { getSingleBookedTicket } from "@/store/boxOfficeSlice";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { useLogoutConfirm } from "@/app/components/LogoutConfirmModal";

const formatTime = (t) => {
  const [h, m] = t.split(":");
  const hour = parseInt(h);
  return `${hour % 12 || 12}:${m} ${hour >= 12 ? "PM" : "AM"}`;
};

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const statusBadge = (status, label) => {
  const color =
    status === 1
      ? "text-green-400 border-green-700"
      : "text-yellow-400 border-yellow-700";
  return (
    <span
      className={`text-[10px] font-bold uppercase border px-2 py-1 rounded ${color}`}
    >
      {label}
    </span>
  );
};

const TicketDetailPage = () => {
  const params = useParams();
  const id = params?.id;
  const user = useAuth();
  const dispatch = useDispatch();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const showLogoutConfirm = useLogoutConfirm();

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await dispatch(getSingleBookedTicket(id)).unwrap();
        setBooking(res);
      } catch (error) {
        console.error("Error fetching booking details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [dispatch, id]);

  if (loading) {
    return (
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "60vh" }}
      >
        <p className="text-gray-400">Loading booking details...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "60vh" }}
      >
        <p className="text-gray-400">Booking not found.</p>
      </div>
    );
  }

  const totalFoodAmount = booking.food_bookings.reduce(
    (sum, fb) => sum + fb.total_price,
    0,
  );

  return (
    <>
      <div className="dashboardarea pt-130 bg-[#0a0b0d]">
        <div className="container full__width__padding">
          <div className="row">
            <div className="col-xl-12 pr-0">
              <div className="dashboardarea__wraper">
                <div className="dashboardarea__img">
                  <div className="dashboardarea__inner student__dashboard__inner">
                    <div className="dashboardarea__left">
                      <div className="dashboardarea__left__img">
                        {user?.profile_image?.profile_image ? (
                          <Image
                            src={user.profile_image.profile_image}
                            alt={user?.name || "Avatar"}
                            width={100}
                            height={100}
                            className="object-cover rounded-lg shadow-lg"
                            unoptimized
                          />
                        ) : (
                          <div className="prof-avatar-placeholder border-4">
                            <span>
                              {user?.name
                                ?.split(" ")
                                .map((word) => word[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase() || "KP"}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="dashboardarea__left__content">
                        <h4>Hi, {user?.name}</h4>
                        <p>
                          Here's a quick overview of your account and
                          activities.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard pt-20 pb-80">
        <div className="container">
          <div className="row">
            {/* Sidebar */}
            <div className="col-xl-3 col-lg-3 col-md-12">
              <div className="dashboard__inner p-4">
                <div className="dashboard__nav">
                  <ul>
                    <li>
                      <Link
                        className="d-flex align-items-center justify-cotent-center"
                        href="/dashboard"
                      >
                        <FaHome className="mr-2" size={16} />
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/editprofile"
                        className="d-flex align-items-center gap-2"
                      >
                        <FaUser size={15} /> Profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/mytickets"
                        className="active d-flex align-items-center gap-2"
                      >
                        <FaTicketAlt size={14} /> My Tickets
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/loyaltyprogram"
                        className="d-flex align-items-center justify-cotent-center"
                      >
                        <FaStar className="mr-2" size={16} />
                        Loyalty Program
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        onClick={showLogoutConfirm}
                        className="d-flex align-items-center justify-cotent-center"
                      >
                        <FaPowerOff className="mr-2" size={16} /> Log out
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Main content */}
            <div className="col-xl-9 col-lg-9 col-md-12 dashboard__content_box">
              {/* Booking Summary */}
              <div className="dashboard__content__wraper p-4 mt-2 mb-4">
                <h4 className="mb-4">Booking Summary</h4>
                <div className="row g-3">
                  <div className="col-md-8">
                    <div className="row g-2 text-sm">
                      <div className="col-6">
                        <p className="text-gray-400 text-[11px] uppercase tracking-wider">
                          Booking Code
                        </p>
                        <p className="font-bold text-orange-400">
                          {booking.booking_code}
                        </p>
                      </div>
                      <div className="col-6">
                        <p className="text-gray-400 text-[11px] uppercase tracking-wider">
                          Date & Time
                        </p>
                        <p className="font-medium">
                          {formatDate(booking.date)}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {formatTime(booking.time)}
                        </p>
                      </div>
                      <div className="col-6">
                        <p className="text-gray-400 text-[11px] uppercase tracking-wider">
                          Screen
                        </p>
                        <p className="font-medium">{booking.screen_name}</p>
                      </div>
                      <div className="col-6">
                        <p className="text-gray-400 text-[11px] uppercase tracking-wider">
                          Tickets
                        </p>
                        <p className="font-medium">
                          {booking.ticket_count} ticket(s)
                        </p>
                      </div>
                    </div>

                    {/* Seats */}
                    <div className="mt-4">
                      <p className="text-gray-400 text-[11px] uppercase tracking-wider mb-2">
                        Seats
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {booking.seats.map((seat) => (
                          <div
                            key={seat.screen_seat_id}
                            className="border border-orange-500/40 rounded px-3 py-1.5 text-xs"
                          >
                            <span className="font-bold text-orange-400">
                              {seat.row}
                              {seat.seat_number}
                            </span>
                            <span className="text-gray-400 ml-1">
                              ({seat.class})
                            </span>
                            <span className="text-gray-400 ml-1">
                              ₹{seat.price}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Price Breakdown */}
                    <div className="mt-4 border-t border-white/10 pt-3">
                      <p className="text-gray-400 text-[11px] uppercase tracking-wider mb-2">
                        Price Breakdown
                      </p>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Ticket Total</span>
                          <span>₹{booking.ticket_total.toFixed(2)}</span>
                        </div>
                        {booking.ticket_discount_amount > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Discount</span>
                            <span className="text-green-400">
                              -₹{booking.ticket_discount_amount.toFixed(2)}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-400">Convenience Fee</span>
                          <span>₹{booking.convenience_fee.toFixed(2)}</span>
                        </div>
                        {totalFoodAmount > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">
                              Food & Beverages
                            </span>
                            <span>₹{totalFoodAmount.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between border-t border-white/10 pt-2 font-bold text-orange-400">
                          <span>Grand Total</span>
                          <span>₹{booking.grand_total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="col-md-4 d-flex flex-column align-items-center justify-content-center">
                    <div className="border border-white/10 rounded-xl p-1 text-center bg-white">
                      <img
                        src={booking.qrcode}
                        alt="Booking QR Code"
                        className="w-36 h-36 object-contain mx-auto"
                      />
                    </div>
                    <p className="text-[10px] text-gray-500 mt-2 text-center">
                      Scan at the entrance
                    </p>
                    <p className="text-[11px] font-bold text-orange-400 mt-1">
                      {booking.booking_code}
                    </p>
                  </div>
                </div>
              </div>

              {/* Food Bookings */}
              {booking.food_bookings.length > 0 && (
                <div className="dashboard__content__wraper p-4 mt-2">
                  <h4 className="mb-4 d-flex align-items-center gap-2">
                    <FaUtensils size={16} className="text-orange-400" />
                    Food &amp; Beverages
                  </h4>
                  <div className="row g-3">
                    {booking.food_bookings.map((fb) => (
                      <div key={fb.id} className="col-xl-6 col-lg-6 col-md-12">
                        <div className="border border-white/10 rounded-xl p-3 h-full">
                          <div className="flex justify-between align-items-center mb-2">
                            <div>
                              <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                                {fb.delivery_option_label}
                              </p>
                              <p className="text-[10px] text-gray-500 mt-0.5">
                                {new Date(fb.booked_at).toLocaleString(
                                  "en-GB",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  },
                                )}
                              </p>
                            </div>
                            {statusBadge(fb.status, fb.status_label)}
                          </div>
                          <div className="divide-y divide-white/5">
                            {fb.items.map((item) => (
                              <div
                                key={item.id}
                                className="flex align-items-center gap-3 py-2"
                              >
                                <img
                                  src={item.icon.icon}
                                  alt={item.name}
                                  className="w-9 h-9 object-contain rounded"
                                  onError={(e) => {
                                    e.target.style.display = "none";
                                  }}
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-medium truncate">
                                    {item.name}
                                  </p>
                                  <p className="text-[10px] text-gray-500">
                                    ₹{item.unit_price} × {item.quantity}
                                  </p>
                                </div>
                                <p className="text-xs font-bold text-orange-400 whitespace-nowrap">
                                  ₹{item.total_price}
                                </p>
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-between border-t border-white/10 pt-2 mt-1">
                            <span className="text-xs text-gray-400">
                              Subtotal
                            </span>
                            <span className="text-xs font-bold text-orange-400">
                              ₹{fb.total_price}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TicketDetailPage;