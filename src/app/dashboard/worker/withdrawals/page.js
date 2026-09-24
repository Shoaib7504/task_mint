"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { CheckCircle2, Coins, ShieldCheck } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatCard from "@/components/dashboard/StatCard";
import DataTable from "@/components/dashboard/DataTable";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

const AVAILABLE_COINS = 2480;

export default function WorkerWithdrawalsPage() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: { coins: "500", paymentMethod: "paypal", accountNumber: "" },
  });

  const coinsToWithdraw = Number(watch("coins") || 0);
  const dollarValue = (coinsToWithdraw / 20).toFixed(2);
  const hasEnough = coinsToWithdraw >= 200 && coinsToWithdraw <= AVAILABLE_COINS;

  function onSubmit(data) {
    console.log("Withdrawal request:", {
      workerEmail: "worker@example.com",
      workerName: "Worker",
      withdrawalCoin: Number(data.coins),
      withdrawalAmount: (Number(data.coins) / 20).toFixed(2),
      paymentSystem: data.paymentMethod,
      accountNumber: data.accountNumber,
      withdrawDate: new Date().toISOString(),
      status: "pending",
    });
    alert("Withdrawal request logged to console!");
  }

  const historyRows = [
    ["$120.00", "PayPal", "a•••@mail.com", "Aug 24, 2026", <StatusBadge tone="success" key="1">Paid</StatusBadge>],
    ["$84.00", "Bank transfer", "•••• 4912", "Jul 18, 2026", <StatusBadge tone="success" key="2">Paid</StatusBadge>],
  ];

  return (
    <>
      <DashboardHeader
        title="Withdraw earnings"
        subtitle="Turn available coins into money."
      />
      <main className="mx-auto max-w-[1500px] space-y-6 p-4 md:p-8">
        <div className="grid gap-6 xl:grid-cols-[.8fr_1.2fr]">
          {/* Balance + quick stats */}
          <div className="space-y-4">
            <Card className="balance-card">
              <CardContent className="p-6">
                <p className="text-sm">Available coins</p>
                <h2 className="mt-2 flex items-center gap-2 text-4xl font-bold">
                  <Coins className="size-8" />
                  {AVAILABLE_COINS.toLocaleString()}
                </h2>
                <span className="mt-1 block text-sm">
                  Equivalent to ${(AVAILABLE_COINS / 20).toFixed(2)}
                </span>
                <p className="mt-2 text-xs opacity-70">
                  20 coins = $1.00 (worker rate)
                </p>
              </CardContent>
            </Card>
            <div className="grid grid-cols-2 gap-4">
              <StatCard label="Minimum withdrawal" value="200" change="$10.00" icon={ShieldCheck} />
              <StatCard label="Previously withdrawn" value="$1,240" change="12 payouts" icon={CheckCircle2} tone="success" />
            </div>
          </div>

          {/* Withdrawal form */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold">Request withdrawal</h3>
              <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-5">
                <div>
                  <Label htmlFor="coins">Coins to withdraw</Label>
                  <Input
                    id="coins"
                    type="number"
                    min="200"
                    max={AVAILABLE_COINS}
                    className="mt-2"
                    {...register("coins", {
                      required: "Enter coins to withdraw",
                      min: { value: 200, message: "Minimum 200 coins" },
                      max: { value: AVAILABLE_COINS, message: `Cannot exceed ${AVAILABLE_COINS}` },
                    })}
                  />
                  {errors.coins && (
                    <p className="mt-1 text-xs text-danger">{errors.coins.message}</p>
                  )}
                </div>

                {/* Calculated value */}
                <div className="calculation">
                  <span>You'll receive</span>
                  <b>${dollarValue}</b>
                  <small>20 coins = $1.00</small>
                </div>

                <div>
                  <Label htmlFor="paymentMethod">Payment method</Label>
                  <Select id="paymentMethod" className="mt-2" {...register("paymentMethod")}>
                    <option value="paypal">PayPal</option>
                    <option value="stripe">Stripe</option>
                    <option value="bkash">bKash</option>
                    <option value="rocket">Rocket</option>
                    <option value="nagad">Nagad</option>
                    <option value="bank">Bank transfer</option>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="accountNumber">Account number</Label>
                  <Input
                    id="accountNumber"
                    placeholder="Payment account"
                    className="mt-2"
                    {...register("accountNumber", { required: "Account number is required" })}
                  />
                  {errors.accountNumber && (
                    <p className="mt-1 text-xs text-danger">{errors.accountNumber.message}</p>
                  )}
                </div>

                {coinsToWithdraw < 200 ? (
                  <p className="text-sm font-semibold text-danger">
                    Insufficient coins. Minimum withdrawal is 200 coins ($10.00).
                  </p>
                ) : (
                  <Button className="w-full" size="lg" disabled={!hasEnough}>
                    Withdraw coins
                  </Button>
                )}
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Withdrawal history */}
        <DataTable
          headers={["Amount", "Payment method", "Account", "Date", "Status"]}
          rows={historyRows}
          total={2}
        />
      </main>
    </>
  );
}
