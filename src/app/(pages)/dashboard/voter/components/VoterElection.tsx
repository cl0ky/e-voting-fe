import React, { useState } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import MuiLink from "@mui/material/Link";
import { axiosPrivate } from "@/lib";

interface Election {
  id: string;
  name: string;
  year: number;
  status: "active" | "ended";
}

interface VoterElectionProps {
  election: Election | null;
  hasCommitted: boolean;
  hasRevealed: boolean;
}


export async function revealVote() {
  const voteDataStr = localStorage.getItem("voteData");
  if (!voteDataStr) throw new Error("Data reveal tidak ditemukan di localStorage");
  const { election_id, candidate_id, nonce } = JSON.parse(voteDataStr);
  if (!election_id || !candidate_id || !nonce) throw new Error("Data reveal tidak lengkap");
  await axiosPrivate.post("/votes/reveal", {
    election_id,
    candidate_id,
    nonce,
  });
}


const VoterElection: React.FC<VoterElectionProps> = ({ election, hasCommitted, hasRevealed }) => {
  const [revealLoading, setRevealLoading] = useState(false);
  const [revealMsg, setRevealMsg] = useState<string|null>(null);
  // 1. Tidak ada pemilihan aktif
  if (!election) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" sx={{ background: '#ebf3ff' }}>
        <Box
          sx={{
            background: 'rgba(255,255,255,0.85)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)',
            borderRadius: 6,
            p: { xs: 3, sm: 6 },
            textAlign: 'center',
            maxWidth: 420,
            width: '100%',
            border: '1.5px solid #d0e3fa',
            backdropFilter: 'blur(6px)',
          }}
        >
          <Typography color="#3b5998" fontSize={19} fontWeight={600}>
            Tidak ada pemilihan yang sedang berlangsung. Silakan cek kembali nanti.
          </Typography>
        </Box>
      </Box>
    );
  }

  // 2. Ada pemilihan active, voter belum commit
  if (election.status === "active" && !hasCommitted) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" sx={{ background: '#ebf3ff' }}>
        <Box
          sx={{
            background: 'rgba(255,255,255,0.85)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)',
            borderRadius: 6,
            p: { xs: 3, sm: 6 },
            textAlign: 'center',
            maxWidth: 420,
            width: '100%',
            border: '1.5px solid #d0e3fa',
            backdropFilter: 'blur(6px)',
          }}
        >
          <Typography variant="h5" fontWeight={700} color="#2563eb" mb={1} letterSpacing={0.5}>{election.name}</Typography>
          <Typography color="#5a6e8c" mb={0.5}>Tahun: {election.year}</Typography>
          <Box display="inline-block" bgcolor="#d1fae5" color="#047857" px={1.5} py={0.5} borderRadius={2} fontSize={13} mb={3} fontWeight={600}>
            Sedang Berlangsung
          </Box>
          <Link href={`/dashboard/voter/candidates?election_id=${encodeURIComponent(election.id)}`} passHref legacyBehavior>
            <MuiLink underline="none" sx={{ display: 'block', mt: 3, mb: 1 }}>
              <Button variant="contained" size="large" fullWidth sx={{ fontWeight: 600, fontSize: 18, py: 2, borderRadius: 2, boxShadow: 2, background: '#2563eb', ':hover': { background: '#1d4ed8' } }}>
                PILIH KANDIDAT
              </Button>
            </MuiLink>
          </Link>
        </Box>
      </Box>
    );
  }

  // 3. Voter sudah commit, pemilihan masih active
  if (election.status === "active" && hasCommitted) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" sx={{ background: '#ebf3ff' }}>
        <Box
          sx={{
            background: 'rgba(255,255,255,0.85)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)',
            borderRadius: 6,
            p: { xs: 3, sm: 6 },
            textAlign: 'center',
            maxWidth: 420,
            width: '100%',
            border: '1.5px solid #d0e3fa',
            backdropFilter: 'blur(6px)',
          }}
        >
          <Typography color="#3b5998" fontSize={18} fontWeight={500}>
            Suara Anda telah dikunci. Menunggu pemilihan ditutup untuk reveal.
          </Typography>
        </Box>
      </Box>
    );
  }

  // 4. Pemilihan ended, voter belum reveal
  if (election.status === "ended" && !hasRevealed) {
    const handleReveal = async () => {
      setRevealLoading(true);
      setRevealMsg(null);
      try {
        await revealVote();
        setRevealMsg("Berhasil reveal suara!");
        setTimeout(() => window.location.reload(), 1200);
      } catch (e) {
        let msg = "Gagal reveal suara";
        if (e && typeof e === "object" && "message" in e) {
          const err = e as { message?: string };
          if (typeof err.message === "string") {
            msg = err.message;
          }
        }
        setRevealMsg(msg);
      } finally {
        setRevealLoading(false);
      }
    };
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" sx={{ background: '#ebf3ff' }}>
        <Box
          sx={{
            background: 'rgba(255,255,255,0.85)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)',
            borderRadius: 6,
            p: { xs: 3, sm: 6 },
            textAlign: 'center',
            maxWidth: 420,
            width: '100%',
            border: '1.5px solid #d0e3fa',
            backdropFilter: 'blur(6px)',
          }}
        >
          <Typography color="#3b5998" fontSize={18} fontWeight={500} mb={3}>
            Pemilihan telah ditutup. Silakan reveal suara Anda.
          </Typography>
          <Button
            variant="contained"
            size="large"
            fullWidth
            sx={{ fontWeight: 600, fontSize: 18, py: 1.5, borderRadius: 2, boxShadow: 2, background: '#f59e42', ':hover': { background: '#d97706' } }}
            onClick={handleReveal}
            disabled={revealLoading}
          >
            {revealLoading ? 'Memproses...' : 'REVEAL SEKARANG'}
          </Button>
          {revealMsg && (
            <Typography mt={2} color={revealMsg.includes('Berhasil') ? 'green' : 'red'}>
              {revealMsg}
            </Typography>
          )}
        </Box>
      </Box>
    );
  }

  // 5. Pemilihan ended, voter sudah reveal
  if (election.status === "ended" && hasRevealed) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" sx={{ background: '#ebf3ff' }}>
        <Box
          sx={{
            background: 'rgba(255,255,255,0.85)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)',
            borderRadius: 6,
            p: { xs: 3, sm: 6 },
            textAlign: 'center',
            maxWidth: 420,
            width: '100%',
            border: '1.5px solid #d0e3fa',
            backdropFilter: 'blur(6px)',
          }}
        >
          <Typography color="#3b5998" fontSize={18} fontWeight={500} mb={3}>
            Terima kasih, suara Anda telah direveal.
          </Typography>
          <Link href="/dashboard/voter/results" passHref legacyBehavior>
            <MuiLink underline="none" sx={{ display: 'block', mt: 1 }}>
              <Button variant="contained" size="large" fullWidth sx={{ fontWeight: 600, fontSize: 18, py: 1.5, borderRadius: 2, boxShadow: 2, background: '#2563eb', ':hover': { background: '#1d4ed8' } }}>
                LIHAT HASIL PEMILIHAN
              </Button>
            </MuiLink>
          </Link>
        </Box>
      </Box>
    );
  }

  return null;
};

export default VoterElection;
