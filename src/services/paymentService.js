import { axiosSecure } from "@/lib/axios";

/**
 * Payment Service
 * 
 * Helper functions for purchasing coins and viewing payment history.
 */
export const paymentService = {
  // Buyer: Checkout to purchase coins
  purchaseCoins: async ({ coins, amount, cardLast4 }) => {
    const res = await axiosSecure.post("/payments/fake-checkout", {
      coins,
      amount,
      cardLast4,
    });
    return res.data;
  },

  // Buyer: Get payment transaction history
  getPaymentHistory: async () => {
    const res = await axiosSecure.get("/payments/history");
    return res.data;
  },
};

export default paymentService;
