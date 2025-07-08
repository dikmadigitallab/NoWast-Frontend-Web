'use client';

import { StyledMainContainer } from '@/app/styles/container/container';
import ADM_Dikma from './component/usersContent/adm_dikma';
import { useState } from 'react';
import Gestao from './component/usersContent/gestao';
import ADM_Cliente from './component/usersContent/adm_cliente';
import ADM_Diretoria from './component/usersContent/adm_diretoria';

export default function Home() {

  const [typeUser, setTypeUser] = useState<string>('ADM_DIKMA');

  return (
    <StyledMainContainer>
      {typeUser === 'ADM_DIKMA' && <ADM_Dikma />}
      {typeUser === 'GESTAO' && <Gestao />}
      {typeUser === 'CLIENTE_DIKMA' && <ADM_Cliente />}
      {typeUser === 'DIRETORIA' && <ADM_Diretoria />}
    </StyledMainContainer>
  );
};

