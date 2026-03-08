"use client";

import { useState, useEffect, useCallback } from "react";

const DIFFICULTY_OPTIONS = ["Easy", "Medium", "Hard"];

const BADGE_COLORS = {
    Easy: "bg-emerald-100 text-emerald-800 border-emerald-300",
    Medium: "bg-amber-100 text-amber-800 border-amber-300",
    Hard: "bg-rose-100 text-rose-800 border-rose-300",
};

export default function AdminPage() {
    const [painPoints, setPainPoints] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Form state
    const [description, setDescription] = useState("");
    const [difficultyLevel, setDifficultyLevel] = useState("Medium");

    /* ── Fetch all pain points ──────────────────────────────────────── */
    const fetchPainPoints = useCallback(async () => {
        try {
            const res = await fetch("/api/admin");
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            setPainPoints(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPainPoints();
    }, [fetchPainPoints]);

    /* ── Submit new pain point ──────────────────────────────────────── */
    async function handleSubmit(e) {
        e.preventDefault();
        if (!description.trim()) return;

        setIsSubmitting(true);
        setError(null);
        setSuccess(null);

        try {
            const res = await fetch("/api/admin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ description, difficultyLevel }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to create pain point");
            }

            setDescription("");
            setDifficultyLevel("Medium");
            setSuccess("Pain point added successfully!");
            setTimeout(() => setSuccess(null), 3000);
            await fetchPainPoints();
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    /* ── Render ─────────────────────────────────────────────────────── */
    return (
        <div className="min-h-screen bg-slate-50">
            {/* ── Header ────────────────────────────────────────────────── */}
            <header className="bg-white border-b border-slate-200 shadow-sm">
                <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                            Admin Dashboard
                        </h1>
                        <p className="text-sm text-slate-500 mt-0.5">
                            Manage Pain Points for case study generation
                        </p>
                    </div>
                    <a
                        href="/"
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        ← Back to Generator
                    </a>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
                {/* ── Add Pain Point Form ─────────────────────────────────── */}
                <section className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">
                        Add New Pain Point
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Description */}
                        <div>
                            <label
                                htmlFor="description"
                                className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5"
                            >
                                Description
                            </label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe a realistic DevOps pain point that a company might face…"
                                rows={3}
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                                required
                            />
                        </div>

                        {/* Difficulty + Submit */}
                        <div className="flex flex-wrap items-end gap-4">
                            <div>
                                <label
                                    htmlFor="difficultyLevel"
                                    className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5"
                                >
                                    Difficulty Level
                                </label>
                                <select
                                    id="difficultyLevel"
                                    value={difficultyLevel}
                                    onChange={(e) => setDifficultyLevel(e.target.value)}
                                    className="h-11 px-4 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer min-w-[150px]"
                                >
                                    {DIFFICULTY_OPTIONS.map((level) => (
                                        <option key={level} value={level}>
                                            {level}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting || !description.trim()}
                                className="h-11 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow transition-all disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg
                                            className="animate-spin h-4 w-4"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                            />
                                        </svg>
                                        Adding…
                                    </>
                                ) : (
                                    "Add Pain Point"
                                )}
                            </button>
                        </div>
                    </form>

                    {/* ── Feedback messages ──────────────────────────────────── */}
                    {success && (
                        <div className="mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium">
                            ✓ {success}
                        </div>
                    )}
                    {error && (
                        <div className="mt-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium">
                            ⚠ {error}
                        </div>
                    )}
                </section>

                {/* ── Pain Points Table ────────────────────────────────────── */}
                <section className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100">
                        <h2 className="text-lg font-semibold text-slate-900">
                            Existing Pain Points
                            <span className="ml-2 text-sm font-normal text-slate-500">
                                ({painPoints.length})
                            </span>
                        </h2>
                    </div>

                    {isLoading ? (
                        <div className="p-8 animate-pulse space-y-3">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="h-4 bg-slate-200 rounded w-12" />
                                    <div className="h-4 bg-slate-100 rounded flex-1" />
                                    <div className="h-4 bg-slate-200 rounded w-16" />
                                </div>
                            ))}
                        </div>
                    ) : painPoints.length === 0 ? (
                        <div className="p-8 text-center text-sm text-slate-500">
                            No pain points in the database yet. Add one above!
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500 bg-slate-50">
                                        <th className="px-6 py-3 w-12">ID</th>
                                        <th className="px-6 py-3">Description</th>
                                        <th className="px-6 py-3 w-28 text-center">Difficulty</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {painPoints.map((pp) => (
                                        <tr
                                            key={pp.id}
                                            className="hover:bg-slate-50 transition-colors"
                                        >
                                            <td className="px-6 py-3 text-slate-400 font-mono text-xs">
                                                {pp.id}
                                            </td>
                                            <td className="px-6 py-3 text-slate-700 leading-relaxed">
                                                {pp.description}
                                            </td>
                                            <td className="px-6 py-3 text-center">
                                                <span
                                                    className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full border ${BADGE_COLORS[pp.difficultyLevel] ||
                                                        "bg-slate-100 text-slate-600 border-slate-300"
                                                        }`}
                                                >
                                                    {pp.difficultyLevel}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </main>

            {/* ── Footer ────────────────────────────────────────────────── */}
            <footer className="max-w-4xl mx-auto px-6 py-6 text-center text-xs text-slate-400">
                DevOps Case Study Generator · Admin Panel · Ayan Khan · CSE3253 DevOps
                [PE6]
            </footer>
        </div>
    );
}
