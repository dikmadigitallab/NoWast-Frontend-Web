import { Box, CircularProgress, Typography } from "@mui/material";

export const LoadingComponent = () => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                gap: 2,
                textAlign: "center",
            }}
        >
            <CircularProgress size={80}  sx={{ color: "#00b288" }} thickness={2} />
            <Typography variant="h6" color="textSecondary">
                Carregando dados, por favor aguarde...
            </Typography>
        </Box>
    );
};
