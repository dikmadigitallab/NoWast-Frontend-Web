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
        <Box className="w-full max-w-6xl mx-auto space-y-6">
          {modules.map(module => (
            <Box 
              key={module.id}
              className="w-full bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
            >
              <Box className="flex flex-col md:flex-row">
                {/* Imagem */}
                <Box className="w-full md:w-80 h-48 md:h-60">
                  <img 
                    className="w-full h-full object-cover" 
                    src={module.image}
                    alt={module.name}
                  />
                </Box>
                
                {/* Conteúdo */}
                <Box className="flex-1 p-6 flex flex-col justify-between">
                  <Box>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">
                      {module.name}
                    </h3>
                    
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {module.description}
                    </p>
                  </Box>
                  
                  <Box className="flex items-center justify-between">
                    
                    <Button
                      disabled={module.status === "inativo"}
                      sx={[buttonTheme, { 
                        width: "140px",
                        borderRadius: "8px",
                        textTransform: "none",
                        fontWeight: "600"
                      }]}
                      variant="contained" 
                      color="primary"
                      onClick={() => redirect(module.id)}
                    >
                      {module.status === "inativo" ? "Pedir Acesso" : "Acessar"}
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </StyledMainContainer>
  )
}