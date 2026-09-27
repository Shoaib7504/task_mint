/**
 * API Services Index
 * 
 * Central export for all modular backend services.
 * 
 * @example
 * import { taskService, userService } from "@/services/api";
 */

import authService from "./authService";
import taskService from "./taskService";
import submissionService from "./submissionService";
import withdrawalService from "./withdrawalService";
import paymentService from "./paymentService";
import userService from "./userService";

export {
  authService,
  taskService,
  submissionService,
  withdrawalService,
  paymentService,
  userService,
};

const api = {
  auth: authService,
  tasks: taskService,
  submissions: submissionService,
  withdrawals: withdrawalService,
  payments: paymentService,
  users: userService,
};

export default api;
