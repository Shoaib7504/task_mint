import { axiosPublic, axiosSecure } from "@/lib/axios";

/**
 * Task Service
 * 
 * Simple helper functions for Task API endpoints.
 * Junior devs can import these instead of writing manual Axios URLs.
 */
export const taskService = {
  // Get all public tasks (accessible without login)
  getAllTasks: async (params = {}) => {
    const res = await axiosPublic.get("/tasks", { params });
    return res.data;
  },

  // Get a single task by ID
  getTaskById: async (id) => {
    const res = await axiosPublic.get(`/tasks/${id}`);
    return res.data;
  },

  // Buyer: Get my own posted tasks
  getMyTasks: async () => {
    const res = await axiosSecure.get("/tasks/buyer/my-tasks");
    return res.data;
  },

  // Buyer: Create a new task
  createTask: async (taskData) => {
    const res = await axiosSecure.post("/tasks", taskData);
    return res.data;
  },

  // Buyer: Update an existing task
  updateTask: async (id, taskData) => {
    const res = await axiosSecure.put(`/tasks/${id}`, taskData);
    return res.data;
  },

  // Buyer: Delete a task
  deleteTask: async (id) => {
    const res = await axiosSecure.delete(`/tasks/${id}`);
    return res.data;
  },
};

export default taskService;
