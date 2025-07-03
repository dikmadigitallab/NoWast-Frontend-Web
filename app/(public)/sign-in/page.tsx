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
import { buttonTheme } from "@/app/styles/buttonTheme/theme";


export default function SignIn() {

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
      <form onSubmit={handleSignIn}>
        <Box className="sign-in-header">
          <Box className="sign-in-logo-container">
            <Image src={Logo} alt="Logo" className="sign-in-logo" />
          </Box>
          <Box>
            <Box className="font-bold text-[1.4rem] text-[#272727] tracking-[-1px]">
              Faça login para
            </Box>
            <Box className="font-bold text-[1.4rem] mt-[-10px] text-[#272727] tracking-[-1px] flex gap-1">
              acessar sua
              <span className="font-bold text-[#00B288] text-[1.4rem] letter-spacing-2">
                Conta!
              </span>
            </Box>
          </Box>
        </Box>
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
        <a className="sign-in-forgot-password" href="/forgot-pass">
          Esqueceu sua senha?
        </a>

        <Button
          type="submit"
          variant="outlined"
          sx={[buttonTheme, { width: "100%" }]}
        >
          {isLoading ? (
            <CircularProgress size={30} color="inherit" className="text-[#fff]" />
          ) : (
            <Box className="flex items-center gap-1 text-[#fff] font-semibold">
              <CiLogin size={25} />
              Entrar
            </Box>
          )}
        </Button>

      </form>
    </Box>
  );
}
