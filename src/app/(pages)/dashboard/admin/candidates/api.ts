import { axiosPrivate } from "@/lib/axios";
import { CandidateFormValues } from "./schema";

export async function editCandidate(id: string, data: CandidateFormValues & { photoUrl?: string }) {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("vision", data.vision ?? "");
  formData.append("mission", data.mission ?? "");
  if (data.electionId && typeof data.electionId === 'string' && !Array.isArray(data.electionId)) {
    formData.append("election_id", data.electionId);
  } else if (Array.isArray(data.electionId) && data.electionId.length > 0) {
    formData.append("election_id", data.electionId[0]);
  }
  if (data.photoFile) formData.append("photo", data.photoFile);
  if (data.photoUrl) formData.append("photo_url", data.photoUrl);

  const res = await axiosPrivate.patch(`/candidates/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function deleteCandidate(id: string) {
  const res = await axiosPrivate.delete(`/candidates/${id}`);
  return res.data;
}

export async function createCandidate(data: CandidateFormValues & { photoUrl?: string }) {
  const formData = new FormData();

  formData.append("name", data.name);
  formData.append("vision", data.vision ?? "");
  formData.append("mission", data.mission ?? "");
  if (data.electionId && typeof data.electionId === 'string' && !Array.isArray(data.electionId)) {
    formData.append("election_id", data.electionId);
  } else if (Array.isArray(data.electionId) && data.electionId.length > 0) {
    formData.append("election_id", data.electionId[0]);
  }
  if (data.photoFile) formData.append("photo", data.photoFile);
  if (data.photoUrl) formData.append("photo_url", data.photoUrl);

  const res = await axiosPrivate.post("/candidates", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}
