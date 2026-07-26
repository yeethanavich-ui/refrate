"use client";

import { useEffect, useState } from "react";
import { supabase, Review, Referee } from "@/lib/supabaseClient";
import { useUser } from "@/lib/useUser";

export default function AdminPage() {
  const { userId, profile, loading: userLoading } = useUser();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [referees, setReferees] = useState<Referee[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadAll() {
    setLoading(true);
    const [{ data: reviewData }, { data: refData }] = await Promise.all([
      supabase.from("review").select("*").order("created_at", { ascending: false }),
      supabase.from("referees").select("*"),
    ]);
    setReviews(reviewData ?? []);
    setReferees(refData ?? []);
    setLoading(false);
  }

  useEffect(() => {
    if (profile?.is_admin) loadAll();
  }, [profile]);

  const refNameById = new Map(referees.map((r) => [r.id, r.name]));

  async function deleteReview(id: number) {
    if (!confirm("Delete this review permanently?")) return;
    await supabase.from("review").delete().eq("id", id);
    loadAll();
  }

  async function approveReview(id: number) {
    await supabase.from("review").update({ approved: true }).eq("id", id);
    loadAll();
  }

  async function deleteReferee(id: number) {
    if (!confirm("Delete this referee AND all their reviews permanently?")) return;
    await supabase.from("review").delete().eq("ref_id", id);
    await supabase.from("referees").delete().eq("id", id);
    loadAll();
  }

  if (userLoading) return null;

  if (!userId || !profile?.is_admin) {
    return (
      <p className="text-steel-400">
        You don&apos;t have access to this page.
      </p>
    );
  }

  return (
    <div className="space-y-10">
      <h1 className="font-display text-3xl text-steel-100">Admin</h1>

      <section className="space-y-4">
        <h2 className="font-display text-xl text-steel-100">
          Pending reviews ({reviews.filter((r) => !r.approved).length})
        </h2>
        {loading ? (
          <p className="text-steel-400">Loading...</p>
        ) : reviews.filter((r) => !r.approved).length === 0 ? (
          <p className="text-steel-400">Nothing waiting on approval.</p>
        ) : (
          <ul className="space-y-3">
            {reviews
              .filter((r) => !r.approved)
              .map((r) => (
                <li
                  key={r.id}
                  className="rounded-lg border border-touche/50 bg-piste-900 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-steel-100">
                        {refNameById.get(r.ref_id) || `Referee #${r.ref_id}`} —{" "}
                        {r.rating}★
                      </p>
                      <p className="text-sm text-steel-400">
                        by {r.reviewer_name || "Unknown"} ·{" "}
                        {new Date(r.created_at).toLocaleDateString()}
                      </p>
                      {r.comment && (
                        <p className="mt-1 text-steel-300">{r.comment}</p>
                      )}
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button
                        onClick={() => approveReview(r.id)}
                        className="rounded border border-green-600 px-3 py-1 text-sm text-green-500 hover:bg-green-600 hover:text-white"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => deleteReview(r.id)}
                        className="rounded border border-touche px-3 py-1 text-sm text-touche hover:bg-touche hover:text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-xl text-steel-100">
          Published reviews ({reviews.filter((r) => r.approved).length})
        </h2>
        {loading ? (
          <p className="text-steel-400">Loading...</p>
        ) : (
          <ul className="space-y-3">
            {reviews
              .filter((r) => r.approved)
              .map((r) => (
                <li
                  key={r.id}
                  className="rounded-lg border border-piste-700 bg-piste-900 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-steel-100">
                        {refNameById.get(r.ref_id) || `Referee #${r.ref_id}`} —{" "}
                        {r.rating}★
                      </p>
                      <p className="text-sm text-steel-400">
                        by {r.reviewer_name || "Unknown"} ·{" "}
                        {new Date(r.created_at).toLocaleDateString()}
                      </p>
                      {r.comment && (
                        <p className="mt-1 text-steel-300">{r.comment}</p>
                      )}
                    </div>
                    <button
                      onClick={() => deleteReview(r.id)}
                      className="shrink-0 rounded border border-touche px-3 py-1 text-sm text-touche hover:bg-touche hover:text-white"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-xl text-steel-100">
          All referees ({referees.length})
        </h2>
        <ul className="space-y-2">
          {referees.map((ref) => (
            <li
              key={ref.id}
              className="flex items-center justify-between rounded-lg border border-piste-700 bg-piste-900 p-3"
            >
              <span className="text-steel-100">
                {ref.name}{" "}
                <span className="text-sm text-steel-400">
                  ({ref.region})
                </span>
              </span>
              <button
                onClick={() => deleteReferee(ref.id)}
                className="rounded border border-touche px-3 py-1 text-sm text-touche hover:bg-touche hover:text-white"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
