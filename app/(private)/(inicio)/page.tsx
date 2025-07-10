"use client";

import { useState, useEffect } from 'react';
import { StyledMainContainer } from '@/app/styles/container/container';
import ADM_Dikma from './component/usersContent/adm_dikma';
import Gestao from './component/usersContent/gestao';
import ADM_Cliente from './component/usersContent/adm_cliente';
import ADM_Diretoria from './component/usersContent/adm_diretoria';
import { useAuthStore } from '@/app/store/storeApp';

export default function Home() {
  const { userType } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !userType) return null;

  return (
    <StyledMainContainer>
      {userType === 'ADM_DIKMA' && <ADM_Dikma />}
      {userType === 'GESTAO' && <Gestao />}
      {userType === 'CLIENTE_DIKMA' && <ADM_Cliente />}
      {userType === 'DIKMA_DIRETORIA' && <ADM_Diretoria />}
    </StyledMainContainer>
  );
}
