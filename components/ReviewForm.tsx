"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export function ReviewForm({
  refId,
  onSubmitted,
}: {
  refId: number;
  onSubmitted: () => void;
}) {
  const [reviewerName, setReviewerName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      let eventId: number | null = null;

      // If they named an event, find it or create it (first-review-creates-the-event pattern)
      if (eventName.trim()) {
        const { data: existing } = await supabase
          .from("Events")
          .select("id")
          .eq("name", eventName.trim())
          .maybeSingle();

        if (existing) {
          eventId = existing.id;
        } else {
          const { data: created, error: createErr } = await supabase
            .from("Events")
            .insert({
              name: eventName.trim(),
              date: eventDate || null,
              location: null,
            })
            .select("id")
            .single();
          if (createErr) throw createErr;
          eventId = created.id;
        }
      }

      const { error: insertErr } = await supabase.from("review").insert({
        ref_id: refId,
        event_id: eventId,
        reviewer_name: reviewerName.trim() || "Anonymous",
        rating,
        comment: comment.trim() || null,
        date: eventDate || null,
      });

      if (insertErr) throw insertErr;

      setReviewerName("");
      setRating(5);
      setComment("");
      setEventName("");
      setEventDate("");
      onSubmitted();
    } catch (err: any) {
      setError(err.message ?? "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-lg border border-piste-700 bg-piste-900 p-6"
    >
      <h3 className="font-display text-lg text-steel-100">Leave a review</h3>

      <div>
        <label className="mb-1 block text-sm text-steel-300">
          Your name (optional)
        </label>
        <input
          value={reviewerName}
          onChange={(e) => setReviewerName(e.target.value)}
          className="w-full rounded border border-piste-700 bg-piste-950 px-3 py-2 text-steel-100"
          placeholder="Anonymous"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-steel-300">
          Tournament / event name
        </label>
        <input
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          className="w-full rounded border border-piste-700 bg-piste-950 px-3 py-2 text-steel-100"
          placeholder="e.g. Midwest RJCC 2026"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-steel-300">
          Event date
        </label>
        <input
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          className="w-full rounded border border-piste-700 bg-piste-950 px-3 py-2 text-steel-100"
        />
      </div>

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
          placeholder="Rule knowledge, fairness, pace, communication..."
        />
      </div>

      {error && <p className="text-sm text-touche">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="rounded bg-touche px-4 py-2 font-medium text-white hover:bg-touche-dim disabled:opacity-50"
      >
        {submitting ? "Submitting..." : "Submit review"}
      </button>
    </form>
  );
}
