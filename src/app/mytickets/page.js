'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { FaUserCircle,FaHome, FaUserAlt, FaBookmark, FaPowerOff, FaHistory, FaTicketAlt, FaStar, FaUser } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { useLogoutConfirm } from '@/app/components/LogoutConfirmModal';
import { getBookedTickets } from '@/store/boxOfficeSlice';
import { changeDateFormat } from '@/utils/helper';
import { useAuth } from '@/hooks/useAuth';
import Image from 'next/image';


const Dashboard = () => {
    const user = useAuth();
    const dispatch = useDispatch();
    const [bookedTickets, setBookedTickets] = useState([]);
    const showLogoutConfirm = useLogoutConfirm();

    useEffect(() => {
        const fetchTickets = async () => {
          try {
            const tickets = await dispatch(getBookedTickets()).unwrap();
            setBookedTickets(tickets);
          } catch (error) {
            console.error('Error fetching booked tickets:', error);
          }
        };
        fetchTickets();
    }, [dispatch]);
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
                                      <p>Here's a quick overview of your account and activities.</p>
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
                    <div className="col-xl-9 col-lg-9 col-md-12 dashboard__content_box">
                        <div className="dashboard__content__wraper p-3 px-4 mt-2">
                            <h4>Recent Orders</h4>
                        </div>
                        <div className="row">
                            <div className="col-xl-12 col-lg-12 col-md-12 col-12 pb-3">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                    <tr className="text-[10px] uppercase tracking-[0.2em] text-dark border-b border-white/5 bg-[#dddddd]">
                                        <th className="p-6 font-medium">Movie / Language</th>
                                        <th className="p-6 font-medium">Show Details</th>
                                        <th className="p-6 font-medium">Tickets</th>
                                        <th className="p-6 font-medium text-right">Status</th>
                                        <th className="p-6 font-medium text-right">Action</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                    {bookedTickets.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="p-6 text-center text-gray-500 text-sm">No tickets booked yet.</td>
                                        </tr>
                                    ) : (
                                        bookedTickets.map((ticket) => {
                                            const show = ticket.screen_assign;
                                            const formatTime = (t) => {
                                                const [h, m] = t.split(':');
                                                const hour = parseInt(h);
                                                return `${hour % 12 || 12}:${m} ${hour >= 12 ? 'PM' : 'AM'}`;
                                            };
                                            return (
                                                <tr key={ticket.id} className="group hover:bg-white/[0.02] transition-colors">
                                                    <td className="p-3" data-label="Movie / Language">
                                                        <p className="font-bold text-sm uppercase">{show.movie.movie_name}</p>
                                                        <p className="text-[9px] text-cyan-500 font-bold uppercase mt-1">{show.language.language_name}</p>
                                                    </td>
                                                    <td className="p-3" data-label="Show Details">
                                                        <p className="text-xs font-medium">{show.date ? changeDateFormat(show.date,'dd MMM yyyy') : ''}</p>
                                                        <p className="text-[10px] text-gray-500 mt-1">{formatTime(show.start_time)} – {formatTime(show.end_time)}</p>
                                                        <p className="text-[10px] text-gray-400">{show.screen_name}</p>
                                                    </td>
                                                    <td className="p-3" data-label="Tickets">
                                                        <div className="flex items-center gap-2 Tickets__count">
                                                            <FaTicketAlt className="text-gray-600" size={12} />
                                                            <span className="text-sm font-medium">{String(ticket.ticket_count).padStart(2, '0')}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-3 text-right" data-label="Status">
                                                        {ticket.is_show_ended ? (
                                                            <span className="text-[10px] font-bold uppercase text-gray-500 border border-gray-700 px-2 py-1 rounded">Ended</span>
                                                        ) : (
                                                            <span className="text-[10px] font-bold uppercase text-green-400 border border-green-700 px-2 py-1 rounded">Upcoming</span>
                                                        )}
                                                    </td>
                                                    <td className="p-3 text-right" data-label="Action">
                                                        <Link href={`/mytickets/${ticket.id}`} className="text-[10px] font-bold uppercase text-white bg-orange-500 hover:bg-orange-600 px-3 py-1.5 rounded transition-colors bg-gradient-to-r from-orange-500 to-pink-500">
                                                            View
                                                        </Link>
                                                    </td>
                                                </tr>
                                            );
                                        })
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
};

export default Dashboard;