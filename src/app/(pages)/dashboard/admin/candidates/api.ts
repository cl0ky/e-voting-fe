import { axiosPrivate } from "@/lib/axios";
import { CandidateFormValues } from "./schema";

export async function createCandidate(data: CandidateFormValues) {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("vision", data.vision ?? "");
  formData.append("mission", data.mission ?? "");
  formData.append("year", String(data.year));
  if (data.photoFile) formData.append("photo", data.photoFile);

  const res = await axiosPrivate.post("/candidates", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}
