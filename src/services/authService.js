import { auth, googleProvider, signInWithPopup } from "@/lib/firebase";
import { axiosPublic } from "@/lib/axios";

/**
 * Perform Google sign-in using Firebase popup and exchange profile with backend
 * @param {string} role - Preferred role ("WORKER" or "BUYER") if this is a new registration
 */
export async function loginWithGoogle(role = "WORKER") {
  // 1. Trigger Firebase popup
  const result = await signInWithPopup(auth, googleProvider);
  const fbUser = result.user;

  if (!fbUser || !fbUser.email) {
    throw new Error("Could not retrieve email from Google sign-in.");
  }

  // 2. Post to TaskMint backend
  const payload = {
    email: fbUser.email,
    fullName: fbUser.displayName || fbUser.email.split("@")[0],
    photoUrl: fbUser.photoURL || null,
    role: role ? role.toUpperCase() : "WORKER",
  };

  const res = await axiosPublic.post("/auth/google", payload);
  const data = res.data;

  const token =
    data?.token ||
    data?.data?.token ||
    data?.accessToken ||
    data?.data?.accessToken;

  if (token && typeof window !== "undefined") {
    localStorage.setItem("access-token", token);
    localStorage.setItem("token", token);
    window.dispatchEvent(new Event("auth-change"));
  }

  return data;
}

const authService = {
  loginWithGoogle,
};

export default authService;
