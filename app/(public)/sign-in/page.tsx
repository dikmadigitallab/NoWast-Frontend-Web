"use client";

import { Box, Button, CircularProgress, IconButton, TextField } from "@mui/material";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Logo from "../../assets/logo-1.png";
import { useState } from "react";
import Image from "next/image";
import "./style.scss";
import { buttonTheme } from "@/app/styles/buttonTheme/theme";
import { useLogin } from "@/app/hooks/usuarios/login";

export default function SignIn() {

  const { login, isLoading } = useLogin();
  const [isVisible, setIsVisible] = useState(false);
  const [user, setUser] = useState({ document: "", password: "" });

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    login(user.document, user.password);
  
  };

  return (
    <Box className="main-sign-in-container">
      <form
        onSubmit={handleSignIn}
        className="gap-3 w-[400px] p-[30px] flex items-center rounded-[5px] bg-white flex-col justify-center"
      >
        <Box className="flex flex-col gap-5">
          <Box className="flex items-center flex-row gap-2">
            <Image src={Logo} alt="Logo" className="w-[40%] h-full" />

          </Box>
          <Box className="flex flex-col gap-3">
            <Box className="font-bold text-[#6E6B7B]">Bem-vindo!</Box>
            <Box className="font-normal text-[#6E6B7B] text-[0.9rem]">
              Preencha as informações abaixo para acessar o sistema.
            </Box>
          </Box>
        </Box>

        <Box className="w-[100%] flex flex-col gap-3">
          <TextField
            required
            type="text"
            name="cpf_cnpj"
            variant="outlined"
            placeholder="CPF/CNPJ"
            value={user.document}
            onChange={(e) => setUser({ ...user, document: e.target.value })}
            fullWidth
            error={Boolean(user.document && user.document.length < 5)}
            helperText={user.document && user.document.length < 5 ? "Insira um e-mail válido" : ""}
          />

          <TextField
            required
            type={isVisible ? "text" : "password"}
            name="password"
            variant="outlined"
            placeholder="Senha"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            fullWidth
            InputProps={{
              endAdornment: (
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setIsVisible((prevState) => !prevState)}
                  edge="end"
                >
                  {isVisible ? <FiEye /> : <FiEyeOff />}
                </IconButton>
              ),
            }}
            error={Boolean(user.password && user.password.length < 6)}
            helperText={user.password && user.password.length < 6 ? "Por favor, insira uma senha válida" : ""}
          />
        </Box>

        <Box className="w-[100%] flex flex-col gap-3">
          <Button disabled={isLoading} type="submit" variant="outlined" sx={[buttonTheme, { width: "100%" }]}>
            {isLoading ? (
              <CircularProgress size={30} color="inherit" className="text-[#fff]" />
            ) : (
              <Box sx={{ fontWeight: 500 }} className="flex items-center gap-1 text-[#fff]"> Entrar</Box>
            )}
          </Button>
        </Box>
      </form>
    </Box>
  );
}
