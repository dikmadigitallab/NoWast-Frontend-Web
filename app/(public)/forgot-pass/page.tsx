import { Box, Button, TextField, Typography } from "@mui/material";
import { IoIosArrowBack } from "react-icons/io";
import "./style.scss";

export default function ForgotPass() {
    return (
        <Box className="forgot-pass-container">
            <Box className="back-button">
                <a href="/">
                    <IoIosArrowBack size={40} />
                </a>
            </Box>

            <Box className="forgot-pass-form">
                <Box>
                    <Typography fontSize={28} color="#272727" fontWeight={600}>
                        Esqueceu sua senha?
                    </Typography>
                    <Typography fontSize={16} color="#374151" marginTop={1}>
                        Informe seu email abaixo para redefinir sua senha.
                    </Typography>
                </Box>
                <form>
                    <Box className="input-field" marginTop={3}>
                        <TextField
                            label="Email"
                            variant="outlined"
                            fullWidth
                            type="email"
                            id="email"
                            placeholder="Digite seu email"
                            required
                        />
                    </Box>
                    <Button
                        variant="contained"
                        type="submit"
                        className="default-button w-[170px]"
                        sx={{ marginTop: 2 }}
                    >
                        Enviar
                    </Button>
                </form>
            </Box>
        </Box>
    );
}
