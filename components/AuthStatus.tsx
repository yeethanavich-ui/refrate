"use client";

import Link from "next/link";
import { useUser } from "@/lib/useUser";
import { supabase } from "@/lib/supabaseClient";

export function AuthStatus() {
  const { userId, profile, loading } = useUser();

  if (loading) return null;

  if (!userId) {
    return (
      <div className="flex gap-4 text-sm text-steel-300">
        <Link href="/login" className="hover:text-touche">
          Log in
        </Link>
        <Link href="/signup" className="hover:text-touche">
          Sign up
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 text-sm text-steel-300">
      <span>{profile?.display_name || profile?.usa_fencing_number || "Account"}</span>
      <button
        onClick={() => supabase.auth.signOut()}
        className="hover:text-touche"
      >
        Log out
      </button>
    </div>
  );
}
