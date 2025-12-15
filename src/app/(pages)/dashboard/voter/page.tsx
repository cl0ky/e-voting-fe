"use client";
import VoterElection from "./components/VoterElection";

import { useEffect, useState, type MouseEvent } from "react";
import { axiosPrivate } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { Box, Typography, IconButton, Menu, MenuItem } from "@mui/material";

export default function VoterDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [election, setElection] = useState<{
    id: string;
    name: string;
    year: number;
    status: "active" | "ended";
    endAt?: string | null;
  } | null>(null);
  const [hasCommitted, setHasCommitted] = useState(false);
  const [hasRevealed, setHasRevealed] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

  const menuOpen = Boolean(menuAnchorEl);

  const handleMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const onLogout = async () => {
    try {
      await axiosPrivate.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      router.replace('/auth/login');
    }
  };

  useEffect(() => {
    setLoading(true);
    setError(null);

    Promise.all([
      axiosPrivate.get("/auth/profile"),
      axiosPrivate.get("/votes/election-status")
    ])
      .then(([profileRes, electionRes]) => {
        setUserName(profileRes.data.name || profileRes.data.username || "User");

        const data = electionRes.data;
        if (data.election) {
          const endAt = data.election.end_at ?? data.election.end_date ?? null;
          setElection({
            id: data.election.id,
            name: data.election.name,
            year: parseInt((data.election.name.match(/\d{4}/)?.[0]) || new Date().getFullYear()),
            status: data.election.status,
            endAt,
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <div className="w-full max-w-lg relative px-4">
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            backgroundColor: 'white',
            padding: '8px 16px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <Typography sx={{ fontWeight: 500, color: '#1976d2' }}>
            Hi, {userName}
          </Typography>
          <IconButton
            aria-label="menu"
            size="small"
            onClick={handleMenuOpen}
          >
            <Typography component="span" sx={{ fontSize: 20, lineHeight: 1 }}>
              ☰
            </Typography>
          </IconButton>
          <Menu
            anchorEl={menuAnchorEl}
            open={menuOpen}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem
              onClick={() => {
                handleMenuClose();
                const section = document.getElementById('voting-section');
                section?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Voting
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleMenuClose();
                router.push('/dashboard/voter/results');
              }}
            >
              Hasil Pemilihan
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleMenuClose();
                onLogout();
              }}
              sx={{ color: 'error.main' }}
            >
              Logout
            </MenuItem>
          </Menu>
        </Box >
        {loading ? (
          <div
            id="voting-section"
            className="text-center text-blue-900 text-lg font-semibold py-12"
          >
            Memuat data pemilihan...
          </div>
        ) : error ? (
          <div
            id="voting-section"
            className="text-center text-red-600 text-lg font-semibold py-12"
          >
            {error}
          </div>
        ) : (
          <div id="voting-section">
            <VoterElection
              election={election}
              hasCommitted={hasCommitted}
              hasRevealed={hasRevealed}
            />
          </div>
        )}
      </div>
    </div>
  );
}
