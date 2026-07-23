"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase, Referee, Review } from "@/lib/supabaseClient";
import { StarRating } from "@/components/StarRating";
import { ReviewForm } from "@/components/ReviewForm";

export default function RefereeProfilePage() {
  const params = useParams();
  const refId = Number(params.id);

  const [referee, setReferee] = useState<Referee | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    setLoading(true);
    const [{ data: refData }, { data: reviewData }] = await Promise.all([
      supabase.from("Refrees").select("*").eq("id", refId).single(),
      supabase
        .from("review")
        .select("*")
        .eq("ref_id", refId)
        .order("created_at", { ascending: false }),
    ]);
    setReferee(refData);
    setReviews(reviewData ?? []);
    setLoading(false);
  }

  useEffect(() => {
    if (refId) loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refId]);

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  if (loading) return <p className="text-steel-400">Loading...</p>;
  if (!referee) return <p className="text-steel-400">Referee not found.</p>;

  return (
    <div className="space-y-8">
      <Link href="/" className="text-sm text-steel-400 hover:text-touche">
        ← Back to search
      </Link>

      <div>
        <h1 className="font-display text-3xl text-steel-100">
          {referee.name}
        </h1>
        <p className="mt-1 text-steel-400">
          {referee.region || "Region unknown"}
          {referee.certification_level
            ? ` · ${referee.certification_level}`
            : ""}
        </p>
        <div className="mt-3 flex items-center gap-2">
          <StarRating value={avgRating} />
          <span className="text-steel-300">
            {avgRating > 0 ? avgRating.toFixed(1) : "No ratings yet"} (
            {reviews.length} review{reviews.length !== 1 ? "s" : ""})
          </span>
        </div>
      </div>

      <ReviewForm refId={refId} onSubmitted={loadData} />

      <div className="space-y-4">
        <h2 className="font-display text-xl text-steel-100">Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-steel-400">
            No reviews yet. Be the first to leave one.
          </p>
        ) : (
          reviews.map((r) => (
            <div
              key={r.id}
              className="rounded-lg border border-piste-700 bg-piste-900 p-5"
            >
              <div className="flex items-center justify-between">
                <StarRating value={r.rating} />
                <span className="text-xs text-steel-400">
                  {r.date ?? new Date(r.created_at).toLocaleDateString()}
                </span>
              </div>
              {r.comment && (
                <p className="mt-2 text-steel-200">{r.comment}</p>
              )}
              <p className="mt-2 text-sm text-steel-400">
                — {r.reviewer_name || "Anonymous"}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
