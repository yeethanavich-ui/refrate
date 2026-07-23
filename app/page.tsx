"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase, Referee } from "@/lib/supabaseClient";

export default function HomePage() {
  const [referees, setReferees] = useState<Referee[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newRegion, setNewRegion] = useState("");
  const [newLevel, setNewLevel] = useState("");

  async function loadReferees() {
    setLoading(true);
    const { data } = await supabase
      .from("Refrees")
      .select("*")
      .order("name", { ascending: true });
    setReferees(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadReferees();
  }, []);

  const filtered = referees.filter((r) =>
    r.name.toLowerCase().includes(query.toLowerCase())
  );

  async function handleAddReferee(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    await supabase.from("Refrees").insert({
      name: newName.trim(),
      region: newRegion.trim() || null,
      certification_level: newLevel.trim() || null,
    });
    setNewName("");
    setNewRegion("");
    setNewLevel("");
    setShowAddForm(false);
    loadReferees();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-steel-100">
          Find a referee
        </h1>
        <p className="mt-1 text-steel-400">
          Search by name, or add one who's not listed yet.
        </p>
      </div>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search referee name..."
        className="w-full rounded border border-piste-700 bg-piste-900 px-4 py-3 text-steel-100 placeholder:text-steel-400"
      />

      {loading ? (
        <p className="text-steel-400">Loading referees...</p>
      ) : filtered.length === 0 ? (
        <p className="text-steel-400">
          No referees found. Add the one you're looking for below.
        </p>
      ) : (
        <ul className="divide-y divide-piste-800 rounded-lg border border-piste-700 bg-piste-900">
          {filtered.map((ref) => (
            <li key={ref.id}>
              <Link
                href={`/referees/${ref.id}`}
                className="flex items-center justify-between px-5 py-4 hover:bg-piste-800"
              >
                <div>
                  <p className="text-steel-100">{ref.name}</p>
                  <p className="text-sm text-steel-400">
                    {ref.region || "Region unknown"}
                    {ref.certification_level
                      ? ` · ${ref.certification_level}`
                      : ""}
                  </p>
                </div>
                <span className="text-touche">View →</span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div>
        {!showAddForm ? (
          <button
            onClick={() => setShowAddForm(true)}
            className="rounded border border-piste-700 px-4 py-2 text-steel-200 hover:border-touche hover:text-touche"
          >
            + Add a referee not listed here
          </button>
        ) : (
          <form
            onSubmit={handleAddReferee}
            className="space-y-4 rounded-lg border border-piste-700 bg-piste-900 p-6"
          >
            <h3 className="font-display text-lg text-steel-100">
              Add a referee
            </h3>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Full name"
              required
              className="w-full rounded border border-piste-700 bg-piste-950 px-3 py-2 text-steel-100"
            />
            <input
              value={newRegion}
              onChange={(e) => setNewRegion(e.target.value)}
              placeholder="Region (e.g. Midwest)"
              className="w-full rounded border border-piste-700 bg-piste-950 px-3 py-2 text-steel-100"
            />
            <input
              value={newLevel}
              onChange={(e) => setNewLevel(e.target.value)}
              placeholder="Certification level (e.g. N4)"
              className="w-full rounded border border-piste-700 bg-piste-950 px-3 py-2 text-steel-100"
            />
            <div className="flex gap-3">
              <button
                type="submit"
                className="rounded bg-touche px-4 py-2 font-medium text-white hover:bg-touche-dim"
              >
                Add referee
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="rounded px-4 py-2 text-steel-400 hover:text-steel-200"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
