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
      <Box className="flex gap-2 mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-[#B9B9C3] text-sm sm:text-base md:text-xl font-normal">Início</h1>
        <h1 className="text-[#B9B9C3] text-sm sm:text-base md:text-xl font-normal">/</h1>
        <h1 className="text-[#5E5873] text-sm sm:text-base md:text-xl font-normal">Módulos</h1>
      </Box>

      <UserHeader />

      <Box className="w-full px-2 sm:px-4 md:px-0">
        <Box className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {modules.map(module => (
            <Box 
              key={module.id}
              className="w-full flex flex-col items-center justify-between overflow-hidden gap-2 p-3 sm:p-4 rounded-sm border border-[#5e58731f]
              h-[350px] sm:h-[380px] md:h-[400px]"
            >
              <img 
                className="w-full h-[120px] sm:h-[150px] md:h-[180px] object-cover transition duration-500 ease-in-out hover:scale-102 hover:rounded-sm" 
                src={module.image} 
                alt={module.name}
              />
              
              <span className="text-[#3b3b3b] text-lg sm:text-xl md:text-2xl font-medium text-center">
                {module.name}
              </span>
              
              <span className="text-[#5E5873] text-xs sm:text-sm text-center line-clamp-3">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
              </span>
              
              <Button
                disabled={module.status === "inativo"}
                sx={[buttonTheme, { width: "100%" }]}
                variant="contained" 
                color="primary"
                className="mt-2 sm:mt-3 md:mt-4"
                onClick={() => redirect(module.id)}
              >
                {module.status === "inativo" ? "Pedir Acesso" : "Acessar"}
              </Button>
            </Box>
          ))}
        </Box>
      </Box>
    </StyledMainContainer>
  )
}