import React from "react";
import type { PiTx } from "../wallet/PiApi";
import { Box, List } from "@mui/material";
import TxItem from "./TxItem";
import { TransactionDetails } from "./TransactionDetails";

interface Props {
  txs: Array<PiTx>;
}
const TxList: React.FC<Props> = ({ txs }) => {
  const [selectedTx, setSelectedTx] = React.useState<PiTx | null>(null);
  return (
    <>
      <List>
        {txs.map((tx, index) => (
          <React.Fragment key={tx.id}>
            <TxItem tx={tx} onSelect={setSelectedTx} />
            {index < txs.length - 1 && (
              <Box sx={{ width: "100%", px: 2 }}>
                <Box
                  sx={{
                    width: "100%",
                    height: "1px",
                    bgcolor: "divider",
                  }}
                />
              </Box>
            )}
          </React.Fragment>
        ))}
      </List>
      {selectedTx && (
        <TransactionDetails
          open={Boolean(selectedTx)}
          onClose={() => setSelectedTx(null)}
          transaction={selectedTx}
        />
      )}
    </>
  );
};

export default TxList;
