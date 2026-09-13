import AuthPage from "@/components/auth/AuthPage";

export const metadata = {
  title: "Sign in · TaskMint",
  description: "Sign in to your TaskMint account",
};

export default function LoginPage() {
  return <AuthPage mode="login" />;
}
