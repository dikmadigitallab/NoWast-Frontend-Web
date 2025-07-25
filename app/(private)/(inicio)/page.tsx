"use client";

import UserHeader from "@/app/components/userHeader";
import { useSelectModule } from "@/app/store/isSelectModule";
import { useAuthStore } from "@/app/store/storeApp";
import { buttonTheme } from "@/app/styles/buttonTheme/theme";
import { StyledMainContainer } from "@/app/styles/container/container";
import { Box, Button } from "@mui/material";

interface Module {
  id: number
  name: string;
  image: string;
  status: string,
}

export default function Home() {

  const { userType } = useAuthStore();
  const { SetisSelectModule } = useSelectModule();

  const redirect = (module: number) => {
    if (module === 1) {
      if (userType === 'GESTAO') {
        window.location.href = 'modulos/predios';
        SetisSelectModule(true);
      } else if (userType === 'DIKMA_DIRECTOR') {
        window.location.href = 'modulos/empresas';
        SetisSelectModule(true);
      } else if (userType === 'ADM_DIKMA') {
        window.location.href = 'dashboard/atividades';
        SetisSelectModule(true);
      } else if (userType === 'ADM_CLIENTE') {
        window.location.href = 'dashboard/atividades';
        SetisSelectModule(true);
      }
    }
  }

  const modules: Module[] = [
    {
      id: 1,
      name: "Queda Zero",
      image: "https://images.pexels.com/photos/247763/pexels-photo-247763.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      status: "ativo"
    },
    {
      id: 2,
      name: "SDO",
      image: "https://images.pexels.com/photos/247763/pexels-photo-247763.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      status: "inativo"
    },
    {
      id: 3,
      name: "Coleta Seletiva",
      image: "https://images.pexels.com/photos/247763/pexels-photo-247763.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      status: "inativo"
    }
  ]

  return (
    <StyledMainContainer>
      <Box className="flex gap-2 mb-8">
        <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">Início</h1>
        <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">/</h1>
        <h1 className="text-[#5E5873] text-[1.4rem] font-normal">Módulos</h1>
      </Box>
      <UserHeader />
      <Box className="w-full flex flex-col">
        <Box className="w-full flex flex-wrap flex-row justify-between">
          {modules.map(module => (
            <Box key={module.id} className="md:w-[100%] lg:w-[32%] flex flex-col items-center justify-between overflow-hidden gap-2 p-4 rounded-sm h-[400px] border-1 border-[#5e58731f]">
              <img className="w-full h-[50%] object-cover transition duration-500 ease-in-out hover:scale-102 hover:rounded-sm" src={module.image} alt={module.name} />
              <span className='text-[#3b3b3b] text-[1.4rem] font-medium'>{module.name}</span>
              <span className='text-[#5E5873] text-[.8rem]'>lLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not.</span>
              <Button
                disabled={module.status === "inativo"}
                sx={[buttonTheme, { width: "100%" }]}
                variant="contained" color="primary"
                className="mt-4"
                onClick={() => redirect(module.id)}
              >{module.status === "inativo" ? "Pedir Acesso" : "Acessar"}</Button>
            </Box>
          ))}
        </Box>
      </Box>
    </StyledMainContainer>
  )
}
