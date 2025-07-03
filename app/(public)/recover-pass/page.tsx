"use client";

import { Box, Button, IconButton, TextField, Typography } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { IoIosArrowBack } from "react-icons/io";
import { toast } from "react-toastify";
import { useState, Suspense } from "react";
import "./style.scss";

export default function ResetPass() {
    //http://localhost:3000/recover-pass?id=1

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isVisible, setIsVisible] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            toast.error("As senhas não coincidem. Por favor, tente novamente.");
            return;
        }
    };

    return (
        <Suspense fallback={<div>Carregando...</div>}>
            <ResetPassContent
                setPassword={setPassword}
                setConfirmPassword={setConfirmPassword}
                isVisible={isVisible}
                setIsVisible={setIsVisible}
                handleSubmit={handleSubmit}
            />
        </Suspense>
    );
}

function ResetPassContent({
    setPassword,
    setConfirmPassword,
    isVisible,
    setIsVisible,
    handleSubmit,
}: any) {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");

    return (
        <Box className="recover-pass-container">
            <Box className="back-button">
                <a href="/">
                    <IoIosArrowBack size={40} />
                </a>
            </Box>
            <Box className="forgot-pass-form">
                <Box>
                    <Typography fontSize={28} color="#272727" fontWeight={600}>
                        Redefinir sua senha
                    </Typography>
                    <Typography
                        fontSize={16}
                        color="#374151"
                        marginTop={1}
                        letterSpacing={-0.7}
                    >
                        Crie uma nova senha para sua conta. Certifique-se de que ambas as
                        senhas sejam iguais.
                    </Typography>
                </Box>
                <form onSubmit={handleSubmit}>
                    <Box className="input-field" marginTop={3}>
                        <TextField
                            onChange={(e) => setPassword(e.target.value)}
                            label="Nova senha"
                            variant="outlined"
                            fullWidth
                            type={isVisible ? "text" : "password"}
                            id="password"
                            placeholder="Digite sua nova senha"
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <IconButton
                                            aria-label="mostrar senha"
                                            onClick={() =>
                                                setIsVisible((prevState: boolean) => !prevState)
                                            }
                                            edge="end"
                                        >
                                            {isVisible ? <FiEye /> : <FiEyeOff />}
                                        </IconButton>
                                    ),
                                },
                            }}
                            required
                        />
                        <TextField
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            label="Confirmar senha"
                            variant="outlined"
                            fullWidth
                            type={isVisible ? "text" : "password"}
                            id="confirm-password"
                            placeholder="Confirme sua senha"
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <IconButton
                                            aria-label="mostrar senha"
                                            onClick={() =>
                                                setIsVisible((prevState: boolean) => !prevState)
                                            }
                                            edge="end"
                                        >
                                            {isVisible ? <FiEye /> : <FiEyeOff />}
                                        </IconButton>
                                    ),
                                },
                            }}
                            required
                        />
                    </Box>
                    <Button
                        variant="contained"
                        type="submit"
                        className="default-button w-[170px]"
                        sx={{ marginTop: 2 }}
                    >
                        Salvar
                    </Button>
                </form>
            </Box>
        </Box>
    );
}
