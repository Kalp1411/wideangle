"use client";
import Link from "next/link";
import {
  FaHome,
  FaUserAlt,
  FaPowerOff,
  FaStar,
  FaBookmark,
  FaTicketAlt,
  FaUser,
} from "react-icons/fa";
import VoucherTabs from "./VoucherTabs";
import { useLogoutConfirm } from "../components/LogoutConfirmModal";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";

const myvouchers = () => {
  const user = useAuth();
  const showLogoutConfirm = useLogoutConfirm();

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
                        className="active d-flex align-items-center justify-cotent-center"
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
            <div className="col-xl-9 col-lg-9 col-md-12 dashboard__content_box">
              <div id="vouchers" className="section vouchers-area">
                <div className="container">
                  <div className="text-center">
                    <span className="sec-label">My Vouchers</span>
                    <h2 className="sec-title">Redeemed Rewards</h2>
                  </div>

                  <VoucherTabs />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default myvouchers;