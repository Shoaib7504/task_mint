import AuthPage from "@/components/auth/AuthPage";

export const metadata = {
  title: "Create account · TaskMint",
  description: "Create your TaskMint account and start earning",
};

export default function RegisterPage() {
  return <AuthPage mode="register" />;
}
