"use client";
import VoterElection from "./components/VoterElection";

import { useEffect, useState } from "react";
import { axiosPrivate } from "@/lib/axios";

export default function VoterDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [election, setElection] = useState<{
    id: string;
    name: string;
    year: number;
    status: "active" | "ended";
  } | null>(null);
  const [hasCommitted, setHasCommitted] = useState(false);
  const [hasRevealed, setHasRevealed] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
  axiosPrivate.get("/votes/election-status")
      .then((res) => {
        const data = res.data;
        if (data.election) {
          setElection({
            id: data.election.id,
            name: data.election.name,
            year: parseInt((data.election.name.match(/\d{4}/)?.[0]) || new Date().getFullYear()),
            status: data.election.status,
          });
        } else {
          setElection(null);
        }
        setHasCommitted(data.hasCommitted);
        setHasRevealed(data.hasRevealed);
      })
      .catch((err) => {
        setError(err?.response?.data?.message || err.message || "Terjadi kesalahan");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-2">
      <div className="w-full max-w-lg">
        {loading ? (
          <div className="text-center text-blue-900 text-lg font-semibold py-12">Memuat data pemilihan...</div>
        ) : error ? (
          <div className="text-center text-red-600 text-lg font-semibold py-12">{error}</div>
        ) : (
          <VoterElection
            election={election}
            hasCommitted={hasCommitted}
            hasRevealed={hasRevealed}
          />
        )}
      </div>
    </div>
  );
}
