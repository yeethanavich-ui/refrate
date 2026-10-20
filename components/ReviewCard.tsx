"use client";

import { useState } from "react";
import { supabase, Review } from "@/lib/supabaseClient";
import { StarRating } from "@/components/StarRating";

export function ReviewCard({
  review,
  canEdit,
  isAdmin,
  onChanged,
}: {
  review: Review;
  canEdit: boolean;
  isAdmin: boolean;
  onChanged: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [rating, setRating] = useState(review.rating);
  const [comment, setComment] = useState(review.comment ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const { error: updateErr } = await supabase
      .from("review")
      .update({ rating, comment: comment.trim() || null })
      .eq("id", review.id);

    setSaving(false);

    if (updateErr) {
      setError(updateErr.message);
      return;
    }
    setEditing(false);
    onChanged();
  }

  function handleCancel() {
    setRating(review.rating);
    setComment(review.comment ?? "");
    setError(null);
    setEditing(false);
  }

  if (editing) {
    return (
      <form
        onSubmit={handleSave}
        className="space-y-3 rounded-lg border border-touche/60 bg-piste-900 p-5"
      >
        <div>
          <label className="mb-1 block text-sm text-steel-300">Rating</label>
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-full rounded border border-piste-700 bg-piste-950 px-3 py-2 text-steel-100"
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} star{n > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm text-steel-300">Comment</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full rounded border border-piste-700 bg-piste-950 px-3 py-2 text-steel-100"
          />
        </div>

        {!isAdmin && (
          <p className="text-xs text-steel-400">
            After you save, this review goes back to pending approval before
            it shows publicly again.
          </p>
        )}

        {error && <p className="text-sm text-touche">{error}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded bg-touche px-4 py-2 text-sm font-medium text-white hover:bg-touche-dim disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="rounded px-4 py-2 text-sm text-steel-400 hover:text-steel-200"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="rounded-lg border border-piste-700 bg-piste-900 p-5">
      <div className="flex items-center justify-between">
        <StarRating value={review.rating} />
        <span className="text-xs text-steel-400">
          {review.date ?? new Date(review.created_at).toLocaleDateString()}
        </span>
      </div>

      {review.comment && (
        <p className="mt-2 text-steel-200">{review.comment}</p>
      )}

      <div className="mt-2 flex items-center justify-between">
        <p className="text-sm text-steel-400">
          — {review.reviewer_name || "Anonymous"}
          {!review.approved && (
            <span className="ml-2 rounded border border-touche/60 px-2 py-0.5 text-xs text-touche">
              Pending approval
            </span>
          )}
        </p>
        {canEdit && (
          <button
            onClick={() => setEditing(true)}
            className="text-sm text-steel-400 hover:text-touche"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
}
