"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Coins, CreditCard, ShieldCheck } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { coinPackages } from "@/lib/dashboardData";

export default function BuyerPurchaseCoinsPage() {
  const [selectedPkg, setSelectedPkg] = useState(500);
  const selected = coinPackages.find((p) => p.coins === selectedPkg) || coinPackages[0];

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { cardNumber: "", expiry: "", cvc: "", cardName: "" },
  });

  function onSubmit(data) {
    console.log("Purchase coins:", {
      package: selected,
      paymentDetails: data,
      message: `Payment of $${selected.price}.00 for ${selected.coins} coins`,
    });
    alert(`Payment of $${selected.price}.00 processed! ${selected.coins} coins added. Logged to console.`);
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
              className={`price-card ${selectedPkg === pkg.coins ? "selected" : ""}`}
            >
              {pkg.popular && <span>Most popular</span>}
              <Coins className="size-8" />
              <h3>{pkg.coins.toLocaleString()}</h3>
              <p>coins</p>
              <b className="text-lg">${pkg.price}</b>
              <small>${(pkg.price / pkg.coins).toFixed(3)} per coin</small>
            </button>
          ))}
        </div>

        {/* Checkout form */}
        <Card className="mx-auto max-w-2xl">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold">Secure checkout</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid gap-6 md:grid-cols-2">
              {/* Card fields */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardNumber">Card number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="4242 4242 4242 4242"
                    className="mt-1"
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
                      className="mt-1"
                      {...register("expiry", { required: "Required" })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvc">CVC</Label>
                    <Input
                      id="cvc"
                      placeholder="123"
                      className="mt-1"
                      {...register("cvc", { required: "Required" })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="cardName">Name on card</Label>
                  <Input
                    id="cardName"
                    placeholder="Alex Rivera"
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
                  <CreditCard className="size-4" />
                  {isSubmitting ? "Processing…" : "Pay securely"}
                </Button>
                <small>
                  <ShieldCheck className="inline size-3" /> Encrypted and securely processed
                </small>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
