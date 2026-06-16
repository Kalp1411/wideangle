"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FaChevronLeft,
  FaRegTrashAlt,
  FaPlus,
  FaMinus,
  FaLeaf,
  FaFire,
  FaLayerGroup,
} from "react-icons/fa";
import AuthPopup from "../components/AuthPopup";
import { getFoodItems, getFoodCombos } from "@/store/foodSlice";
import { useDispatch } from "react-redux";
import { getHoldBoxOfficeTicket } from "@/store/boxOfficeSlice";
import { changeDateFormat, convertTo12HourFormat } from "@/utils/helper";
import { openAuthPopUp } from "@/store/authSlice";
import { useAuth } from "@/hooks/useAuth";
import { createCheckoutSession } from "@/store/bookingSlice";

export default function FoodOrderingPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Items');
  const [cart, setCart] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [foodCombos, setFoodCombos] = useState([]);
  const [holdTicket, setHoldTicket] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  const user = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const holdData = JSON.parse(
          sessionStorage.getItem("ticket_hold") || "{}"
        );
        const [itemsRes, combosRes,holdTicketRes] = await Promise.all([
          dispatch(getFoodItems()),
          dispatch(getFoodCombos()),
          dispatch(getHoldBoxOfficeTicket({hold_token: holdData.hold_token})),
        ]);
        if(getFoodItems.fulfilled.match(itemsRes)) {
          const itemsWithType = itemsRes.payload.map(item => ({ ...item, type: 'food' }));
          setFoodItems(itemsWithType);
        }
        if(getFoodCombos.fulfilled.match(combosRes)) {
          const combosWithType = combosRes.payload.map(item => ({ ...item, type: 'combo' }));
          setFoodCombos(combosWithType);
        }
        if(getHoldBoxOfficeTicket.fulfilled.match(holdTicketRes)) {
          setHoldTicket(holdTicketRes.payload);
        }
      } catch (err) {
        console.error("Error fetching food data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  const addToCart = (item, type) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id && i.type === type);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id && i.type === type ? { ...i, qty: i.qty + 1 } : i,
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const decreaseQuantity = (id, type) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === id && i.type === type);
      if (existing.qty > 1) {
        return prev.map((i) => (i.id === id && i.type === type ? { ...i, qty: i.qty - 1 } : i));
      }
      return prev.filter((i) => !(i.id === id && i.type === type));
    });
  };

  const removeFromCart = (id, type) => {
    setCart((prev) => prev.filter((i) => !(i.id === id && i.type === type)));
  };

  const getItemQuantity = (id, type) => {
    return cart.find((i) => i.id === id && i.type === type)?.qty || 0;
  };

  const foodTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const ticketPrice = holdTicket?.ticket_summary?.total_ticket_price || 0;
  const convenienceFee = holdTicket?.ticket_summary?.convenience_fee || 0;

  // const handleOpenAuth = (e) => {
  //   dispatch(openAuthPopUp())
  // };

  const handleContinueForCheckout = async () => {
    if (!user) {
      dispatch(openAuthPopUp());
      return;
    } else {
      const holdData = JSON.parse(sessionStorage.getItem("ticket_hold") || "{}");
      const orderSummary = {
        'food_items': cart,
        'hold_token': holdData?.hold_token,
      };
      try {
        const res = await dispatch(createCheckoutSession({data: orderSummary}));
        if(createCheckoutSession.fulfilled.match(res)) {          
          const checkoutId = res.payload.checkout_id;
          router.push(`/payment?checkoutId=${checkoutId}`);
        } else {
          console.error(res.payload || res.payload?.message || "Failed to create checkout session");
        }
      } catch (error) {
        console.error(error.response?.data?.message || error.message || "An error occurred during checkout" || error);
      }
    }
  }

  const onAuthSuccess = () => {
    const orderSummary = {
      movieName: holdTicket?.movie?.name || "Aaryan - (Hindi)",
      theater: holdTicket?.screen?.theater_name || "Rajhans Cinemas: Vastral",
      showTime: holdTicket?.screen?.show_time || "Fri, 30 Jan, 2026 | 09:00 PM",
      seats: "D13, D14", // This would ideally come from your previous seat selection state
      ticketPrice: ticketPrice,
      foodItems: cart,
      foodTotal: foodTotal,
      grandTotal: (ticketPrice + foodTotal + convenienceFee).toFixed(2),
    };

    localStorage.setItem("lastOrder", JSON.stringify(orderSummary));

    setIsAuthOpen(false);
    router.push("/payment");
  };

  const grandTotal = (ticketPrice + foodTotal + convenienceFee).toFixed(2);

  useEffect(() => {
    if (!holdTicket?.hold_expiry_date || !holdTicket?.hold_expiry_time) return;
    const expiryMs = new Date(`${holdTicket.hold_expiry_date} ${holdTicket.hold_expiry_time}`).getTime();

    const tick = () => {
      const remaining = Math.floor((expiryMs - Date.now()) / 1000);
      if (remaining <= 0) {
        setTimeLeft(0);
        setSessionExpired(true);
        return;
      }
      setTimeLeft(remaining);
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [holdTicket]);

  useEffect(() => {
    const elements = document.querySelectorAll("[data-background]");
    elements.forEach((el) => {
      const bg = el.getAttribute("data-background");
      if (bg) el.style.backgroundImage = `url(${bg})`;
    });
  }, []);

  return (
    <section
      className="min-h-screen bg-[#F3F4F6] food_area font-sans pb-10"
      style={{
        backgroundImage: `url(${"/assets/img/bg/tv_series_bg02.jpg"})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <AuthPopup
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={onAuthSuccess}
      />

      {sessionExpired && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="creative__pill rounded-2xl p-8 max-w-sm w-full mx-4 text-center shadow-2xl">
            <div className="text-5xl mb-4">⏰</div>
            <h2 className="text-white font-bold text-xl mb-2">Oops, session expired</h2>
            <p className="text-gray-400 text-sm mb-6">Your seat hold has timed out. Please select your seats again.</p>
            <button
              onClick={() => router.push("/movies")}
              className="btn w-full py-3 font-bold"
            >
              Back to Movies
            </button>
          </div>
        </div>
      )}

      {/* Top Header */}
      <div className="bg-offblack pt-130 pb-4 pl-4 pr-4 flex justify-between items-center sticky top-0 z-50 border-b border-white/10">
        <div className="container custom-container">
          <div className="d-flex justify-content-between align-items-center">
            <div className="flex items-center gap-4 text-white">
              <FaChevronLeft className="cursor-pointer hover:text-orange-500 transition-colors flex-shrink-0" />
              <img
                src={holdTicket?.movie?.image?.thumbnail?.['317x422'] || holdTicket?.movie?.image?.original}
                alt={holdTicket?.movie?.name}
                className="w-10 h-14 rounded-lg object-cover flex-shrink-0 hidden sm:block"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div>
                <h1 className="font-bold text-sm">
                  {holdTicket?.movie?.name}
                  {holdTicket?.movie?.language && (
                    <span className="text-[10px] border border-white/30 text-gray-400 px-1.5 py-0.5 rounded ml-2 font-normal">
                      {holdTicket.movie.language}
                    </span>
                  )}
                  {holdTicket?.movie?.rating && (
                    <span className="text-[10px] border border-white/30 text-gray-400 px-1.5 py-0.5 rounded ml-1 font-normal">
                      {holdTicket.movie.rating}
                    </span>
                  )}
                </h1>
                <p className="text-xs text-gray-400 mt-0.5">
                  {holdTicket?.screen?.show_date ? changeDateFormat(holdTicket.screen.show_date, 'do MMM yyyy') : 'Fri, 30 Jan, 2026'} | {holdTicket?.screen?.show_time ? convertTo12HourFormat(holdTicket.screen.show_time) : '09:00 PM'}
                  {holdTicket?.screen?.name && <span className="ml-2 text-white/50">· {holdTicket.screen.name}</span>}
                </p>
                {holdTicket?.tickets?.length > 0 && (
                  <p className="text-xs mt-0.5">
                    <span className="text-orange-400 font-medium">
                      {holdTicket.tickets.map(t => `${t.label}${t.column}`).join(', ')}
                    </span>
                    <span className="text-white/40 mx-1.5">·</span>
                    <span className="text-gray-400">{holdTicket.tickets[0]?.class}</span>
                    <span className="text-white/40 mx-1.5">·</span>
                    <span className="text-white font-semibold">₹{holdTicket.ticket_summary?.total_ticket_price?.toFixed(2)}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {timeLeft !== null && (
                <div className={`text-xs font-bold px-3 py-1.5 rounded-lg ${timeLeft <= 60 ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-orange-500/20 text-orange-400'}`}>
                  {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')} Mins Remaining
                </div>
              )}
              <button onClick={() => handleContinueForCheckout()} className="btn">
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap pt-6 pb-6 gap-6 max-w-[1400px] mx-auto">
        {/* Main Content */}
        <div className="flex-1 tab_content_box">
          <div className="rounded-xl p-2 mb-6">

            <div className="flex gap-4 border-b border-white/10 overflow-hidden mb-8 creative__pill p-1">
              <button
                  onClick={() => setActiveTab('Items')}
                  className={`py-3 px-6 text-sm font-bold transition-all rounded-lg ${
                    activeTab === 'Items'
                      ? "bg-orange-500 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}>
                  Items
                </button>
                <button
                  onClick={() => setActiveTab('Combos')}
                  className={`py-3 px-6 text-sm font-bold transition-all rounded-lg ${
                    activeTab === 'Combos'
                      ? "bg-orange-500 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}>
                  Combos
                </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="rounded-2xl creative__pill animate-pulse overflow-hidden">
                    <div className="w-full h-40 bg-white/10" />
                    <div className="p-4 space-y-2.5">
                      <div className="h-4 bg-white/10 rounded w-3/4" />
                      <div className="h-3 bg-white/10 rounded w-full" />
                      <div className="h-3 bg-white/10 rounded w-2/3" />
                      <div className="flex justify-between items-center pt-1">
                        <div className="h-5 bg-white/10 rounded w-1/3" />
                        <div className="h-7 bg-white/10 rounded w-1/4" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {(activeTab === 'Items' ? foodItems : foodCombos).map((item) => {
                  const quantity = getItemQuantity(item.id, item.type);
                  const isCombo = activeTab === 'Combos';
                  return (
                    <div key={`${item.id}-${item.type}`}
                      className="group flex flex-col rounded-2xl creative__pill border border-transparent hover:border-orange-500/30 transition-all duration-300 overflow-hidden">

                      {/* Image */}
                      <div className="relative w-full h-40 overflow-hidden bg-gradient-to-br from-white/10 to-white/5 flex-shrink-0">
                        <img
                          src={item.image?.thumbnail?.['100x130'] || item.image || "/assets/img/popcorn.svg"}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => { e.target.src = "/assets/img/popcorn.svg"; }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />


                        {/* Discount badge */}
                        {item.discount && (
                          <div className="absolute top-2.5 right-2.5 bg-green-500/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 backdrop-blur-sm">
                            <FaFire size={7} /> {item.discount}
                          </div>
                        )}

                        {/* Combo label */}
                        {isCombo && (
                          <div className="absolute bottom-2.5 left-2.5 bg-orange-500/85 text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full backdrop-blur-sm">
                            Combo
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex flex-col flex-1 p-4">
                        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />

                        <h6 className="text-xs text-white leading-snug group-hover:text-orange-400 transition-colors duration-200 line-clamp-1 mb-1">
                          {item.name}
                        </h6>
                        <div className="flex justify-between items-end mt-3 gap-2">
                          <div className="min-w-0">
                            <div className="flex items-baseline gap-1">
                              <span className="font-extrabold text-base text-white tracking-tight">
                                ₹{item.price}
                              </span>
                              {item.oldPrice && (
                                <span className="text-xs text-gray-500 line-through">
                                  ₹{item.oldPrice}
                                </span>
                              )}
                            </div>
                            {item.discount && (
                              <span className="text-[10px] font-semibold text-green-400 flex items-center gap-1">
                                <FaLeaf size={8} /> {item.discount} off
                              </span>
                            )}
                          </div>

                          <div className="flex-shrink-0">
                            {quantity === 0 ? (
                              <button
                                onClick={() => addToCart(item, item.type)}
                                className="btn px-4 py-1 text-xs font-bold tracking-wider">
                                ADD
                              </button>
                            ) : (
                              <div className="flex items-center bg-orange-500 rounded-xl overflow-hidden shadow-lg shadow-orange-500/20">
                                <button
                                  onClick={() => decreaseQuantity(item.id, item.type)}
                                  className="px-2 py-1.5 text-white hover:bg-black/20 transition-colors">
                                  <FaMinus size={9} />
                                </button>
                                <span className="px-1.5 font-bold text-xs text-white min-w-[22px] text-center">
                                  {quantity}
                                </span>
                                <button
                                  onClick={() => addToCart(item, item.type)}
                                  className="px-2 py-1.5 text-white hover:bg-black/20 transition-colors">
                                  <FaPlus size={9} />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Cart */}
        <div className="w-[380px] sticky top-24 h-fit sidebar__cart">

          <div className="creative__pill rounded-xl shadow-2xl overflow-hidden ">
            <div className="text-white min-h-[200px] flex flex-col p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                Your Cart{" "}
                <span className="text-xs bg-orange-500 px-2 py-0.5 rounded-full">
                  {cart.length}
                </span>
              </h3>

              {cart.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40 py-8">
                  <img
                    src="/assets/img/popcorn.svg"
                    alt="Empty"
                    className="w-16 h-16 mb-4 grayscale"
                  />
                  <p className="text-sm px-10">
                    Fill this cart with your favorite food combos!
                  </p>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto space-y-3 pr-2 max-h-[350px] custom-scrollbar">
                  {cart.map((cartItem) => (
                    <div
                      key={`${cartItem.id}-${cartItem.type}`}
                      className="flex justify-between items-center bg-white/5 p-2 rounded-xl border border-white/5 animate-in slide-in-from-right-5"
                    >
                      <div>
                        <p className="text-sm font-bold leading-tight mb-0">
                          {cartItem.name}
                        </p>
                        <p className="text-xs text-orange-400 font-bold mt-0">
                          {cartItem.qty} x ₹{cartItem.price} = ₹
                          {cartItem.qty * cartItem.price}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(cartItem.id, cartItem.type)}
                        className="text-gray-500 hover:text-red-500 transition-colors p-2"
                      >
                        <FaRegTrashAlt size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bill Summary */}
            <div className="border-t border-white/10 px-6 py-4 space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">
                  Ticket{holdTicket?.tickets?.length > 1 ? `s (×${holdTicket.tickets.length})` : ''}
                </span>
                <span className="text-white">₹{ticketPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">
                  Convenience Fee
                </span>
                <span className="text-white">₹{convenienceFee.toFixed(2)}</span>
              </div>
              {foodTotal > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">
                    Food & Beverages (×{cart.reduce((s, i) => s + i.qty, 0)})
                  </span>
                  <span className="text-white">₹{foodTotal.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2 border-t border-white/10">
                <span className="text-white font-bold text-sm">Total Payable</span>
                <span className="text-orange-400 font-extrabold text-lg">₹{grandTotal}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}