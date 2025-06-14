import React, { useEffect, useRef, useState } from "react";
import { Box, TextField, Typography } from "@mui/material";

interface PinInputProps {
  onComplete: (pin: string) => void;
  error?: string;
  resetKey?: string | number;
}

export const PinInput: React.FC<PinInputProps> = ({
  onComplete,
  error,
  resetKey,
}) => {
  const [pin, setPin] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    setPin(Array(6).fill(""));
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [resetKey]);

  const handleChange = (index: number, value: string) => {
    if (/^[0-9]?$/.test(value)) {
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);

      // Move to next input if value is entered
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }

      // Check if PIN is complete
      if (newPin.every((digit) => digit) && newPin.join("").length === 6) {
        onComplete(newPin.join(""));
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace") {
      if (!pin[index] && index > 0) {
        // Move to previous input on backspace if current input is empty
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newPin = [...pin];
      pastedData.split("").forEach((digit, index) => {
        if (index < 6) newPin[index] = digit;
      });
      setPin(newPin);

      // Focus last filled input
      const lastIndex = Math.min(pastedData.length - 1, 5);
      inputRefs.current[lastIndex]?.focus();

      if (pastedData.length === 6) {
        onComplete(pastedData);
      }
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          gap: { xs: 0.5, sm: 1 },
          justifyContent: "center",
        }}
      >
        {pin.map((digit, index) => (
          <TextField
            key={index}
            inputRef={(el) => (inputRefs.current[index] = el)}
            value={digit ? "•" : ""}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            type="number"
            inputProps={{
              maxLength: 1,
              sx: {
                textAlign: "center",
                fontSize: { xs: "1.2rem", sm: "1.5rem" },
                caretColor: "transparent",
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 1,
                width: { xs: "2.5rem", sm: "3rem" },
                height: { xs: "2.5rem", sm: "3rem" },
                minWidth: { xs: "2.5rem", sm: "3rem" },
              },
            }}
          />
        ))}
      </Box>
      {error && (
        <Typography
          color="error"
          variant="body2"
          sx={{ mt: 1, textAlign: "center" }}
        >
          {error}
        </Typography>
      )}
    </Box>
  );
};
