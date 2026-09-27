import { axiosSecure } from "@/lib/axios";

/**
 * User Service
 * 
 * Helper functions for user management (Profile & Admin User Operations).
 */
export const userService = {
  // Get current user profile (/auth/me)
  getCurrentUser: async () => {
    const res = await axiosSecure.get("/auth/me");
    return res.data;
  },

  // Update profile details
  updateProfile: async (profileData) => {
    const res = await axiosSecure.put("/users/profile", profileData);
    return res.data;
  },

  // Admin: Get all users with optional search query
  getAllUsers: async (params = {}) => {
    const res = await axiosSecure.get("/users", { params });
    return res.data;
  },

  // Admin: Update user's role (e.g. WORKER -> BUYER -> ADMIN)
  updateUserRole: async (id, role) => {
    const res = await axiosSecure.patch(`/users/${id}/role`, { role });
    return res.data;
  },

  // Admin: Delete a user
  deleteUser: async (id) => {
    const res = await axiosSecure.delete(`/users/${id}`);
    return res.data;
  },
};

export default userService;
