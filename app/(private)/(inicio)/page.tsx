"use client";

import UserHeader from "@/app/components/userHeader";
import { useSelectModule } from "@/app/store/isSelectModule";
import { useAuthStore } from "@/app/store/storeApp";
import { buttonTheme } from "@/app/styles/buttonTheme/theme";
import { StyledMainContainer } from "@/app/styles/container/container";
import { Box, Button } from "@mui/material";
import { useEffect } from "react";


interface Module {
  id: number
  name: string;
  image: string;
  status: string,
  description:string
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
      }else{
        window.location.href = 'dashboard/atividades';
        SetisSelectModule(true);
      }
    }
  }

  const modules: Module[] = [
    {
      id: 1,
      name: "Queda Zero",
      image: "https://t9013368760.p.clickup-attachments.com/t9013368760/481d9a73-0ee3-427c-834a-f728141a0a3a/721e922f6875715f55d56bfaefaf5acb.jpg",
      status: "ativo",
      description:'Queda-Zero é uma solução voltada para limpezas pesadas industriais, com cronogramas de limpezas. Além de mapear e apontar quedas indevidas de materiais dentro das áreas operacionais. Ele não apenas registra atividades e ocorrências, mas também sugere pontos de manutenção e ajustes necessários para minimizar perdas, trazendo ganhos diretos em segurança, produtividade e redução de custos.'
    },
    {
      id: 2,
      name: "SDO",
      image: "https://t9013368760.p.clickup-attachments.com/t9013368760/36d33287-8d44-42af-abba-bb161228f27c/d8bf3288feab5131b493ee56eace859e-e1734718711978-qysqo3ieduumro0ntwjopivm246722e0ffso8cwja8.jpg",
      status: "inativo",
      description:'SDO (Sistema Dikma Operacional), criado para monitorar e organizar atividades de limpeza de forma personalizada. Ele garante rastreabilidade das operações, facilita o acompanhamento de resultados em tempo real e entrega maior confiabilidade à gestão dos contratos. Ganhando transparência, agilidade e cuidando dos colaboradores.'
    },
    {
      id: 3,
      name: "Coleta Seletiva",
      image: "https://t9013368760.p.clickup-attachments.com/t9013368760/ac274ef5-6fcb-472d-bdbe-0f930b349848/WhatsApp%20Image%202025-06-26%20at%2012.24.24.jpeg",
      status: "inativo",
      description:'Coleta Seletiva tem como foco identificar a coletas em todos os pontos obrigatórios e registrar problemas relacionados ao descarte incorreto de resíduos. Com ele, é possível acompanhar o comportamento dos usuários, apontar falhas na utilização das lixeiras e gerar insights para melhorar a conscientização e eficiência no processo de separação do lixo.'
    }
  ]

  useEffect(() => {
    SetisSelectModule(false);
  }, [SetisSelectModule]);

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
              {module.description}
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