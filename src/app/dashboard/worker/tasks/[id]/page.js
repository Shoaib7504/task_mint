"use client";

import { use, useState, useRef } from "react";
import { BriefcaseBusiness, CalendarDays, Coins, CheckCircle2, AlertCircle, Upload, Image as ImageIcon, X, RefreshCw, ExternalLink } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { Card, CardContent } from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosPublic, axiosSecure } from "@/lib/axios";
import { uploadProofImage } from "@/lib/imageUtils";
import { useRouter } from "next/navigation";

export default function TaskDetailPage({ params }) {
  const router = useRouter();
  const { id } = use(params);
  const queryClient = useQueryClient();
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [notes, setNotes] = useState("");
  const [fileError, setFileError] = useState("");
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const { data: task, isLoading, isError } = useQuery({
    queryKey: ["taskDetail", id],
    queryFn: async () => {
      const res = await axiosPublic.get(`/tasks/${id}`);
      return res.data?.task;
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (payload) => {
      return await axiosSecure.post("/submissions", {
        taskId: id,
        submissionDetails: payload.submissionDetails,
      });
    },
    onSuccess: () => {
      setSuccessMsg("Proof submitted successfully! Redirecting to your submissions...");
      queryClient.invalidateQueries({ queryKey: ["mySubmissions"] });
      queryClient.invalidateQueries({ queryKey: ["workerStats"] });
      setTimeout(() => {
        router.push("/dashboard/worker/submissions");
      }, 1200);
    },
    onError: (err) => {
      setErrorMsg(err.response?.data?.message || "Failed to submit proof. Please try again.");
    },
  });

  function handleFileSelect(file) {
    setFileError("");
    setErrorMsg("");

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFileError("Please select a valid image file (PNG, JPG, WEBP, GIF)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setFileError("File size exceeds 10MB limit. Please choose a smaller image.");
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) handleFileSelect(file);
  }

  function handleRemoveFile() {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setFileError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleSubmitProof(e) {
    e.preventDefault();
    setErrorMsg("");
    setFileError("");

    if (!selectedFile) {
      setFileError("Please upload an image screenshot as proof of task completion.");
      return;
    }

    try {
      setIsProcessingFile(true);
      const imageUrl = await uploadProofImage(selectedFile);

      // Package image proof and any notes into structured payload
      const submissionDetails = notes.trim()
        ? JSON.stringify({ image: imageUrl, notes: notes.trim() })
        : imageUrl;

      await submitMutation.mutateAsync({ submissionDetails });
    } catch (err) {
      console.error("Error processing proof submission:", err);
      setErrorMsg(err.message || "Failed to process image. Please try again.");
    } finally {
      setIsProcessingFile(false);
    }
  }

  if (isLoading) {
    return (
      <div className="py-24 text-center text-muted-foreground">Loading task details...</div>
    );
  }

  if (isError || !task) {
    return (
      <div className="py-24 text-center text-danger">Task not found or unavailable.</div>
    );
  }

  return (
    <>
      <DashboardHeader
        title="Task details"
        subtitle="Review requirements and submit your proof."
      />
      <main className="mx-auto max-w-[1500px] p-4 md:p-8">
        {errorMsg && (
          <div className="mb-6 flex items-center gap-2 rounded-lg bg-danger/10 p-4 text-sm text-danger border border-danger/20">
            <AlertCircle className="size-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-6 flex items-center gap-2 rounded-lg bg-success/10 p-4 text-sm text-success border border-success/20">
            <CheckCircle2 className="size-5 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          {/* Task info */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge>{task.category}</StatusBadge>
                  <StatusBadge tone="success">Verified buyer</StatusBadge>
                </div>

                <h2 className="mt-4 text-2xl font-bold">{task.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Published by <b>{task.buyer?.fullName}</b>
                </p>

                {/* Quick stats */}
                <div className="mt-6 grid grid-cols-2 gap-4 border-y border-border py-4 sm:grid-cols-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Reward</p>
                    <b className="mt-1 flex items-center gap-1 text-sm text-amber-500">
                      <Coins className="size-3.5" /> {task.payableAmount} coins
                    </b>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Remaining Slots</p>
                    <b className="mt-1 block text-sm">{task.requiredWorkers} slots</b>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Deadline</p>
                    <b className="mt-1 block text-sm">
                      {new Date(task.completionDate).toLocaleDateString()}
                    </b>
                  </div>
                </div>

                {/* Full details */}
                <div className="mt-6 space-y-5">
                  {/* Task Link / Destination */}
                  {task.taskLink && (
                    <div className="rounded-xl border border-primary/30 bg-primary/5 p-5 shadow-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                            <ExternalLink className="size-3.5" />
                            <span>Step 1: Open Task Link</span>
                          </div>
                          <p className="mt-1 text-sm font-semibold text-foreground">
                            Go to the external task destination to perform the requested actions:
                          </p>
                          <a
                            href={task.taskLink.startsWith("http") ? task.taskLink : `https://${task.taskLink}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1 inline-block text-xs text-primary hover:underline font-mono truncate max-w-full"
                          >
                            {task.taskLink}
                          </a>
                        </div>
                        <Button
                          size="default"
                          className="shrink-0 font-semibold gap-2 shadow-xs"
                          asChild
                        >
                          <a
                            href={task.taskLink.startsWith("http") ? task.taskLink : `https://${task.taskLink}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span>Go to Task</span>
                            <ExternalLink className="size-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      Description
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap">{task.detail}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      Proof Requirements
                    </h3>
                    <div className="mt-2 rounded-lg border border-border bg-accent/30 p-4 text-sm leading-relaxed whitespace-pre-wrap">
                      {task.submissionInfo}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Submission form sidebar */}
          <Card className="h-fit xl:sticky xl:top-24">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold">Submit Your Proof</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Follow the proof requirements carefully. Once approved, {task.payableAmount} coins will be credited to your account.
              </p>

              <form onSubmit={handleSubmitProof} className="mt-5 space-y-4">
                {/* File Upload Area */}
                <div>
                  <Label className="flex items-center justify-between text-sm font-medium">
                    <span>
                      Upload proof screenshot <span className="text-danger">*</span>
                    </span>
                    <span className="text-xs text-muted-foreground">PNG, JPG, WEBP</span>
                  </Label>

                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileSelect(e.target.files?.[0])}
                  />

                  {!previewUrl ? (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={handleDrop}
                      className={`mt-2 flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-all ${
                        isDragging
                          ? "border-primary bg-primary/10 scale-[0.99]"
                          : "border-border hover:border-primary/50 hover:bg-accent/40 bg-accent/15"
                      }`}
                    >
                      <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-3">
                        <Upload className="size-6" />
                      </div>
                      <p className="text-sm font-semibold text-foreground">
                        Click to upload or drag & drop image
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Screenshot or photo proof of completed task (up to 10MB)
                      </p>
                    </div>
                  ) : (
                    <div className="mt-2 overflow-hidden rounded-xl border border-border bg-card p-3 shadow-xs">
                      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black/5 dark:bg-white/5 border border-border">
                        <img
                          src={previewUrl}
                          alt="Proof preview"
                          className="h-full w-full object-contain"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveFile}
                          className="absolute top-2 right-2 rounded-full bg-black/70 p-1.5 text-white hover:bg-black transition-colors"
                          title="Remove image"
                        >
                          <X className="size-4" />
                        </button>
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-2 px-1">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-medium text-foreground">
                            {selectedFile?.name}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {selectedFile?.size ? `${(selectedFile.size / 1024).toFixed(1)} KB` : "Ready"}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-xs shrink-0"
                        >
                          <RefreshCw className="mr-1.5 size-3" />
                          Change
                        </Button>
                      </div>
                    </div>
                  )}

                  {fileError && (
                    <p className="mt-1.5 text-xs text-danger flex items-center gap-1">
                      <AlertCircle className="size-3.5" />
                      {fileError}
                    </p>
                  )}
                </div>

                {/* Additional notes / comments */}
                <div>
                  <Label htmlFor="notes" className="text-sm font-medium">
                    Additional notes / comments <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
                  </Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="mt-2 min-h-24 text-sm"
                    placeholder="Include transaction codes, account names, or context for the buyer..."
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full font-semibold"
                  size="lg"
                  disabled={
                    isProcessingFile ||
                    submitMutation.isPending ||
                    task.requiredWorkers <= 0
                  }
                >
                  {isProcessingFile
                    ? "Processing image..."
                    : submitMutation.isPending
                    ? "Submitting proof..."
                    : task.requiredWorkers <= 0
                    ? "No Slots Available"
                    : "Submit Proof Now"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
