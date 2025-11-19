"use client"

import { Box } from "@mui/material";
import Image from "next/image";
import { motion } from "framer-motion";
import blockchainVoting from "@/assets/img/blockchain-voting.png";
import RoleRedirect from "./components/role-redirect";

export default function Home() {
  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#e6f0ff",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{
            opacity: 1,
            scale: 1,
            x: [0, -3, 3, -3, 3, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Image
            src={blockchainVoting}
            alt="Blockchain Voting"
            width={400}
            height={400}
            priority
          />
        </motion.div>
      </Box>

      <RoleRedirect />
    </>
  );
}
