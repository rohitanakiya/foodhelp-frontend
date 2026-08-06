import { useState } from "react";
import { CheckCircle2, Loader2, X } from "lucide-react";
import { useResetPassword } from "@/lib/auth";
import { cn } from "@/lib/utils";

interface ResetPasswordModalProps {
  open: boolean;
  token: string;
  onClose: () => void;
}

export function ResetPasswordModal({ open, token, onClose }: ResetPasswordModalProps) {
  const [password, setPassword] = useState("");
  const [confirmed, setConfirmed] = useState("");
  const mutation = useResetPassword();

  if (!open) return null;

  const passwordsMatch = password.length >= 8 && password === confirmed;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordsMatch) return;
    mutation.mutate({ token, password });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Set a new password
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Choose a password at least 8 characters long.
        </p>

        {mutation.isSuccess ? (
          <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-200">
            <div className="mb-1 flex items-center gap-2 font-medium">
              <CheckCircle2 className="h-4 w-4" />
              Password updated
            </div>
            <p>You can now log in with your new password.</p>
            <button
              type="button"
              className="mt-3 text-xs font-medium text-emerald-700 hover:underline dark:text-emerald-300"
              onClick={onClose}
            >
              Continue
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-5 space-y-3">
            <input
              type="password"
              required
              minLength={8}
              placeholder="New password (min 8 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-emerald-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
            />
            <input
              type="password"
              required
              minLength={8}
              placeholder="Confirm new password"
              value={confirmed}
              onChange={(e) => setConfirmed(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-emerald-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
            />

            {password.length > 0 &&
              confirmed.length > 0 &&
              password !== confirmed && (
                <p className="text-xs text-red-600 dark:text-red-400">
                  Passwords don't match.
                </p>
              )}

            {mutation.error && (
              <p className="text-xs text-red-600 dark:text-red-400">
                {(mutation.error as Error).message}
              </p>
            )}

            <button
              type="submit"
              disabled={mutation.isPending || !passwordsMatch}
              className={cn(
                "flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition",
                "bg-emerald-600 text-white hover:bg-emerald-700",
                "disabled:cursor-not-allowed disabled:bg-gray-300 dark:disabled:bg-gray-700"
              )}
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating password
                </>
              ) : (
                "Update password"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
