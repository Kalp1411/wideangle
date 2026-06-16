import Link from 'next/link';
import { FaUserCircle, FaHome, FaUserAlt, FaPowerOff, FaStar, FaBookmark, FaPencilAlt, FaHistory, FaTicketAlt, FaCreditCard, FaGlobe, FaMobileAlt } from 'react-icons/fa';

const redeemstore = () => {
  // Mock data - in a real app, these would be props
 

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
                                            <img 
                                                src="/assets/img/images/aboutbg.jpg" // Replace with your poster path
                                                alt="Final Destination Bloodlines" 
                                                className="w-20 h-28 object-cover rounded-lg shadow-lg"
                                                />
                                        </div>
                                        <div className="dashboardarea__left__content">
                                            <h4>Dond Tond, Welcome</h4>
                                        </div>
                                    </div>
                                    <div className="dashboardarea__right">
                                        <div className="dashboardarea__right__button">
                                            <a className="btn" href="#">Download tickets
                                                <FaTicketAlt className="text-gray-600" size={18} /></a>
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
                                            <Link className="d-flex align-items-center justify-cotent-center" href="/dashboard">
                                                <FaHome className="mr-2" size={16} />
                                                Dashboard</Link>
                                        </li>
                                        <li>
                                            <Link href="/profile" className="d-flex align-items-center justify-cotent-center">
                                                <FaUserAlt className="mr-2" size={16} />
                                                My Profile</Link>
                                        </li>
                                        <li>
                                            <Link href="/mytickets" className="d-flex align-items-center justify-cotent-center">
                                                <FaBookmark className="mr-2" size={16} />
                                                My Tickets</Link>
                                        </li>
                                        <li>
                                            <Link href="/loyaltyprogram" className="active d-flex align-items-center justify-cotent-center">
                                                <FaStar className="mr-2" size={16} />
                                                Loyalty Program</Link>
                                        </li>
                                        <li>
                                            <Link href="/mytickets" className="d-flex align-items-center justify-cotent-center">
                                                <FaPowerOff className="mr-2" size={16} />
                                                Log out</Link>
                                        </li>
                                    </ul>
                                </div>
                        </div>
                    </div>
                    <div className="col-xl-9 col-lg-9 col-md-12 dashboard__content_box">
                        <div className="reward-detail-wrap">
                            <div className="rd-card">
                                <div className="rd-banner">☕</div>
                                <div className="rd-body">
                                    <div className="rd-title">Get Free 1 Cup Coffee</div>
                                    <div className="rd-expiry">Offer will be end of May, 30 2026</div>
                                    <div className="rd-prog-track"><div className="rd-prog-fill"></div></div>
                                    <div className="rd-prog-label">3,000 / 3,750 points</div>
                                    <div className="rd-desc">Welcome to Starbucks Loyalty! Earn points with every purchase and unlock delightful rewards. As a valued member, enjoy exclusive perks and freebies tailored just for you.</div>

                                    <div className="rd-stitle">Terms and Conditions:</div>
                                    <ol className="rd-list">
                                        <li>Available to members with a minimum of 3,750 points.</li>
                                        <li>Redeemable once within 30 days.</li>
                                        <li>E-voucher valid for 30 days from redemption.</li>
                                        <li>Complimentary tall-sized coffee of your choice.</li>
                                        <li>Cannot be combined with other promotions.</li>
                                        <li>Non-transferable, for member use only.</li>
                                        <li>E-voucher expires if points are insufficient.</li>
                                    </ol>

                                    <div className="rd-stitle">How to Redeem:</div>
                                    <ol className="rd-list">
                                        <li>Ensure a minimum of 3,750 points in your account.</li>
                                        <li>Access the "Rewards" tab in the EventAddition app.</li>
                                        <li>Select this offer and tap Redeem to claim your voucher.</li>
                                    </ol>

                                    <button className="btn btn-orange btn-full" >Redeem</button>
                                </div>
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