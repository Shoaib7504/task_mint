"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Coins, CheckCircle2, AlertCircle } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DataTable from "@/components/dashboard/DataTable";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosSecure } from "@/lib/axios";

export default function WorkerWithdrawalsPage() {
  const { user, refetch: refetchAuth } = useAuth();
  const queryClient = useQueryClient();
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const availableCoins = user?.coins ?? 0;

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({
    defaultValues: { coins: "200", paymentMethod: "PayPal", accountNumber: "" },
  });

  const coinsToWithdraw = Number(watch("coins") || 0);
  const dollarValue = (coinsToWithdraw / 20).toFixed(2);
  const hasEnough = coinsToWithdraw >= 200 && coinsToWithdraw <= availableCoins;

  const { data: withdrawals = [], isLoading } = useQuery({
    queryKey: ["myWithdrawals"],
    queryFn: async () => {
      const res = await axiosSecure.get("/withdrawals/my-withdrawals");
      return res.data?.withdrawals || [];
    },
  });

  const withdrawMutation = useMutation({
    mutationFn: async (data) => {
      return await axiosSecure.post("/withdrawals", {
        coins: Number(data.coins),
        paymentMethod: data.paymentMethod,
        accountNumber: data.accountNumber,
      });
    },
    onSuccess: async (res) => {
      setSuccessMsg(res.data?.message || "Withdrawal request submitted successfully!");
      reset({ coins: "200", paymentMethod: "PayPal", accountNumber: "" });
      await refetchAuth();
      queryClient.invalidateQueries({ queryKey: ["myWithdrawals"] });
      queryClient.invalidateQueries({ queryKey: ["workerStats"] });
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (err) => {
      setErrorMsg(err.response?.data?.message || "Failed to submit withdrawal request.");
    },
  });

  const historyRows = withdrawals.map((w) => [
    `$${w.amount.toFixed(2)}`,
    w.paymentMethod,
    w.accountNumber,
    new Date(w.createdAt).toLocaleDateString(),
    <StatusBadge
      tone={w.status === "APPROVED" ? "success" : w.status === "REJECTED" ? "danger" : "warning"}
      key={w.id}
    >
      {w.status}
    </StatusBadge>,
  ]);

  return (
    <>
      <DashboardHeader
        title="Withdraw earnings"
        subtitle="Turn available coins into real money."
      />
      <main className="mx-auto max-w-[1500px] space-y-6 p-4 md:p-8">
        {errorMsg && (
          <div className="flex items-center gap-2 rounded-lg bg-danger/10 p-4 text-sm text-danger border border-danger/20">
            <AlertCircle className="size-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="flex items-center gap-2 rounded-lg bg-success/10 p-4 text-sm text-success border border-success/20">
            <CheckCircle2 className="size-5 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[.8fr_1.2fr]">
          {/* Balance card */}
          <div className="space-y-4">
            <Card className="balance-card">
              <CardContent className="p-6">
                <p className="text-sm">Available Coins</p>
                <h2 className="mt-2 flex items-center gap-2 text-4xl font-bold">
                  <Coins className="size-8 text-amber-500" />
                  {availableCoins.toLocaleString()}
                </h2>
                <span className="mt-1 block text-sm">
                  Equivalent to ${(availableCoins / 20).toFixed(2)} USD
                </span>
                <p className="mt-2 text-xs opacity-70">
                  Rate: 20 coins = $1.00 USD (minimum 200 coins to withdraw)
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg">Request Payout</h3>
                <form
                  onSubmit={handleSubmit((d) => {
                    setErrorMsg("");
                    setSuccessMsg("");
                    withdrawMutation.mutate(d);
                  })}
                  className="mt-4 space-y-4"
                >
                  <div>
                    <Label htmlFor="coins">Coins to withdraw (min 200)</Label>
                    <Input
                      id="coins"
                      type="number"
                      min="200"
                      max={availableCoins}
                      className="mt-1"
                      {...register("coins", { required: true, min: 200 })}
                    />
                    <small className="text-muted-foreground block mt-1">
                      You will receive: <b>${dollarValue} USD</b>
                    </small>
                  </div>

                  <div>
                    <Label htmlFor="paymentMethod">Payment Method</Label>
                    <Select id="paymentMethod" className="mt-1" {...register("paymentMethod")}>
                      <option value="PayPal">PayPal</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Bkash">bKash</option>
                      <option value="Nagad">Nagad</option>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="accountNumber">Account / Wallet / Email</Label>
                    <Input
                      id="accountNumber"
                      placeholder="e.g. yourname@paypal.com or account number"
                      className="mt-1"
                      {...register("accountNumber", { required: "Account number is required" })}
                    />
                  </div>

                  <Button
                    className="w-full mt-2"
                    disabled={!hasEnough || withdrawMutation.isPending}
                  >
                    {withdrawMutation.isPending
                      ? "Processing..."
                      : !hasEnough
                      ? "Insufficient Coins (Min 200)"
                      : `Withdraw $${dollarValue} USD`}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* History */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4">Withdrawal History</h3>
              {isLoading ? (
                <p className="py-8 text-center text-sm text-muted-foreground">Loading withdrawal history...</p>
              ) : withdrawals.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">No withdrawal requests yet.</p>
              ) : (
                <DataTable
                  headers={["Amount", "Method", "Account", "Date", "Status"]}
                  rows={historyRows}
                  total={withdrawals.length}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
