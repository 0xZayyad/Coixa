import {
  Box,
  IconButton,
  Typography,
  type IconButtonProps,
} from "@mui/material";

interface QuickActionProps {
  icon: React.ReactNode;
  label?: string;
  slotProps?: { IconButton?: IconButtonProps };
  onClick: () => void;
}
const QuickAction: React.FC<QuickActionProps> = ({
  icon,
  label,
  onClick,
  slotProps,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid rgba(0, 0, 0, 0.08)",
        borderRadius: 2,
        padding: 1,
        width: 70,
        height: 70,
        color: "primary.main",
        transition: "all 0.2s ease-in-out",
        backgroundColor: "background.paper",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        "&:hover": {
          backgroundColor: "rgba(0, 0, 0, 0.02)",
          transform: "translateY(-2px)",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          cursor: "pointer",
        },
      }}
      onClick={onClick}
    >
      <IconButton
        sx={{
          fontSize: 40,
          color: "primary.main",
          mb: 0,
          "&:hover": {
            backgroundColor: "transparent",
          },
        }}
        {...slotProps?.IconButton}
      >
        {icon}
      </IconButton>
      <Typography
        fontSize={14}
        fontWeight={500}
        textAlign="center"
        color="primary.main"
      >
        {label}
      </Typography>
    </Box>
  );
};

export default QuickAction;
