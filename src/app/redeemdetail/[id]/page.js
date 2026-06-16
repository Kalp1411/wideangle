'use client';
import { fetchSinglePerkDetail, redeemPerk } from '@/store/dashboardSlice';
import Swal from 'sweetalert2';
import { capitalizeName } from '@/utils/helper';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaUserCircle, FaHome, FaUserAlt, FaPowerOff, FaStar, FaBookmark, FaPencilAlt, FaHistory, FaTicketAlt, FaCreditCard, FaGlobe, FaMobileAlt, FaUser } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useLogoutConfirm } from '@/app/components/LogoutConfirmModal';
import Image from 'next/image';

const redeemstore = () => {
    const user = useAuth();
    const dispatch = useDispatch();
    const router = useRouter();
    const [perk, setPerk] = useState(null);
    const [redeeming, setRedeeming] = useState(false);
    const param = useParams();
    const { id } = param;
      const showLogoutConfirm = useLogoutConfirm();
    

    useEffect(() => {
        const fetchPerkDetails = async () => {
            try {
                const res = await dispatch(fetchSinglePerkDetail(id));
                if (fetchSinglePerkDetail.fulfilled.match(res)) {
                    setPerk(res.payload);
                }
                else {
                    toast.error(res.payload || 'Failed to fetch perk details');
                }
            } catch (error) {
                toast.error('An error occurred while fetching perk details');
            }
        };
        fetchPerkDetails();
    }, [dispatch, id]);

    const handleReedemPerk = async (perkId) => {
        const result = await Swal.fire({
            title: 'Redeem Perk?',
            text: `Are you sure you want to redeem "${perk?.perk_name}" for ${perk?.point_cost} points?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Redeem',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#f28c28',
            cancelButtonColor: '#3a3b3f',
            background: '#1a1b1f',
            color: '#ffffff',
            customClass: {
                popup: 'rounded-2xl',
            },
        });

        if (result.isConfirmed) {
            try {
                setRedeeming(true);
                const dataToSend = {
                    loyalty_perk_id: perkId,
                };
                await dispatch(redeemPerk(dataToSend)).unwrap();
                toast.success('Perk redeemed successfully!');
                router.push('/myvouchers');
            } catch (error) {
                toast.error(error || 'Failed to redeem perk');
            } finally {
                setRedeeming(false);
            }
        }
    }

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
                        {!perk ? (
                            <div className="reward-detail-wrap">
                                <div className="rd-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
                                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎁</div>
                                    <div className="rd-title">No Perk Found</div>
                                    <p style={{ color: '#999', marginTop: '8px' }}>The perk you are looking for does not exist or has been removed.</p>
                                    <Link href="/redeemstore" className="btn btn-orange" style={{ marginTop: '20px', display: 'inline-block' }}>Back to Rewards</Link>
                                </div>
                            </div>
                        ) : (
                        <div className="reward-detail-wrap">
                            <div style={{ marginBottom: '12px' }}>
                                <Link href="/redeemstore" className="btn btn-orange" style={{ padding: '6px 14px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>← Back to Rewards</Link>
                            </div>
                            <div className="rd-card">
                                <div className="rd-banner">
                                    {perk?.perk_image ? (
                                        <img src={perk.perk_image} alt={perk.perk_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <span>🎁</span>
                                    )}
                                </div>
                                <div className="rd-body">
                                    <div className="rd-title">{perk?.perk_name}</div>

                                    {perk?.tier_name && (
                                        <div className="rd-expiry">Available for: <strong>{perk.tier_name}</strong> tier members</div>
                                    )}

                                    <div className="rd-expiry">
                                        Offer valid for {perk?.expiry_value} {perk?.expiry_type}{perk?.expiry_value > 1 ? 's' : ''}
                                    </div>

                                    <div className="rd-prog-track"><div className="rd-prog-fill"></div></div>
                                    <div className="rd-prog-label">{perk?.point_cost?.toLocaleString()} points required</div>

                                    <div className="rd-desc">
                                        {perk?.discount_type === 'percentage'
                                            ? `Get ${parseFloat(perk?.discount_value ?? 0)}% off`
                                            : `Get ₹${parseFloat(perk?.discount_value ?? 0)} off`
                                        } on orders above ₹{parseFloat(perk?.min_cart_value ?? 0).toLocaleString()}.
                                        {perk?.max_discount_cap && ` Maximum discount: ₹${parseFloat(perk.max_discount_cap).toLocaleString()}.`}
                                        {perk?.applicable_on && ` Applicable on: ${perk.applicable_on == 'both' ? 'Tickets and Food' : capitalizeName(perk.applicable_on)}.`}
                                    </div>

                                    <div className="rd-stitle">Terms and Conditions:</div>
                                    <div className="rd-list" dangerouslySetInnerHTML={{ __html: perk?.terms_and_conditions }} />

                                    {perk?.code && (
                                        <div style={{ margin: '16px 0', padding: '12px 16px', background: '#1a1b1f', borderRadius: '8px', border: '1px dashed #f28c28', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                                            <div>
                                                <div style={{ fontSize: '11px', color: '#999', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Promo Code</div>
                                                <div style={{ fontSize: '18px', fontWeight: '700', color: '#f28c28', letterSpacing: '2px' }}>{perk.code}</div>
                                            </div>
                                            {/* <button
                                                onClick={() => { navigator.clipboard.writeText(perk.code); toast.success('Code copied!'); }}
                                                style={{ padding: '6px 12px', fontSize: '12px', background: '#f28c28', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', whiteSpace: 'nowrap' }}
                                            >Copy Code</button> */}
                                        </div>
                                    )}

                                    {!perk?.is_available_for_purchase && perk?.reason && (
                                        <div style={{ margin: '12px 0', padding: '10px 14px', background: '#2a1a1a', borderRadius: '8px', border: '1px solid #c0392b', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <span style={{ fontSize: '16px' }}>⚠️</span>
                                            <span style={{ fontSize: '13px', color: '#e57373' }}>{perk.reason}</span>
                                        </div>
                                    )}

                                    <button
                                        className="btn btn-orange btn-full"
                                        onClick={() => handleReedemPerk(perk.id)}
                                        disabled={!perk?.is_available_for_purchase || redeeming}
                                        style={(!perk?.is_available_for_purchase || redeeming) ? { opacity: 0.6, cursor: 'not-allowed', pointerEvents: 'none' } : {}}
                                    >
                                        {redeeming ? 'Processing...' : 'Redeem'}
                                    </button>
                                </div>
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




export default redeemstore;