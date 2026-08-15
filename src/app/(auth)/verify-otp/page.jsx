"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyOtpApi } from "@/services/auth.service";

function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSubmitting(true);

    try {
      await verifyOtpApi({
        email,
        otp,
      });

      router.push(
        `/reset-password?email=${encodeURIComponent(
          email
        )}&otp=${encodeURIComponent(otp)}`
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Invalid or expired OTP."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-50 px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-md p-8">

        <h1 className="text-2xl font-semibold text-emerald-800 mb-2 text-center">
          Verify OTP
        </h1>

        <p className="text-sm text-gray-500 text-center mb-6">
          Enter the 6-digit code sent to{" "}
          <strong>{email}</strong>
        </p>

        {error && (
          <p className="bg-red-50 text-red-600 text-sm rounded-lg px-3 py-2 mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              OTP
            </label>

            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              required
              className="w-full text-gray-800 border border-gray-300 rounded-lg px-3 py-2 text-center tracking-widest text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-emerald-600 text-white rounded-lg py-2 font-medium hover:bg-emerald-700 transition disabled:opacity-60"
          >
            {submitting ? "Verifying..." : "Verify OTP"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-emerald-50">
          <p className="text-emerald-700">
            Loading...
          </p>
        </div>
      }
    >
      <VerifyOtpForm />
    </Suspense>
  );
}