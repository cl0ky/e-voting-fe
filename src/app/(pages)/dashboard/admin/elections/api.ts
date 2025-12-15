import { axiosPrivate } from "@/lib/axios";

export async function updateElectionStatus(id: number | string, status: "active" | "ended") {
  const res = await axiosPrivate.patch(`/elections/${id}`, { status });
  return res.data;
}

export type CandidateResult = {
  candidate_id: string;
  candidate_name: string;
  photo_url: string | null;
  votes: number;
};

export type Election = {
  id: string | number;
  year: number;
  name: string;
  status: string;
  start_at: string;
  end_at: string;
  finalize_status?: string;
  finalized_at?: string | null;
  results?: CandidateResult[];
  total_votes?: number;
  summary_hash?: string;
  blockchain_tx_hash?: string;
};

type RawElection = {
  election_id?: string | number;
  id?: string | number;
  year?: number;
  name?: string;
  status?: string;
  start_at?: string;
  end_at?: string;
  finalize_status?: string;
  finalized_at?: string | null;
  results?: CandidateResult[];
  total_votes?: number;
  summary_hash?: string;
  blockchain_tx_hash?: string;
};

function normalizeElection(raw: RawElection): Election {
  const startAt = raw.start_at ?? "";
  const year =
    typeof raw.year === "number"
      ? raw.year
      : startAt
        ? new Date(startAt).getFullYear()
        : new Date().getFullYear();

  return {
    id: raw.election_id ?? raw.id ?? "",
    year,
    name: raw.name ?? "Pemilihan",
    status: raw.status ?? "pending",
    start_at: startAt,
    end_at: raw.end_at ?? "",
    finalize_status: raw.finalize_status,
    finalized_at: raw.finalized_at ?? null,
    results: raw.results ?? [],
    total_votes: raw.total_votes ?? 0,
    summary_hash: raw.summary_hash,
    blockchain_tx_hash: raw.blockchain_tx_hash,
  };
}

export async function getElectionDetail(id: string | number): Promise<Election> {
  const res = await axiosPrivate.get(`/elections/${id}`);
  const raw = res.data as RawElection;
  return normalizeElection(raw);
}

export async function getElections(): Promise<Election[]> {
  const res = await axiosPrivate.get("/elections");
  const payload = res.data as unknown;

  const rawList: RawElection[] = Array.isArray(payload)
    ? (payload as RawElection[])
    : Array.isArray((payload as { data?: unknown }).data)
      ? (((payload as { data: RawElection[] }).data))
      : [];

  return rawList.map(normalizeElection);
}

export type CreateElectionInput = {
  name: string;
  start: string;
  end: string;
  status?: string;
};

export async function createElection(data: CreateElectionInput) {
  const payload = {
    name: data.name,
    start_at: data.start,
    end_at: data.end,
    status: data.status ?? "pending",
  };
  return axiosPrivate.post("/elections", payload).then(res => res.data);
}

export async function finalizeElection(id: number | string) {
  const res = await axiosPrivate.post(`/elections/${id}/finalize`);
  return res.data;
}
