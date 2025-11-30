import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { axiosPrivate } from "@/lib/axios";
import { useRouter, useSearchParams } from "next/navigation";

function generateNonce(length = 32) {
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

async function sha256(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const CandidateListPage = ({ electionId }) => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commitLoading, setCommitLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    setError(null);
    axiosPrivate
      .get(`/candidates?election_id=${electionId}`)
      .then((res) => {
        const arr = Array.isArray(res.data) ? res.data :
          Array.isArray(res.data?.items) ? res.data.items :
          Array.isArray(res.data?.candidates) ? res.data.candidates : [];
        setCandidates(arr);
      })
      .catch((err) => setError(err?.response?.data?.message || err.message || "Gagal memuat kandidat"))
      .finally(() => setLoading(false));
  }, [electionId]);

  const handleVote = async (candidate) => {
    setCommitLoading(true);
    setError(null);
    try {
      const nonce = generateNonce(32);
      const hashVote = await sha256(candidate.id + nonce);
      localStorage.setItem("voteData", JSON.stringify({
        candidate_id: candidate.id,
        nonce,
        election_id: electionId
      }));

      await axiosPrivate.post("/votes/commit", {
        election_id: electionId,
        hash_vote: hashVote,
      });
      let electionInfo = null;
      try {
        const res = await axiosPrivate.get(`/election/${electionId}`);
        electionInfo = res.data;
      } catch (e) {
      }
      setSnackbar({
        open: true,
        message: electionInfo ? `Suara Anda telah dikunci. Status: ${electionInfo.status || "-"}` : "Suara Anda telah dikunci.",
        severity: "success",
      });
      setTimeout(() => {
        router.push("/dashboard/voter");
      }, 1500);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Gagal commit suara");
      setSnackbar({ open: true, message: err?.response?.data?.message || err.message || "Gagal commit suara", severity: "error" });
    } finally {
      setCommitLoading(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 3 }, mx: "auto" }}>
      <Typography variant="h4" fontWeight={700} mb={3} textAlign="center">
        Daftar Kandidat
      </Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {candidates.map((candidate) => {
            let photoUrl = candidate.photo_url;
            if (photoUrl && photoUrl.startsWith("/")) {
              const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6970/v1";
              photoUrl = base.replace(/\/v1$/, "") + photoUrl;
            }
            return (
              <Grid item xs={12} key={candidate.id} width="80%">
                <Card sx={{
                  widthw: '100%',
                  my: 2,
                  borderRadius: 3,
                  boxShadow: 3,
                  display: "flex",
                  flexDirection: "column",
                  minHeight: 380,
                }}>
                  <CardMedia
                    component="img"
                    height="220"
                    image={photoUrl || "/assets/img/blockchain-voting.png"}
                    alt={candidate.name}
                  />
                  <CardContent sx={{ flexGrow: 1, px: 3, py: 2 }}>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      {candidate.name}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Visi:
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      {candidate.vision}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Misi:
                    </Typography>
                    <Typography variant="body2">
                      {candidate.mission}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      size="large"
                      disabled={commitLoading}
                      onClick={() => handleVote(candidate)}
                    >
                      {commitLoading ? <CircularProgress size={24} color="inherit" /> : "PILIH"}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CandidateListPage;
