import { axiosSecure } from "@/lib/axios";

/**
 * Submission Service
 * 
 * Simple helper functions for Submissions (worker tasks submitted & buyer reviews).
 */
export const submissionService = {
  // Worker: Submit completed task work with proofs
  createSubmission: async (payload) => {
    const res = await axiosSecure.post("/submissions", payload);
    return res.data;
  },

  // Worker: Get my submitted tasks
  getMySubmissions: async () => {
    const res = await axiosSecure.get("/submissions/my-submissions");
    return res.data;
  },

  // Buyer: Get submissions pending review for my tasks
  getBuyerPendingReviews: async () => {
    const res = await axiosSecure.get("/submissions/buyer/reviews?status=PENDING");
    return res.data;
  },

  // Buyer: Approve a worker submission (releases coins to worker)
  approveSubmission: async (submissionId) => {
    const res = await axiosSecure.patch(`/submissions/${submissionId}/approve`);
    return res.data;
  },

  // Buyer: Reject a worker submission
  rejectSubmission: async (submissionId) => {
    const res = await axiosSecure.patch(`/submissions/${submissionId}/reject`);
    return res.data;
  },
};

export default submissionService;
