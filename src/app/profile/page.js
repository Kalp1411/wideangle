import Link from 'next/link';
import { FaUserCircle,FaHome, FaUserAlt, FaPowerOff, FaBookmark, FaPencilAlt, FaHistory, FaTicketAlt, FaCreditCard, FaGlobe, FaMobileAlt, FaStar } from 'react-icons/fa';

const ProfileDetails = () => {
  // Mock data - in a real app, these would be props
  const profileData = {
    registrationDate: "20, January 2024 9:00 PM",
    firstName: "Michle",
    lastName: "Obema",
    username: "obema007",
    email: "obema@example.com",
    phone: "+55 669 4456 25987",
    expert: "Graphics Design",
    bio: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Maiores veniam, delectus accusamus nesciunt laborum repellat laboriosam, deserunt possimus itaque iusto perferendis voluptatum quaerat cupiditate vitae."
  };

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
                                            <Link href="/profile" className="active d-flex align-items-center justify-cotent-center">
                                                <FaUserAlt className="mr-2" size={16} />
                                                My Profile</Link>
                                        </li>
                                        <li>
                                            <Link href="/mytickets" className="d-flex align-items-center justify-cotent-center">
                                                <FaBookmark className="mr-2" size={16} />
                                                My Tickets</Link>
                                        </li>
                                        <li>
                                            <Link href="/loyaltyprogram" className="d-flex align-items-center justify-cotent-center">
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
                        <div className="dashboard__content__wraper p-2 flex justify-between items-center">
                            <h4>My Profile</h4>
                            <div className="dashboard_profile_edit ">
                                <Link href="/editprofile" className="btn d-flex items-center justify-center gap-2">
                                        <FaPencilAlt className="mr-2" size={14} /> Edit
                                </Link>        
                            </div>
                            
                        </div>
                        <div className="row">
                            <div className="col-xl-12 col-lg-12 col-md-12 col-12 pb-3">
                                
                                

                                {/* Profile Info Grid */}
                                <div className="p-8">
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-y-3">
                                    
                                    <ProfileRow label="Registration Date" value={profileData.registrationDate} />
                                    <ProfileRow label="First Name" value={profileData.firstName} />
                                    <ProfileRow label="Last Name" value={profileData.lastName} />
                                    <ProfileRow label="Email" value={profileData.email} />
                                    <ProfileRow label="Phone Number" value={profileData.phone} />

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

// Reusable Row Component for clean code
const ProfileRow = ({ label, value }) => (
  <>
    <div className="md:col-span-4 flex items-center">
      <div className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">{label}</div>
    </div>
    <div className="md:col-span-8 flex items-center">
      <div className="text-sm font-bold text-white uppercase tracking-tight">{value}</div>
    </div>
    {/* Subtle divider for all except last */}
    <div className="col-span-12 border-b border-white/[0.03] pb-2 mb-2"></div>
  </>
);

export default ProfileDetails;