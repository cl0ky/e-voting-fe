export type Candidate = {
  id: string;
  name: string;
  vision?: string;
  mission?: string;
  photoUrl?: string; // public URL for preview (from BE)
  year: number; // tahun periode pemilihan untuk kandidat ini
};

export type CandidateInput = {
  name: string;
  vision?: string;
  mission?: string;
  photoFile?: File | null; // new photo to upload (optional)
  year: number;
};
