"use client";

import { Box, Button, CircularProgress, IconButton, TextField } from "@mui/material";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Logo from "../../assets/pr_logo.png";
import { useState } from "react";
import { redirect } from "next/navigation";
import { CiLogin } from "react-icons/ci";
import { toast } from "react-toastify";
import Image from "next/image";
import "./style.scss";
import { buttonTheme, buttonThemeNoBackground } from "@/app/styles/buttonTheme/theme";

export default function RecoverPass() {

    const [email, setEmail] = useState("dikma@example.com");
    const [password, setPassword] = useState("31312@dasd");
    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {

        event.preventDefault();

        setIsLoading(true);

        document.cookie = `authToken=asdasdasd; Path=/; Max-Age=3600; SameSite=Lax`;

        toast.success("Login realizado com sucesso!");

        setTimeout(() => {
            redirect("/");
        }, 4000);

    };

    return (
        <Box className="main-sign-in-container">
            <form
                onSubmit={handleSignIn}
                className="gap-3 w-[400px] p-[30px] flex items-center rounded-[10px] bg-white flex-col justify-center "
            >
                <Box className="flex flex-col gap-2">
                    <Box className="flex items-center flex-row gap-2">
                        <Box className="w-[60px] h-[60px] ">
                            <Image src={Logo} alt="Logo" className="w-full h-full" />
                        </Box>
                        <Box>
                            <Box className="text-[#f5ac40] text-[1.6rem] font-normal mb-[-13px]">Grupo</Box>
                            <Box className="text-[#2a5163] text-[1.6rem] font-black">Dikma</Box>
                        </Box>
                    </Box>
                    <Box className="flex flex-col gap-3">
                        <Box className="font-bold text-[#6E6B7B]">Resete sua Senha</Box>
                        <Box className="font-normal text-[#6E6B7B] text-[0.9rem]">Sua nova senha deve ser diferente das senhas usadas anteriormente</Box>
                    </Box>
                </Box>
                <Box className="w-full flex flex-col gap-3">
                    <TextField
                        required
                        error={Boolean(email && !/\S+@\S+\.\S+/.test(email))}
                        helperText={
                            email && !/\S+@\S+\.\S+/.test(email)
                                ? "Por favor, insira um email válido"
                                : ""
                        }
                        name="email"
                        variant="outlined"
                        placeholder="Email"
                        id="email"
                        value={email ?? ""}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        fullWidth
                    />
                    <TextField
                        required
                        type={isVisible ? "text" : "password"}
                        name="senha"
                        variant="outlined"
                        placeholder="Senha"
                        value={password ?? ""}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setIsVisible((prevState) => !prevState)}
                                        edge="end"
                                    >
                                        {isVisible ? <FiEye /> : <FiEyeOff />}
                                    </IconButton>
                                ),
                            },
                        }}
                        error={Boolean(password && password.length < 6)}
                        helperText={
                            password && password.length < 6
                                ? "Por favor, insira uma senha válida"
                                : ""
                        }
                    />
                </Box>

                <Box className="w-full flex flex-col gap-3">
                    <Button
                        type="submit"
                        variant="outlined"
                        sx={[buttonTheme, { width: "100%", fontWeight: 500 }]}
                    >
                        {isLoading ? (
                            <CircularProgress size={30} color="inherit" className="text-[#fff]" />
                        ) : (
                            <Box className="flex items-center gap-1 text-[#fff]">
                                Resetar Senha
                            </Box>
                        )}
                    </Button>

                    <Button
                        variant="outlined"
                        href="/forgot-pass"
                        sx={[buttonThemeNoBackground, { width: "100%", fontWeight: 500 }]}
                    >
                        Voltar ao Login
                    </Button>
                </Box>

            </form>
        </Box>
    );
}
