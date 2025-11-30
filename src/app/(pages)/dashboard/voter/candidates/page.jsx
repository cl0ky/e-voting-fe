"use client";


import { useSearchParams } from "next/navigation";
import CandidateListPage from "../CandidateListPage";

export default function Page() {
  const searchParams = useSearchParams();
  const electionId = searchParams.get("election_id") || "";
  return <CandidateListPage electionId={electionId} />;
}
