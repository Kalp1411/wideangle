import { ApiForCreatePaymentOrder, ApiForVerifyPayment } from "@/services/paymentService";
import { loadRazorpay } from "./loadRazorpay";


export const openRazorpayCheckout = async ({
  amount,
  bookingId,
  user,
  onSuccess,
  onFailure,
}) => {
  try {
    const loaded = await loadRazorpay();

    if (!loaded) {
      alert("Failed to load Razorpay");
      return;
    }

    const orderResponse = await ApiForCreatePaymentOrder({
      amount,
      booking_id: bookingId,
    });

    const order = orderResponse.data;

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      order_id: order.order_id,
      name: "WideAngle Cinemas",
      description: "Movie Ticket Payment",
      prefill: {
        name: user?.name || "",
        email: user?.email || "",
        contact: user?.mobile || "",
      },

      handler: async function (response) {
        try {
          const verifyResponse = await ApiForVerifyPayment({payment_id: response.razorpay_payment_id});        
          if (verifyResponse.status) {
            onSuccess?.(verifyResponse);
          }
        } catch (error) {
          console.log('Payment Failure Data', error);
          onFailure?.(error);
        }
      },

      modal: {
        ondismiss: function () {
          onFailure?.({
            message: "Payment cancelled by user",
          });
        },
      },

      theme: {
        color: "#3399cc",
      },
    };

    const razorpay = new window.Razorpay(options);

    razorpay.open();
  } catch (error) {
    onFailure?.(error);
  }
};