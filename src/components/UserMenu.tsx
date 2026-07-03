import { useState } from "react";
import { LogOut, User } from "lucide-react";
import { useCurrentUser, useLogout } from "@/lib/auth";

export function UserMenu() {
  const { data: user } = useCurrentUser();
  const logout = useLogout();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  const initials = user.email.slice(0, 2).toUpperCase();

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="User menu"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-xs font-semibold text-white transition hover:bg-emerald-700"
      >
        {initials}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-11 z-50 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900">
            <div className="border-b border-gray-100 px-3 py-2.5 dark:border-gray-800">
              <p className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <User className="h-3 w-3" />
                Signed in as
              </p>
              <p className="mt-0.5 truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                {user.email}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                logout();
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
