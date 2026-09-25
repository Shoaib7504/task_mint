"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { CheckCircle2, Coins, CreditCard, ShieldCheck } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogBody, DialogFooter } from "@/components/ui/Dialog";
import { coinPackages } from "@/lib/dashboardData";
import { axiosSecure } from "@/lib/axios";
import { useAuth } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";

export default function BuyerPurchaseCoinsPage() {
  const [selectedPkg, setSelectedPkg] = useState(500);
  const [successReceipt, setSuccessReceipt] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const { user, refetch } = useAuth();
  const queryClient = useQueryClient();

  const selected = coinPackages.find((p) => p.coins === selectedPkg) || coinPackages[0];

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { cardNumber: "4242 4242 4242 4242", expiry: "12/28", cvc: "123", cardName: "Buyer Account" },
  });

  async function onSubmit(data) {
    setErrorMsg("");
    try {
      const res = await axiosSecure.post("/payments/fake-checkout", {
        coins: selected.coins,
        amount: selected.price,
        cardLast4: data.cardNumber.replace(/\s/g, "").slice(-4) || "4242",
      });

      if (res.data?.success) {
        setSuccessReceipt({
          coins: selected.coins,
          price: selected.price,
          transactionId: res.data.payment?.transactionId || "TXN-SUCCESS",
          balance: res.data.currentCoins,
        });

        // Invalidate caches so coin counts and tables update everywhere
        await refetch();
        queryClient.invalidateQueries({ queryKey: ["authUser"] });
        queryClient.invalidateQueries({ queryKey: ["paymentHistory"] });
        queryClient.invalidateQueries({ queryKey: ["buyerStats"] });
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
      }
    } catch (err) {
      console.error("Payment error:", err);
      setErrorMsg(err.response?.data?.message || "Failed to process coin purchase. Please try again.");
    }
  }

  return (
    <>
      <DashboardHeader
        title="Purchase coins"
        subtitle="Choose a package and fund your next task."
      />
      <main className="mx-auto max-w-[1500px] space-y-6 p-4 md:p-8">
        {/* Package grid */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {coinPackages.map((pkg) => (
            <button
              key={pkg.coins}
              onClick={() => setSelectedPkg(pkg.coins)}
              className={`price-card ${selectedPkg === pkg.coins ? "selected ring-2 ring-primary" : ""}`}
            >
              {pkg.popular && <span>Most popular</span>}
              <Coins className="size-8 text-amber-500" />
              <h3>{pkg.coins.toLocaleString()}</h3>
              <p>coins</p>
              <b className="text-lg">${pkg.price}</b>
              <small>${(pkg.price / pkg.coins).toFixed(3)} per coin</small>
            </button>
          ))}
        </div>

        {errorMsg && (
          <div className="mx-auto max-w-2xl rounded-lg bg-danger/10 p-3 text-sm text-danger border border-danger/20 text-center">
            {errorMsg}
          </div>
        )}

        {/* Checkout form */}
        <Card className="mx-auto max-w-2xl">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold">Simulated Instant Checkout</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Select any package above and confirm mock payment to instantly credit coins to your balance.
            </p>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid gap-6 md:grid-cols-2">
              {/* Card fields */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardNumber">Card number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="4242 4242 4242 4242"
                    className="mt-1 font-mono"
                    {...register("cardNumber", { required: "Card number is required" })}
                  />
                  {errors.cardNumber && <p className="mt-1 text-xs text-danger">{errors.cardNumber.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="expiry">Expiry</Label>
                    <Input
                      id="expiry"
                      placeholder="MM / YY"
                      className="mt-1 font-mono"
                      {...register("expiry", { required: "Required" })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvc">CVC</Label>
                    <Input
                      id="cvc"
                      placeholder="123"
                      className="mt-1 font-mono"
                      {...register("cvc", { required: "Required" })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="cardName">Name on card</Label>
                  <Input
                    id="cardName"
                    placeholder="Buyer Name"
                    className="mt-1"
                    {...register("cardName", { required: "Required" })}
                  />
                </div>
              </div>

              {/* Order summary */}
              <div className="checkout-summary">
                <p className="font-semibold">Order summary</p>
                <div>
                  <span>{selected.coins.toLocaleString()} TaskMint coins</span>
                  <b>${selected.price}.00</b>
                </div>
                <div>
                  <span>Processing fee</span>
                  <b>$0.00</b>
                </div>
                <div className="total">
                  <span>Total</span>
                  <b>${selected.price}.00</b>
                </div>
                <Button className="w-full" size="lg" disabled={isSubmitting}>
                  <CreditCard className="size-4 mr-2" />
                  {isSubmitting ? "Processing Payment..." : `Pay $${selected.price}.00 & Get Coins`}
                </Button>
                <small>
                  <ShieldCheck className="inline size-3 mr-1" /> Encrypted & Instant Simulated Checkout
                </small>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>

      {/* Confirmation Modal */}
      {successReceipt && (
        <Dialog open={true} onOpenChange={() => setSuccessReceipt(null)}>
          <DialogHeader>
            <div className="flex items-center gap-2 text-success">
              <CheckCircle2 className="size-6" />
              <DialogTitle>Payment Confirmed!</DialogTitle>
            </div>
            <DialogDescription>
              Your payment has been successfully recorded and coins have been added to your balance.
            </DialogDescription>
          </DialogHeader>
          <DialogBody className="space-y-3 py-4 text-sm">
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-muted-foreground">Transaction ID:</span>
              <b className="font-mono text-xs">{successReceipt.transactionId}</b>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-muted-foreground">Coins Credited:</span>
              <b className="text-amber-500 font-bold">+{successReceipt.coins.toLocaleString()} coins</b>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-muted-foreground">Amount Paid:</span>
              <b>${successReceipt.price}.00</b>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-muted-foreground">New Total Balance:</span>
              <b className="text-primary font-bold">{successReceipt.balance?.toLocaleString()} coins</b>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button onClick={() => setSuccessReceipt(null)} className="w-full">
              Done & Return
            </Button>
          </DialogFooter>
        </Dialog>
      )}
    </>
  );
}
