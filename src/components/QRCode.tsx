import React from "react";
import { Box, Paper } from "@mui/material";
import * as QRCodeReact from "qrcode.react";

interface QRCodeProps {
  value: string;
  size?: number;
}

export const QRCode: React.FC<QRCodeProps> = ({ value, size = 200 }) => {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        display: "inline-block",
        bgcolor: "white",
        borderRadius: 2,
      }}
    >
      <Box sx={{ p: 2, bgcolor: "white" }}>
        <QRCodeReact.QRCodeSVG
          value={value}
          size={size}
          imageSettings={{
            src: "/pi_network.webp",
            height: 40,
            width: 40,
            excavate: true,
          }}
          level="H"
        />
      </Box>
    </Paper>
  );
};
