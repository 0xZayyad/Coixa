import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  Alert,
} from "@mui/material";

interface Props {
  mnemonic: string;
  onConfirmed: () => void;
  onBack: () => void;
}

export const MnemonicConfirmation: React.FC<Props> = ({
  mnemonic,
  onConfirmed,
  onBack,
}) => {
  const [selectedWordIndices, setSelectedWordIndices] = useState<number[]>([]);
  const [userInputs, setUserInputs] = useState<string[]>(["", "", ""]);
  const [error, setError] = useState<boolean>(false);
  const words = mnemonic.split(" ");

  useEffect(() => {
    // Randomly select 3 different word indices
    const indices = new Set<number>();
    while (indices.size < 3) {
      indices.add(Math.floor(Math.random() * words.length));
    }
    setSelectedWordIndices(Array.from(indices));
  }, [words.length]);

  const handleInputChange = (index: number, value: string) => {
    const newInputs = [...userInputs];
    newInputs[index] = value.toLowerCase().trim();
    setUserInputs(newInputs);
    setError(false);
  };

  const handleVerify = () => {
    const isCorrect = selectedWordIndices.every(
      (wordIndex, index) => userInputs[index] === words[wordIndex]
    );

    if (isCorrect) {
      onConfirmed();
    } else {
      setError(true);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Stack spacing={3}>
        <Typography variant="h6">Verify Your Recovery Phrase</Typography>
        <Typography variant="body2" color="text.secondary">
          Please enter the following words from your recovery phrase to verify
          you have saved it correctly.
        </Typography>

        {selectedWordIndices.map((wordIndex, index) => (
          <Box key={wordIndex}>
            <Typography variant="body2" gutterBottom>
              Word #{wordIndex + 1}
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={userInputs[index]}
              onChange={(e) => handleInputChange(index, e.target.value)}
              error={error}
              placeholder="Enter word"
            />
          </Box>
        ))}

        {error && (
          <Alert severity="error">
            One or more words are incorrect. Please check your recovery phrase
            and try again.
          </Alert>
        )}

        <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
          <Button variant="outlined" onClick={onBack}>
            Back
          </Button>
          <Button
            variant="contained"
            onClick={handleVerify}
            disabled={userInputs.some((input) => !input)}
          >
            Verify
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
};
