"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  FaHome,
  FaPowerOff,
  FaStar,
  FaTicketAlt,
  FaUser,
} from "react-icons/fa";

import { useLogoutConfirm } from "../components/LogoutConfirmModal";
import { fetchLoyaltyData } from "@/store/dashboardSlice";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";

const LoyaltyProgram = () => {
    const user = useAuth();
  const dispatch = useDispatch();
  const showLogoutConfirm = useLogoutConfirm();

  const [loyaltyData, setLoyaltyData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dispatch(fetchLoyaltyData());

        if (response?.payload?.data) {
          setLoyaltyData(response.payload.data);
        } else if (response?.payload) {
          setLoyaltyData(response.payload);
        }
      } catch (error) {
        console.error("Error fetching loyalty data:", error);
      }
    };

    fetchData();
  }, [dispatch]);

  const currentTier = loyaltyData?.progress?.current || "Silver";
  const nextTier = loyaltyData?.progress?.next || "Gold";
  const progressPercentage =
    loyaltyData?.progress?.progress_percentage || 0;

//       const segmentWidth = 100 / (3 - 1);
//   const currentIndex = loyaltyData?.tiers?.findIndex(
//   (t) => t.tier_name === currentTier
// );

// const fillWidth =
//   currentIndex * segmentWidth +
//   (progressPercentage / 100) * segmentWidth;


  const requiredValue = Number(
    loyaltyData?.progress?.required_value || 0
  );

  const totalSpent = Number(
    loyaltyData?.balance?.total_spent || 0
  );

  const remainingAmount = Math.max(
    requiredValue - totalSpent,
    0
  );

  return (
    <>
      {/* Header */}
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

      {/* Main */}
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
                        className="d-flex align-items-center"
                        href="/dashboard">
                        <FaHome className="mr-2" />
                        Dashboard
                      </Link>
                    </li>

                    <li>
                      <Link
                        href="/editprofile"
                        className="d-flex align-items-center gap-2">
                        <FaUser />
                        Profile
                      </Link>
                    </li>

                    <li>
                      <Link
                        href="/mytickets"
                        className="d-flex align-items-center gap-2">
                        <FaTicketAlt />
                        My Tickets
                      </Link>
                    </li>

                    <li>
                      <Link
                        href="/loyaltyprogram"
                        className="active d-flex align-items-center">
                        <FaStar className="mr-2" />
                        Loyalty Program
                      </Link>
                    </li>

                    <li>
                      <Link
                        href="#"
                        onClick={showLogoutConfirm}
                        className="d-flex align-items-center">
                        <FaPowerOff className="mr-2" />
                        Log out
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="col-xl-9 col-lg-9 col-md-12 dashboard__content_box">
              <div className="hero-loyalty">
                <div className="container">
                  <div className="hero-grid">
                    {/* Balance Card */}
                    <div className="dashboardarea__left">
                      <div className="balance-card">
                        <div className="bc-top-label">
                          Your Balance
                        </div>

                        <div className="bc-pts-row">
                          <div className="bc-num">
                            {loyaltyData?.balance
                              ?.total_available_points || 0}
                          </div>
                          <div className="bc-unit">
                            Points
                          </div>
                        </div>

                        <div className="bc-note">
                          {remainingAmount.toFixed(0) == 0 ? (
                            <strong>You have reached its final stage</strong>
                          ) : (
                            <>
                              <strong>
                                ₹{remainingAmount.toFixed(0)}
                              </strong>{" "}
                              more to reach {nextTier} tier
                            </>
                          )}
                        </div>

                        <div className="bc-progress">
                          <div className="bc-prog-track">
                            <div
                              className="bc-prog-fill"
                              style={{
                                width: `${progressPercentage}%`,
                              }}
                            /></div>
                        </div>

                        <div className="bc-tier-labels">
                          {loyaltyData?.tiers?.map((tier) => (
                            <span
                              key={tier.id}
                              className={`bc-tier-lbl ${
                                tier.tier_name === currentTier
                                  ? "active"
                                  : ""
                              }`}
                            >
                              {tier.tier_name}
                            </span>
                          ))}
                        </div>

                        <div className="bc-actions">
                          <Link
                            href="/redeemstore"
                            className="btn btn-orange"
                          >
                            REDEEM
                          </Link>

                          <Link
                            href="/myvouchers"
                            className="btn btn-outline-o"
                          >
                            MY VOUCHER ›
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Right Panel */}
                    <div className="right-panel">
                      <div className="tier-highlight">
                        <div className="tier-ring-wrap">
                          {currentTier?.charAt(0)}
                        </div>

                        <div>
                          <div className="tier-h-name">
                            {currentTier} Member
                          </div>

                          <div className="tier-h-sub">
                            Total Spent: ₹
                            {loyaltyData?.balance?.total_spent}
                            <br />
                            Tickets Booked:{" "}
                            {
                              loyaltyData?.balance
                                ?.total_tickets
                            }
                            <br />
                            Earned Points:{" "}
                            {
                              loyaltyData?.balance
                                ?.total_earned_points
                            }
                          </div>

                          <div className="tier-h-prog-track">
                            <div
                              className="tier-h-prog-fill"
                              style={{
                                width: `${progressPercentage}%`,
                              }}
                            />
                          </div>

                          <div className="tier-h-note">
                            {remainingAmount.toFixed(0) == 0 ? (
                              <strong>You have reached its final stage</strong>
                            ) : (
                              <>
                                {progressPercentage.toFixed(0)}%
                                to {nextTier} — ₹
                                {remainingAmount.toFixed(0)} remaining
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* History */}
                      <div>
                        <div className="history-head">
                          <h3>History</h3>

                          <a
                            href="#history"
                            className="history-more">
                            More ›
                          </a>
                        </div>

                        <div className="history-list">
                          {loyaltyData?.history?.length >
                          0 ? (
                            loyaltyData.history.map(
                              (item) => (
                                <div
                                  className="hi-item"
                                  key={item.id}
                                >
                                  <span
                                    className={`hi-dot ${
                                      item.type ===
                                      "earn"
                                        ? "hd-earn"
                                        : "hd-rdm"
                                    }`}
                                  />

                                  <div className="hi-info">
                                    <div className="hi-name">
                                      {item.movie_name ||
                                        item.purchase_type}
                                    </div>

                                    <div className="hi-meta">
                                      <span>
                                        {item.date}
                                      </span>

                                      <span>
                                        {item.time}
                                      </span>

                                      {item.ticket_count >
                                        0 && (
                                        <span>
                                          {
                                            item.ticket_count
                                          }{" "}
                                          Tickets
                                        </span>
                                      )}

                                      {item.food_count >
                                        0 && (
                                        <span>
                                          {
                                            item.food_count
                                          }{" "}
                                          Food Items
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  <div
                                    className={`hi-pts ${
                                      item.type ===
                                      "earn"
                                        ? "earn"
                                        : "spend"
                                    }`}
                                  >
                                    {item.points}
                                  </div>
                                </div>
                              )
                            )
                          ) : (
                            <div className="text-center py-3">
                              No loyalty history found.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* End Right Panel */}
                  </div>
                </div>
              </div>
            </div>
            {/* End Content */}
          </div>
        </div>
      </div>
    </>
  );
};

export default LoyaltyProgram;