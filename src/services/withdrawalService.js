import { axiosSecure } from "@/lib/axios";

/**
 * Withdrawal Service
 * 
 * Helper functions for worker coin withdrawals and admin approvals.
 */
export const withdrawalService = {
  // Worker: Request a coin withdrawal
  requestWithdrawal: async ({ coins, paymentMethod, accountNumber }) => {
    const res = await axiosSecure.post("/withdrawals", {
      coins: Number(coins),
      paymentMethod,
      accountNumber,
    });
    return res.data;
  },

  // Worker: Get my withdrawal history
  getMyWithdrawals: async () => {
    const res = await axiosSecure.get("/withdrawals/my-withdrawals");
    return res.data;
  },

  // Admin: Get all pending/completed withdrawals
  getAllWithdrawals: async () => {
    const res = await axiosSecure.get("/withdrawals");
    return res.data;
  },

  // Admin: Approve a withdrawal
  approveWithdrawal: async (id) => {
    const res = await axiosSecure.patch(`/withdrawals/${id}/approve`);
    return res.data;
  },
};

export default withdrawalService;
