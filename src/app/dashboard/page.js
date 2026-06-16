"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  FaHome,
  FaPowerOff,
  FaBookmark,
  FaTicketAlt,
  FaCamera,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaPlus,
  FaTimes,
  FaTrash,
  FaCheck,
  FaEdit,
  FaVenus,
  FaMars,
  FaHeart,
  FaMobileAlt,
  FaStar,
  FaTag,
  FaArrowRight,
  FaGift,
  FaTickets,
  FaUser,
} from "react-icons/fa";
import { useLogoutConfirm } from "@/app/components/LogoutConfirmModal";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { fetchDashboardData } from "@/store/dashboardSlice";
import { toast } from "sonner";
export default function Dashboard() {
  const user = useAuth();
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const showLogoutConfirm = useLogoutConfirm();
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const getDashboardData = async () => {
      try {
        const res = await dispatch(fetchDashboardData());
        if (fetchDashboardData.fulfilled.match(res)) {
          console.log("Dashboard data fetched successfully:", res.payload);
          setDashboardData(res.payload);
        }
      } catch (error) {
        toast.error("Failed to load dashboard data: " + error);
      }
    };
    getDashboardData();
  }, [dispatch, user]);

  // Transform summary data into cards format
  const summaryCards = dashboardData?.summary
    ? [
        {
          key: "tickets",
          icon: FaTicketAlt,
          label: "Total Tickets",
          value: dashboardData.summary.total_ticket_count,
          cardBg: "#ff6b35",
        },
        {
          key: "rewards",
          icon: FaStar,
          label: "Reward Points",
          value: dashboardData.summary.total_reward_points,
          cardBg: "#f7b801",
        },
        {
          key: "vouchers",
          icon: FaGift,
          label: "Active Vouchers",
          value: dashboardData.summary.active_voucher_count,
          cardBg: "#00d4ff",
        },
      ]
    : [];

  // Format date helper
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format time helper
  const formatTime = (timeString) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    return `${hours}:${minutes}`;
  };

  return (
    <>
      {/* ── Dashboard banner ────────────────────────────────── */}
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

      {/* ── Main layout ─────────────────────────────────────── */}
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
                        className="active d-flex align-items-center justify-cotent-center"
                        href="/dashboard"
                      >
                        <FaHome className="mr-2" size={16} />
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/editprofile"
                        className=" d-flex align-items-center gap-2"
                      >
                        <FaUser size={15} /> Profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/mytickets"
                        className="d-flex align-items-center gap-2"
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

            {/* ── Dashboard content ────────────────────────── */}
            <div className="col-xl-9 col-lg-9 col-md-12 dashboard__content_box">
              {/* Stats overview */}
              <div className="db-overview">
                <div className="db-ov-left">
                  <p className="db-ov-hi">Hi, {user?.name}!</p>
                  <h3 className="db-ov-headline">
                    You have booked
                    <br />
                    <span>
                      {dashboardData?.summary?.this_year_ticket_count || 0}{" "}
                      tickets
                    </span>{" "}
                    this year!
                  </h3>
                  <Link href="/mytickets" className="db-ov-cta">
                    SEE ALL <FaArrowRight size={11} />
                  </Link>
                </div>
                <div className="db-ov-right">
                  {summaryCards.map(
                    ({ key, icon: Icon, label, value, cardBg }, i) => (
                      <div
                        key={key}
                        className="db-ov-card"
                        style={{ "--crd-bg": cardBg }}
                      >
                        <div className="db-ov-card-top">
                          <span className="db-ov-num">0{i + 1}</span>
                        </div>
                        <div className="db-ov-icon">
                          <Icon size={24} />
                        </div>
                        <p className="db-ov-label">{label}</p>
                        <p className="db-ov-sub">{value}</p>
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* Recent Tickets */}
              <div className="prof-card db-tickets-card">
                <div className="prof-card-head">
                  <h5 className="prof-card-title">
                    <FaTicketAlt size={14} style={{ marginRight: 7 }} />
                    Recent Tickets
                  </h5>
                  <Link href="/mytickets" className="db-view-all">
                    View All <FaArrowRight size={11} />
                  </Link>
                </div>
                <div className="db-table-wrap">
                  <table className="db-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Movie / Event</th>
                        <th>Date & Time</th>
                        <th>Tickets</th>
                        <th>Screen</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData?.recent_bookings &&
                      dashboardData.recent_bookings.length > 0 ? (
                        dashboardData.recent_bookings.map((booking, i) => (
                          <tr key={booking.id}>
                            <td className="db-td-num">{i + 1}</td>
                            <td className="db-td-movie">
                              {booking.screen_assign?.movie?.movie_name ||
                                "N/A"}
                            </td>
                            <td className="db-td-date">
                              {formatDate(booking.screen_assign?.date)}{" "}
                              {formatTime(booking.screen_assign?.start_time)}
                            </td>
                            <td className="db-td-seats">
                              {booking.ticket_count}
                            </td>
                            <td className="db-td-screen">
                              {booking.screen_assign?.screen_name || "N/A"}
                            </td>
                            <td>
                              <span
                                className={`db-badge db-badge--${
                                  booking.is_show_ended ? "completed" : "active"
                                }`}
                              >
                                {booking.is_show_ended ? "Completed" : "Active"}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="6"
                            style={{ textAlign: "center", padding: "20px" }}
                          >
                            No recent bookings
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}