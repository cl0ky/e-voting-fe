
export type Candidate = {
  id: string;
  name: string;
  vision?: string;
  mission?: string;
  photoUrl?: string; 
  year: number;
  electionId: string;
  rtId: string;
};

export type CandidateInput = {
  name: string;
  vision?: string;
  mission?: string;
  photoFile?: File | null;
  year: number;
  electionId: number;
};
