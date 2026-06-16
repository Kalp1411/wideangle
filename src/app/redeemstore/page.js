'use client';
import { useAuth } from '@/hooks/useAuth';
import { fetchAvailablePerks } from '@/store/dashboardSlice';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaUserCircle, FaHome, FaUserAlt, FaPowerOff, FaStar, FaBookmark, FaPencilAlt, FaHistory, FaTicketAlt, FaCreditCard, FaGlobe, FaMobileAlt, FaUser } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { useLogoutConfirm } from '../components/LogoutConfirmModal';
import Image from 'next/image';

const redeemstore = () => {
  // Mock data - in a real app, these would be props
  const user = useAuth();
 const dispatch = useDispatch();
 const [perks, setPerks] = useState([]);
 const [searchQuery, setSearchQuery] = useState('');
 const [visibleCount, setVisibleCount] = useState(12);
 const showLogoutConfirm = useLogoutConfirm();
 

 const filteredPerks = perks.filter((perk) =>
   perk.perk_name?.toLowerCase().includes(searchQuery.toLowerCase())
 );
 const visiblePerks = filteredPerks.slice(0, visibleCount);
 const hasMore = filteredPerks.length > visibleCount;

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await dispatch(fetchAvailablePerks());
        if(fetchAvailablePerks.fulfilled.match(res)) {
          setPerks(res.payload || []);
        }
        else{
            toast.error(res.payload || 'Failed to fetch perks');
            console.error('Failed to fetch perks:', res.payload);
        }
      } catch (error) {
        toast.error('An error occurred while fetching perks');
        console.error('Error fetching perks:', error);
      }
    };
    getData();
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
                        className="d-flex align-items-center gap-2"
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
                        <div id="store" className="section section-alt store-area">
                            <div className="container">
                                <div className="text-center" >
                                    <span className="sec-label">Redeem Store</span>
                                    <h2 className="sec-title">Spend Your Points</h2>
                                    <p className="sec-sub" >Browse hundreds of rewards from top brands — discounts, freebies, and exclusive offers.</p>
                                </div>

                                <div className="store-search-row">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" ><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={searchQuery}
                                        onChange={(e) => {
                                            setSearchQuery(e.target.value);
                                            setVisibleCount(12);
                                        }}
                                    />
                                </div>

                                <div className="store-grid">
                                    {visiblePerks.map((perk) => (
                                        <div className="store-card" key={perk.id}>
                                        <Link href={`/redeemdetail/${perk.id}`} className="sl-starbucks">
                                        <div className="store-logo">
                                            <img src={perk.perk_logo || "/assets/img/logo/logo.png"} alt={perk.name} />
                                        </div>
                                        <div className="store-card-name">{perk.perk_name}</div>
                                        <div className="store-card-pts">{perk.point_cost || 0} points</div>
                                        </Link>
                                    </div>
                                    ))}
                                    {filteredPerks.length === 0 && (
                                        <p className="text-center text-gray-400 col-span-full">No results found.</p>
                                    )}
                                </div>

                                {hasMore && (
                                    <div className="store-load">
                                        <button className="btn btn-orange" onClick={() => setVisibleCount((c) => c + 12)}>Load More</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
  );
};




export default redeemstore;