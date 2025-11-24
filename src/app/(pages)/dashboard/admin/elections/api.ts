import { axiosPrivate } from "@/lib/axios";

export async function updateElectionStatus(id: number | string, status: "active" | "ended") {
  const res = await axiosPrivate.patch(`/elections/${id}`, { status });
  return res.data;
}

export async function getElectionDetail(id: string | number): Promise<Election> {
  const res = await axiosPrivate.get(`/elections/${id}`);
  return res.data;
}

export type Election = {
  id: number;
  year: number;
  name: string;
  status: "active" | "ended";
  start_at: string;
  end_at: string;
};

export async function getElections(): Promise<Election[]> {
  const res = await axiosPrivate.get("/elections");
  return res.data;
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
