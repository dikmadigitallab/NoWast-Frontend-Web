"use client";

import { Box, Button, CircularProgress, IconButton, TextField, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Logo from "../../assets/pr_logo.png";
import { useState } from "react";
import { redirect } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";
import "./style.scss";
import { buttonTheme, buttonThemeNoBackground } from "@/app/styles/buttonTheme/theme";
import { useAuthStore } from "@/app/store/storeApp";

type UserType = 'ADM_DIKMA' | 'GESTAO' | 'DIKMA_DIRETORIA' | null;

export default function SignIn() {
  const { setUserType } = useAuthStore();
  const [password, setPassword] = useState("31312@dasd");
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEmailType, setSelectedEmailType] = useState<UserType>(null);

  const emailTypes = [
    { value: 'ADM_DIKMA', label: 'Adiministrador DIKMA' },
    { value: 'GESTAO', label: 'Gestão' },
    { value: 'DIKMA_DIRETORIA', label: 'Diretoria DIKMA' }
  ];

  const handleEmailTypeChange = (event: any) => {
    const value = event.target.value as UserType;
    setSelectedEmailType(value);
    setUserType(value);
  };

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    document.cookie = `authToken=asdasdasd; Path=/; Max-Age=3600; SameSite=Lax`;
    toast.success("Login realizado com sucesso!");

    if (selectedEmailType === 'ADM_DIKMA') {
      setTimeout(() => {
        redirect("/dashboard/atividades");
      }, 1000);
    } else {
      setTimeout(() => {
        redirect("/");
      }, 1000);
    }

  };

  return (
    <Box className="main-sign-in-container">
      <form
        onSubmit={handleSignIn}
        className="gap-3 w-[400px] p-[30px] flex items-center rounded-[5px] bg-white flex-col justify-center "
      >
        <Box className="flex flex-col gap-5">
          <Box className="flex items-center flex-row gap-2">
            <Box className="w-[60px] h-[60px] ">
              <Image src={Logo} alt="Logo" className="w-[100%] h-full" />
            </Box>
            <Box>
              <Box className="text-[#f5ac40] text-[1.6rem] font-normal mb-[-13px]">Grupo</Box>
              <Box className="text-[#2a5163] text-[1.6rem] font-black">Dikma</Box>
            </Box>
          </Box>
          <Box className="flex flex-col gap-3">
            <Box className="font-bold text-[#6E6B7B]">Bem Vindo</Box>
            <Box className="font-normal text-[#6E6B7B] text-[0.9rem]">Preencha as informações abaixo para acessar o sistema</Box>
          </Box>
        </Box>
        <Box className="w-[100%] flex flex-col gap-3">
          <FormControl fullWidth>
            <InputLabel id="email-type-label">Tipo de Usuário</InputLabel>
            <Select
              labelId="email-type-label"
              id="email-type-select"
              value={selectedEmailType || ''}
              label="Tipo de Usuário"
              onChange={handleEmailTypeChange}
              required
            >
              {emailTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

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
            helperText={password && password.length < 6 ? "Por favor, insira uma senha válida" : ""} />
        </Box>
        <Box className="w-[100%] flex flex-col gap-3">
          <Button type="submit" variant="outlined" sx={[buttonTheme, { width: "100%" }]}>
            {isLoading ? (
              <CircularProgress size={30} color="inherit" className="text-[#fff]" />
            ) : (
              <Box sx={{ fontWeight: 500 }} className="flex items-center gap-1 text-[#fff]"> Entrar</Box>
            )}
          </Button>
          <Button variant="outlined" href="/forgot-pass" sx={[buttonThemeNoBackground, { width: "100%", fontWeight: 500 }]}>
            Esqueci minha Senha
          </Button>
        </Box>
      </form>
    </Box>
  );
}