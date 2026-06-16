import Link from 'next/link';
import { FaUserCircle, FaHome, FaUserAlt, FaPowerOff, FaStar, FaBookmark, FaPencilAlt, FaHistory, FaTicketAlt, FaCreditCard, FaGlobe, FaMobileAlt } from 'react-icons/fa';

const Quickpay = () => {
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
                                            <Link href="/quickpay" className="active d-flex align-items-center justify-cotent-center">
                                                <FaCreditCard className="mr-2" size={16} />
                                                Quick Pay</Link>
                                        </li>
                                        <li>
                                            <Link href="/quickpay" className="d-flex align-items-center justify-cotent-center">
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
                        <div className="row gap-4 p-3 justify-content-between">
                            <div className="card__box">
                                <div className="cc__card__wraper p-4 ">
                                    <div className="cc__card_box flex justify-content-between align-items-center">
                                    <h4>CC/Debit Card</h4>
                                    <Link href="#" className="btn d-flex items-center justify-center gap-2">+ Add</Link>
                                    </div>
                                    <div className="cc__card_info">
                                        You do not have any Credit/Debit cards added to QuikPay
                                    </div>
                                </div>
                            </div>
                            <div className="card__box">
                                <div className="cc__card__wraper p-4 ">
                                    <div className="cc__card_box flex justify-content-between align-items-center">
                                    <h4>NetBanking</h4>
                                    <Link href="#" className="btn d-flex items-center justify-center gap-2">+ Add</Link>
                                    </div>
                                    <div className="cc__card_info">
                                        You do not have any NetBanking options added to QuikPay
                                    </div>
                                </div>
                            </div>
                            <div className="card__box">
                                <div className="cc__card__wraper p-4 ">
                                    <div className="cc__card_box flex justify-content-between align-items-center">
                                    <h4>Gift Voucher</h4>
                                    <Link href="#" className="btn d-flex items-center justify-center gap-2">+ Add</Link>
                                    </div>
                                    <div className="cc__card_info">
                                        You do not have any GiftVouchers added to QuikPay
                                    </div>
                                </div>
                            </div>
                            <div className="card__box">
                                <div className="cc__card__wraper p-4 ">
                                    <div className="cc__card_box flex justify-content-between align-items-center">
                                    <h4>UPI</h4>
                                    <Link href="#" className="btn d-flex items-center justify-center gap-2">+ Add</Link>
                                    </div>
                                    <div className="cc__card_info">
                                        You do not have any UPI account added to QuikPay
                                    </div>
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




export default Quickpay;