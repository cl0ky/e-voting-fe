import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";
import Link from "next/link";

type Election = {
  year: number;
  name: string;
  status: "pending" | "ended";
  start: string;
  end: string;
};

export default function ElectionsTable({ elections }: { elections: Election[] }) {
  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Tahun</TableCell>
            <TableCell>Nama Pemilihan</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Mulai</TableCell>
            <TableCell>Selesai</TableCell>
            <TableCell align="center">Aksi</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {elections.map((election, idx) => (
            <TableRow key={idx}>
              <TableCell>{election.year}</TableCell>
              <TableCell>{election.name}</TableCell>
              <TableCell>{election.status}</TableCell>
              <TableCell>{election.start}</TableCell>
              <TableCell>{election.end}</TableCell>
              <TableCell align="center">
                <Button
                  size="small"
                  variant="outlined"
                  component={Link}
                  href={`/dashboard/admin/elections/${election.year}`}
                >
                  Detail
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
