"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FaCheckCircle, FaTag, FaTimes, FaTicketAlt,
  FaHamburger, FaPercent, FaRupeeSign, FaGift,
} from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiForCheckEligibleOffers, bookingFoodAndTicket, getAvailablePerks, getCheckoutSessionSummary } from '@/store/bookingSlice';
import { openRazorpayCheckout } from '@/utils/razorpay';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

const OFFER_COLORS = ['#f97316', '#8b5cf6', '#06b6d4', '#10b981', '#ef4444', '#3b82f6'];
const getOfferColor = (offer) => OFFER_COLORS[offer.id % OFFER_COLORS.length];

function formatDate(dateStr) {
  if (!dateStr) return '–';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatTime(timeStr) {
  if (!timeStr) return '–';
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${m} ${ampm}`;
}


export default function RoyalCheckout() {
  const dispatch = useDispatch();
  const user = useAuth()
  const router = useRouter();
  const searchParams = useSearchParams();
  const checkoutId = searchParams.get("checkoutId");

  const [isProcessing, setIsProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponStatus, setCouponStatus] = useState(null);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [eligibleOffers, setEligibleOffers] = useState([]);
  const [perks, setPerks] = useState([]);
  const [activeOfferTab, setActiveOfferTab] = useState('offers');
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [deliveryMode, setDeliveryMode] = useState(null); // null = not selected, 0 = self pickup, 1 = deliver to seat
  const [deliveryTime, setDeliveryTime] = useState(null); // 1 = Before Interval, 2 = During Interval, 3 = After Interval

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [res] = await Promise.all([
          dispatch(getCheckoutSessionSummary(checkoutId)),
        ]);
        if (getCheckoutSessionSummary.fulfilled.match(res)) {
          const payload = res.payload;
          setSessionData(payload?.data ?? payload);
        }
        else {
          if(res.payload.status === 404) {
            router.push('/movies');
          }
        }
      } catch (err) {
        console.error("Error fetching checkout session data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  

  useEffect(() => {
    if (!sessionData) return;
    const payloadForGetOffer = {
      foods: sessionData.food_items.map(item => ({
        qty: item.qty,
        price: item.price,
      })),
      tickets: [
        {
          price: sessionData.tickets[0]?.ticket_price || 0,
          qty: sessionData.tickets.length,
        },
      ],
    };

    const fetchData = async () => {
      try {
        const [offerres] = await Promise.all([
          dispatch(apiForCheckEligibleOffers(payloadForGetOffer)),
        ]);
        if (apiForCheckEligibleOffers.fulfilled.match(offerres)) {
          setEligibleOffers(offerres.payload);
        }
      } catch (err) {
        console.error("Error fetching eligible offers:", err);
      }
    };

    const fetchPerkData = async () => {
      const payloadForGetPerks = {
                ticket_total: sessionData.tickets.reduce((sum, t) => sum + (t.ticket_price || 0) * (t.qty || 1), 0),
                food_total: sessionData.food_items.reduce((sum, f) => sum + (f.price || 0) * (f.qty || 1), 0),
              };
      try {
        const [offerres] = await Promise.all([
          dispatch(getAvailablePerks(payloadForGetPerks)),
        ]);
        if (getAvailablePerks.fulfilled.match(offerres)) {
          setPerks(offerres.payload);
        }
      } catch (err) {
        console.error("Error fetching available perks:", err);
      }
    };
    fetchPerkData();
    fetchData();
  }, [sessionData]);

  const movie = sessionData?.movie;
  const screen = sessionData?.screen;
  const tickets = sessionData?.tickets || [];
  const foodItems = sessionData?.food_items || [];

  const ticketTotal = sessionData?.ticket_summary?.total_ticket_payable ?? 0;
  // const serviceCharge = tickets.reduce(
  //   (sum, t) => sum + (t.service_charge || 0) + (t.sgst_service_amount || 0) + (t.cgst_service_amount || 0),
  //   0
  // );
  const convenienceFee = sessionData?.convenience_fee || 0;
  const foodTotal = foodItems.reduce((sum, f) => sum + (f.price || 0) * (f.qty || 1), 0);
  const grandTotal = ticketTotal + foodTotal + convenienceFee;
  const voucherTicketDiscount = appliedVoucher?.ticket_discount || 0;
  const voucherFoodDiscount = appliedVoucher?.food_discount || 0;
  const voucherTotalDiscount = voucherTicketDiscount + voucherFoodDiscount;
  const finalTotal = Math.max(0, grandTotal - discount - voucherTotalDiscount);

  const seatLabels = tickets.map((t) => `${t.label}${t.column}`).join(', ');

  const handleRemoveVoucher = () => setAppliedVoucher(null);

  const handleApplyVoucher = (perk) => {
    setCouponCode('');
    setCouponStatus(null);
    setDiscount(0);
    setAppliedCoupon(null);
    setAppliedVoucher(perk);
  };

  const applyCoupon = (code) => {
    const found = eligibleOffers.find((o) => o.code === code);
    if (!found || !found.is_eligible) {
      setCouponStatus('error');
      setDiscount(0);
      setAppliedCoupon(null);
      return;
    }
    setAppliedVoucher(null);
    setDiscount(found.calculated_discount);
    setAppliedCoupon({ ...found, color: getOfferColor(found) });
    setCouponStatus('success');
    setCouponCode(code);
  };

  const handleRemoveCoupon = () => {
    setCouponCode('');
    setCouponStatus(null);
    setDiscount(0);
    setAppliedCoupon(null);
  };

  const posterSrc = movie?.image?.thumbnail?.['317x422'] || movie?.image?.thumbnail?.['200x200'] || movie?.image?.original;

  const handlePayment = async () => {
    if (foodItems.length > 0 && deliveryMode === null) {
      toast.error('Please select a Food Delivery option to continue.');
      return;
    }
    if (foodItems.length > 0 && deliveryMode === 1 && deliveryTime === null) {
      toast.error('Please select a delivery time for your food.');
      return;
    }

    const bookingData = {
      platform: "website",
      payment_method:4,
      checkout_id: checkoutId,
      delivery_option: deliveryMode === 1 ? deliveryTime : 0,
      offer_id: appliedCoupon?.id || null,
      purchase_id: appliedVoucher?.purchase_id || null,
      food_discount: voucherFoodDiscount,
      ticket_discount: voucherTicketDiscount,
    };
    await openRazorpayCheckout({
      amount: finalTotal,

      bookingId: checkoutId,

      user: {
        name: user?.name || "",
        email: user?.email || "",
        mobile: user?.mobile || "",
      },

      onSuccess: async (data) => {
        // call booking API HERE
        // isProcessing state can be used to show loading state while booking API is in progress
        console.log('bookingData',bookingData);
        try {
          setIsProcessing(true);
          const bookingRes = await dispatch(bookingFoodAndTicket(bookingData));
          if (bookingFoodAndTicket.fulfilled.match(bookingRes)) {
            toast.success('Order placed successfully.')
            router.push('/dashboard')
          }
        } catch (err) {
          toast.error(err?.message || "Booking failed");
        } finally {
          setIsProcessing(false);
        }
      },
      onFailure: (error) => {
        toast.error(error?.message || "Payment Failed, Please try again");
      },
    });
  };
  
  return (
    <div style={{ minHeight: '100vh', background: '#080a0f', paddingTop: '110px', paddingBottom: '60px', fontFamily: 'sans-serif', position: 'relative' }}>

      {/* Ambient glow */}
      <div style={{ position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)', width: '900px', height: '450px', background: 'radial-gradient(ellipse, rgba(242,140,40,0.055) 0%, transparent 65%)', pointerEvents: 'none', zIndex: 0 }} />

      <div className="checkout-layout" style={{ position: 'relative', zIndex: 1 }}>

        {/* ── LEFT: Receipt Card ── */}
        <div className="checkout-receipt-col">
          <div style={{ position: 'sticky', top: '24px' }}>
            <div style={{ borderRadius: '28px', overflow: 'hidden', background: 'linear-gradient(170deg, #14181f 0%, #0c0e14 100%)', border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 40px 80px rgba(0,0,0,0.55)', position: 'relative' }}>

              {/* ── Hero: blurred poster bg + sharp thumbnail ── */}
              <div style={{ position: 'relative', height: '190px', overflow: 'hidden', flexShrink: 0 }}>
                {posterSrc ? (
                  <img src={posterSrc} alt="" aria-hidden style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 25%', filter: 'blur(18px) brightness(0.28) saturate(1.6)', transform: 'scale(1.15)' }} />
                ) : (
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #1a1e2a, #0c0e14)' }} />
                )}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(8,10,15,0.1) 0%, rgba(12,14,20,0.94) 100%)' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 26px 20px', display: 'flex', gap: '15px', alignItems: 'flex-end' }}>
                  {posterSrc ? (
                    <img src={posterSrc} alt={movie?.name} style={{ width: '64px', height: '90px', objectFit: 'cover', borderRadius: '10px', border: '2px solid rgba(255,255,255,0.13)', boxShadow: '0 12px 32px rgba(0,0,0,0.7)', flexShrink: 0 }} />
                  ) : (
                    <div style={{ width: '64px', height: '90px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <FaTicketAlt style={{ color: 'rgba(255,255,255,0.2)', fontSize: '20px' }} />
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0, paddingBottom: '2px' }}>
                    <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#fff', margin: '0 0 8px', lineHeight: 1.25, letterSpacing: '-0.2px' }}>
                      {loading ? 'Loading...' : (movie?.name || '–')}
                    </h2>
                    <div style={{ display: 'flex', gap: '5px', alignItems: 'center', flexWrap: 'wrap' }}>
                      {movie?.rating && (
                        <span style={{ background: '#dc2626', color: '#fff', fontSize: '9px', fontWeight: 800, padding: '2px 6px', borderRadius: '4px', letterSpacing: '0.3px' }}>{movie.rating}</span>
                      )}
                      <span style={{ border: '1px solid rgba(255,255,255,0.22)', color: 'rgba(255,255,255,0.55)', fontSize: '9px', padding: '2px 6px', borderRadius: '4px' }}>2D</span>
                      {movie?.language && (
                        <span style={{ border: '1px solid rgba(255,255,255,0.22)', color: 'rgba(255,255,255,0.55)', fontSize: '9px', padding: '2px 6px', borderRadius: '4px' }}>{movie.language.slice(0, 3).toUpperCase()}</span>
                      )}
                      {screen?.name && <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginLeft: '2px' }}>{screen.name}</span>}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Tickets / Cost / Screen ── */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '20px 26px 14px', gap: '8px' }}>
                {[
                  { label: 'Tickets', value: `${tickets.length} Person${tickets.length !== 1 ? 's' : ''}` },
                  { label: 'Cost', value: `₹${ticketTotal.toFixed(0)}`, orange: true },
                  { label: 'Screen', value: screen?.name?.replace(/Screen\s*/i, '') || '–' },
                ].map(({ label, value, orange }) => (
                  <div key={label}>
                    <p style={{ fontSize: '9.5px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', margin: '0 0 5px' }}>{label}</p>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: orange ? '#f28c28' : '#fff', margin: 0, letterSpacing: '-0.2px' }}>{value}</p>
                  </div>
                ))}
              </div>

              <div style={{ margin: '0 26px', borderTop: '1.5px dashed rgba(255,255,255,0.08)' }} />

              {/* ── Seats / Date / Time ── */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '14px 26px 16px', gap: '8px' }}>
                <div>
                  <p style={{ fontSize: '9.5px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', margin: '0 0 5px' }}>Seats</p>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: '#fff', margin: '0 0 2px', wordBreak: 'break-word' }}>{seatLabels || '–'}</p>
                  {tickets[0]?.class && <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.28)', margin: 0 }}>{tickets[0].class}</p>}
                </div>
                {[
                  { label: 'Date', value: formatDate(screen?.show_date) },
                  { label: 'Time', value: formatTime(screen?.show_time) },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p style={{ fontSize: '9.5px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', margin: '0 0 5px' }}>{label}</p>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#fff', margin: 0 }}>{value}</p>
                  </div>
                ))}
              </div>

              {/* ── Food & Beverages ── */}
              {foodItems.length > 0 && (
                <>
                  <div style={{ margin: '0 26px', borderTop: '1.5px dashed rgba(255,255,255,0.08)' }} />
                  <div style={{ padding: '14px 26px 16px' }}>
                    <p style={{ fontSize: '9.5px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', margin: '0 0 12px' }}>Food & Beverages</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {foodItems.map((item, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          {item.image?.thumbnail?.['100x130'] ? (
                            <img src={item.image.thumbnail['100x130']} alt={item.name} style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} />
                          ) : (
                            <div style={{ width: '36px', height: '36px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <FaHamburger style={{ fontSize: '12px', color: 'rgba(255,255,255,0.2)' }} />
                            </div>
                          )}
                          <span style={{ flex: 1, fontSize: '13px', color: 'rgba(255,255,255,0.82)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</span>
                          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', width: '28px', textAlign: 'right', flexShrink: 0 }}>×{item.qty}</span>
                          <span style={{ fontSize: '13px', fontWeight: 600, color: '#fff', width: '60px', textAlign: 'right', flexShrink: 0 }}>₹{((item.price || 0) * (item.qty || 1)).toFixed(0)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* ── Price Breakdown ── */}
              <div style={{ margin: '0 26px', borderTop: '1.5px dashed rgba(255,255,255,0.08)' }} />
              <div style={{ padding: '14px 26px 18px', display: 'flex', flexDirection: 'column', gap: '9px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.42)' }}>Ticket Total ({tickets.length}×)</span>
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>₹{ticketTotal.toFixed(2)}</span>
                </div>
                {convenienceFee > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.42)' }}>Convenience Fee</span>
                    <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>₹{convenienceFee.toFixed(2)}</span>
                  </div>
                )}
                {foodTotal > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.42)' }}>Food & Beverages</span>
                    <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>₹{foodTotal.toFixed(2)}</span>
                  </div>
                )}
                {discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13px', color: '#4ade80', fontWeight: 600 }}>Coupon ({appliedCoupon?.code})</span>
                    <span style={{ fontSize: '13px', color: '#4ade80', fontWeight: 600 }}>−₹{discount.toFixed(2)}</span>
                  </div>
                )}
                {voucherTicketDiscount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13px', color: '#4ade80', fontWeight: 600 }}>Ticket Discount (Voucher)</span>
                    <span style={{ fontSize: '13px', color: '#4ade80', fontWeight: 600 }}>−₹{voucherTicketDiscount.toFixed(2)}</span>
                  </div>
                )}
                {voucherFoodDiscount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13px', color: '#4ade80', fontWeight: 600 }}>Food Discount (Voucher)</span>
                    <span style={{ fontSize: '13px', color: '#4ade80', fontWeight: 600 }}>−₹{voucherFoodDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '12px', marginTop: '3px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>Total Payable</span>
                  <span style={{ fontSize: '22px', fontWeight: 800, color: '#f28c28', letterSpacing: '-0.5px' }}>₹{finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Perforation circles */}
              <div style={{ position: 'absolute', top: '50%', left: '-10px', width: '20px', height: '20px', background: '#080a0f', borderRadius: '50%', transform: 'translateY(-50%)' }} />
              <div style={{ position: 'absolute', top: '50%', right: '-10px', width: '20px', height: '20px', background: '#080a0f', borderRadius: '50%', transform: 'translateY(-50%)' }} />

              {/* ── Pay Button ── */}
              <div style={{ padding: '4px 24px 24px' }}>
                <button
                    type="button"
                    disabled={isProcessing}
                    style={{
                      width: '100%', padding: '15px 24px', borderRadius: '14px', border: 'none',
                      background: 'linear-gradient(135deg, #f28c28 0%, #d9720e 100%)',
                      color: '#fff', fontSize: '13.5px', fontWeight: 800, letterSpacing: '0.8px',
                      textTransform: 'uppercase', cursor: isProcessing ? 'not-allowed' : 'pointer',
                      opacity: isProcessing ? 0.5 : 1,
                      boxShadow: '0 8px 28px rgba(242,140,40,0.38)',
                      display: 'block',
                    }}
                    onClick={handlePayment}
                  >
                    {isProcessing ? 'Processing...' : `Confirm & Pay  ₹${finalTotal.toFixed(2)}`}
                  </button>
              </div>

            </div>
          </div>
        </div>

        {/* ── RIGHT: Delivery + Coupon ── */}
        <div className="checkout-coupon-col">

          {/* Food Delivery Card */}
          {foodItems.length > 0 && (
            <div style={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)', background: 'linear-gradient(160deg, #14181f 0%, #0c0e14 100%)', marginBottom: '16px', boxShadow: '0 20px 50px rgba(0,0,0,0.4)' }}>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '18px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(242,140,40,0.12)', color: '#f28c28', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>
                  <FaHamburger />
                </span>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#fff', margin: '0 0 2px' }}>Food Delivery</h4>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.32)', margin: 0 }}>Choose how you'd like to receive your food</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '14px' }}>
                {[
                  { id: 0, label: 'Self Pickup', desc: 'Collect your order from the counter' },
                  { id: 1, label: 'Deliver to Seat', desc: 'Get your food delivered to your seat' },
                ].map(({ id, label, desc }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => { setDeliveryMode(id); if (id === 0) setDeliveryTime(null); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '11px 13px',
                      borderRadius: '12px', cursor: 'pointer', textAlign: 'left',
                      border: `1.5px solid ${deliveryMode === id ? 'rgba(242,140,40,0.5)' : 'rgba(255,255,255,0.07)'}`,
                      background: deliveryMode === id ? 'rgba(242,140,40,0.07)' : 'rgba(255,255,255,0.02)',
                    }}
                  >
                    <span style={{ width: '17px', height: '17px', borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${deliveryMode === id ? '#f28c28' : 'rgba(255,255,255,0.2)'}` }}>
                      {deliveryMode === id && <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#f28c28' }} />}
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#fff', lineHeight: 1.2 }}>{label}</span>
                      <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.32)' }}>{desc}</span>
                    </div>
                  </button>
                ))}
              </div>

              {deliveryMode === 1 && (
                <div style={{ padding: '0 14px 14px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
                  <p style={{ fontSize: '9.5px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', margin: '0 0 10px' }}>When would you like it delivered?</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '7px' }}>
                    {[
                      { id: 1, label: 'Before Interval' },
                      { id: 2, label: 'During Interval' },
                      { id: 3, label: 'After Interval' },
                    ].map(({ id, label }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setDeliveryTime(id)}
                        style={{
                          padding: '9px 5px', borderRadius: '10px', fontSize: '11px', fontWeight: 600,
                          cursor: 'pointer', textAlign: 'center', lineHeight: 1.3,
                          border: `1.5px solid ${deliveryTime === id ? '#f28c28' : 'rgba(255,255,255,0.08)'}`,
                          background: deliveryTime === id ? 'rgba(242,140,40,0.1)' : 'rgba(255,255,255,0.02)',
                          color: deliveryTime === id ? '#f28c28' : 'rgba(255,255,255,0.4)',
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Coupon / Offers Card */}
          <div style={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)', background: 'linear-gradient(160deg, #14181f 0%, #0c0e14 100%)', boxShadow: '0 20px 50px rgba(0,0,0,0.4)' }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '18px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(242,140,40,0.12)', color: '#f28c28', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>
                <FaGift />
              </span>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#fff', margin: '0 0 2px' }}>Coupons & Offers</h4>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.32)', margin: 0 }}>Apply an offer or redeem a voucher</p>
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {[
                { key: 'offers', label: 'Offers', count: eligibleOffers.length },
                { key: 'vouchers', label: 'Vouchers', count: perks.length },
              ].map(({ key, label, count }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveOfferTab(key)}
                  style={{
                    flex: 1, padding: '11px 0', fontSize: '12px', fontWeight: 700, background: 'none', border: 'none',
                    cursor: 'pointer', letterSpacing: '0.3px',
                    color: activeOfferTab === key ? '#f28c28' : 'rgba(255,255,255,0.35)',
                    borderBottom: `2px solid ${activeOfferTab === key ? '#f28c28' : 'transparent'}`,
                  }}
                >
                  {label}
                  {count > 0 && (
                    <span style={{ marginLeft: '5px', fontSize: '10px', fontWeight: 700, padding: '1px 6px', borderRadius: '20px', background: activeOfferTab === key ? 'rgba(242,140,40,0.18)' : 'rgba(255,255,255,0.07)', color: activeOfferTab === key ? '#f28c28' : 'rgba(255,255,255,0.3)' }}>{count}</span>
                  )}
                </button>
              ))}
            </div>

            {/* ── Offers Tab ── */}
            {activeOfferTab === 'offers' && (
              <>
                {couponStatus === 'success' && (
                  <div style={{ margin: '12px 14px 0', padding: '10px 13px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', border: `1.5px dashed ${appliedCoupon?.color}55`, background: `${appliedCoupon?.color}0d` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <FaCheckCircle style={{ color: appliedCoupon?.color, fontSize: '15px', flexShrink: 0 }} />
                      <div>
                        <p style={{ fontSize: '13px', fontWeight: 800, color: appliedCoupon?.color, margin: '0 0 2px', letterSpacing: '0.5px' }}>{appliedCoupon?.code}</p>
                        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.38)', margin: 0 }}>You save ₹{discount} on this order</p>
                      </div>
                    </div>
                    <button type="button" onClick={handleRemoveCoupon} style={{ width: '26px', height: '26px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, fontSize: '10px' }}>
                      <FaTimes />
                    </button>
                  </div>
                )}

                <div style={{ padding: '14px 14px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.04)', border: `1px solid ${couponStatus === 'error' ? 'rgba(255,100,100,0.4)' : 'rgba(255,255,255,0.08)'}`, borderRadius: '12px', overflow: 'hidden' }}>
                    <span style={{ padding: '0 12px', color: 'rgba(255,255,255,0.22)', fontSize: '12px', flexShrink: 0 }}><FaTag /></span>
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponStatus(null); }}
                      onKeyDown={(e) => e.key === 'Enter' && applyCoupon(couponCode)}
                      style={{ flex: 1, background: 'none', border: 'none', outline: 'none', padding: '11px 4px', fontSize: '13px', fontWeight: 600, color: '#fff', letterSpacing: '0.5px' }}
                    />
                    <button
                      type="button"
                      disabled={!couponCode.trim()}
                      onClick={() => applyCoupon(couponCode)}
                      style={{ padding: '11px 16px', background: 'rgba(242,140,40,0.1)', border: 'none', borderLeft: '1px solid rgba(255,255,255,0.07)', color: '#f28c28', fontSize: '12px', fontWeight: 700, cursor: couponCode.trim() ? 'pointer' : 'not-allowed', opacity: couponCode.trim() ? 1 : 0.4, whiteSpace: 'nowrap' }}
                    >
                      Apply
                    </button>
                  </div>
                  {couponStatus === 'error' && (
                    <p style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: '#f87171', margin: '6px 0 0' }}>
                      <FaTimes /> Invalid coupon code. Please try again.
                    </p>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 14px 10px', fontSize: '9.5px', fontWeight: 700, letterSpacing: '1.2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)' }}>
                  <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
                  <span>Available Offers</span>
                  <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
                </div>

                <div style={{ padding: '0 10px 10px', display: 'flex', flexDirection: 'column', gap: '7px' }}>
                  {eligibleOffers.length === 0 && (
                    <p style={{ textAlign: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.22)', padding: '16px 0', margin: 0 }}>No offers available for your cart.</p>
                  )}
                  {eligibleOffers.map((offer) => {
                    const color = getOfferColor(offer);
                    const isApplied = appliedCoupon?.code === offer.code;
                    const isEligible = !!offer.is_eligible;
                    const benefit = offer.benefits?.[0];
                    const isFlatDiscount = benefit?.benefit_type === 'flat_discount';
                    const badge = isFlatDiscount ? `Flat ₹${benefit.discount_amount} off` : `${benefit?.discount_percent}% off`;

                    const remainingHint = !isEligible && (
                      offer.remaining_food_amount > 0 ? `Add ₹${Math.ceil(offer.remaining_food_amount)} more to avail this offer` :
                      offer.remaining_ticket_amount > 0 ? `Add ₹${Math.ceil(offer.remaining_ticket_amount)} more in tickets` :
                      offer.remaining_food_qty > 0 ? `Add ${offer.remaining_food_qty} more food item(s)` :
                      offer.remaining_ticket_qty > 0 ? `Add ${offer.remaining_ticket_qty} more ticket(s)` : null
                    );

                    return (
                      <div
                        key={offer.id}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '11px', padding: '11px 12px', borderRadius: '14px',
                          border: `1.5px solid ${isApplied ? `${color}45` : 'rgba(255,255,255,0.06)'}`,
                          background: isApplied ? `${color}08` : 'rgba(255,255,255,0.015)',
                          position: 'relative', overflow: 'hidden',
                          opacity: isEligible ? 1 : 0.7,
                        }}
                      >
                        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: color }} />
                        <span style={{ width: '32px', height: '32px', borderRadius: '9px', background: `${color}18`, color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', flexShrink: 0 }}>
                          {isFlatDiscount ? <FaRupeeSign /> : <FaPercent />}
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '3px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '13px', fontWeight: 800, color: '#fff', letterSpacing: '0.2px' }}>{offer.code}</span>
                            <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '20px', color, background: `${color}15`, border: `1px solid ${color}30` }}>{badge}</span>
                          </div>
                          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.48)', margin: '0 0 1px', fontWeight: 600 }}>{offer.title}</p>
                          {remainingHint ? (
                            <p style={{ fontSize: '11px', color: '#f59e0b', margin: 0, fontWeight: 600 }}>{remainingHint}</p>
                          ) : (
                            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.28)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{offer.description}</p>
                          )}
                        </div>
                        {isApplied ? (
                          <button type="button" onClick={handleRemoveCoupon} style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', padding: '5px 11px', borderRadius: '8px', cursor: 'pointer', flexShrink: 0 }}>
                            Remove
                          </button>
                        ) : isEligible ? (
                          <button type="button" onClick={() => { setCouponCode(offer.code); applyCoupon(offer.code); }} style={{ fontSize: '11px', fontWeight: 700, color, background: `${color}12`, border: `1.5px solid ${color}45`, padding: '5px 11px', borderRadius: '8px', cursor: 'pointer', flexShrink: 0 }}>
                            Apply
                          </button>
                        ) : (
                          <button type="button" disabled style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.04)', border: '1.5px solid rgba(255,255,255,0.08)', padding: '5px 11px', borderRadius: '8px', cursor: 'not-allowed', flexShrink: 0 }}>
                            Apply
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* ── Vouchers Tab ── */}
            {activeOfferTab === 'vouchers' && (
              <>
                {appliedVoucher && (
                  <div style={{ margin: '12px 14px 0', padding: '10px 13px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', border: '1.5px dashed rgba(242,140,40,0.4)', background: 'rgba(242,140,40,0.06)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <FaCheckCircle style={{ color: '#f28c28', fontSize: '15px', flexShrink: 0 }} />
                      <div>
                        <p style={{ fontSize: '13px', fontWeight: 800, color: '#f28c28', margin: '0 0 2px', letterSpacing: '0.5px' }}>{appliedVoucher.perk_name}</p>
                        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.38)', margin: 0 }}>
                          {voucherTotalDiscount > 0 ? `You save ₹${voucherTotalDiscount.toFixed(0)} on this order` : 'Voucher applied to this order'}
                        </p>
                      </div>
                    </div>
                    <button type="button" onClick={handleRemoveVoucher} style={{ width: '26px', height: '26px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, fontSize: '10px' }}>
                      <FaTimes />
                    </button>
                  </div>
                )}

                <div style={{ padding: '10px 10px 10px', display: 'flex', flexDirection: 'column', gap: '7px' }}>
                  {perks.length === 0 && (
                    <p style={{ textAlign: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.22)', padding: '16px 0', margin: 0 }}>No vouchers available for this booking.</p>
                  )}
                  {perks.map((perk) => {
                    const isApplied = appliedVoucher?.purchase_id === perk.purchase_id;
                    return (
                      <div
                        key={perk.purchase_id}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '11px', padding: '11px 12px', borderRadius: '14px',
                          border: `1.5px solid ${isApplied ? 'rgba(242,140,40,0.4)' : 'rgba(255,255,255,0.06)'}`,
                          background: isApplied ? 'rgba(242,140,40,0.06)' : 'rgba(255,255,255,0.015)',
                          position: 'relative', overflow: 'hidden',
                        }}
                      >
                        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: '#f28c28' }} />
                        {perk.perk_logo ? (
                          <img src={perk.perk_logo} alt={perk.perk_name} style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '9px', flexShrink: 0 }} />
                        ) : (
                          <span style={{ width: '32px', height: '32px', borderRadius: '9px', background: 'rgba(242,140,40,0.15)', color: '#f28c28', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, flexShrink: 0 }}>
                            {perk.perk_name?.[0] ?? <FaGift />}
                          </span>
                        )}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: '13px', fontWeight: 800, color: '#fff', margin: '0 0 3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{perk.perk_name}</p>
                          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', margin: 0 }}>Code: <span style={{ color: 'rgba(255,255,255,0.55)', fontWeight: 600 }}>{perk.code}</span></p>
                        </div>
                        {isApplied ? (
                          <button type="button" onClick={handleRemoveVoucher} style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', padding: '5px 11px', borderRadius: '8px', cursor: 'pointer', flexShrink: 0 }}>
                            Remove
                          </button>
                        ) : (
                          <button type="button" onClick={() => handleApplyVoucher(perk)} style={{ fontSize: '11px', fontWeight: 700, color: '#f28c28', background: 'rgba(242,140,40,0.1)', border: '1.5px solid rgba(242,140,40,0.35)', padding: '5px 11px', borderRadius: '8px', cursor: 'pointer', flexShrink: 0 }}>
                            Apply
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
