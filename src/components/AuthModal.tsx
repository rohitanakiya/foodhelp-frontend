import { useState } from "react";
import { Loader2, X } from "lucide-react";
import { useLogin, useSignup } from "@/lib/auth";
import { cn } from "@/lib/utils";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  initialMode?: "login" | "signup";
}

export function AuthModal({ open, onClose, initialMode = "login" }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useLogin();
  const signupMutation = useSignup();
  const active = mode === "login" ? loginMutation : signupMutation;

  if (!open) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "login") {
      loginMutation.mutate(
        { email, password },
        { onSuccess: () => onClose() }
      );
    } else {
      signupMutation.mutate(
        { email, password },
        { onSuccess: () => onClose() }
      );
    }
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
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {mode === "login"
            ? "Log in to connect your Swiggy account."
            : "Sign up to connect Swiggy and get real recommendations."}
        </p>

        <form onSubmit={submit} className="mt-5 space-y-3">
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-emerald-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
          />
          <input
            type="password"
            required
            minLength={8}
            placeholder="Password (min 8 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-emerald-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
          />

          {active.error && (
            <p className="text-xs text-red-600 dark:text-red-400">
              {(active.error as Error).message}
            </p>
          )}

          <button
            type="submit"
            disabled={active.isPending || !email || !password}
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition",
              "bg-emerald-600 text-white hover:bg-emerald-700",
              "disabled:cursor-not-allowed disabled:bg-gray-300 dark:disabled:bg-gray-700"
            )}
          >
            {active.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {mode === "login" ? "Logging in" : "Creating account"}
              </>
            ) : mode === "login" ? (
              "Log in"
            ) : (
              "Sign up"
            )}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
          {mode === "login" ? "New here?" : "Already have an account?"}{" "}
          <button
            type="button"
            className="font-medium text-emerald-600 hover:underline dark:text-emerald-400"
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
          >
            {mode === "login" ? "Create one" : "Log in"}
          </button>
        </p>
      </div>
    </div>
  );
}
