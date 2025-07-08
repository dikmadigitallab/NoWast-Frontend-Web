"use client";

import React, { useState, useEffect } from 'react';
import { Box, Button } from '@mui/material';
import { buttonTheme } from '@/app/styles/buttonTheme/theme';

export default function Notificacoes() {
  const [notificacoes, setNotificacoes] = useState([
    {
      id: 1,
      titulo: "Nova mensagem",
      descricao: "Você recebeu uma nova mensagem de João.",
      data: "08/07/2025"
    },
    {
      id: 2,
      titulo: "Atualização do sistema",
      descricao: "O sistema foi atualizado para a versão 2.1.",
      data: "07/07/2025"
    },
    {
      id: 3,
      titulo: "Aviso de manutenção",
      descricao: "Manutenção programada para amanhã às 22h.",
      data: "06/07/2025"
    },
  ]);

  const [lidas, setLidas] = useState<number[]>([]);

  useEffect(() => {
    const notificacoesLidas = localStorage.getItem('notificacoesLidas');
    if (notificacoesLidas) {
      setLidas(JSON.parse(notificacoesLidas));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('notificacoesLidas', JSON.stringify(lidas));
  }, [lidas]);

  const marcarComoLida = (id: number) => {
    if (!lidas.includes(id)) {
      setLidas([...lidas, id]);
    }
  };

  const marcarTodasComoLidas = () => {
    const todosIds = notificacoes.map(not => not.id);
    setLidas(todosIds);
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Box className="flex justify-between items-center mb-4">
        <Box className="flex gap-2">
          <h1 className="text-[#5E5873] text-[1.4rem] font-normal">Notificações</h1>
        </Box>
        <Button
          onClick={marcarTodasComoLidas}
          type="button"
          variant="outlined"
          sx={[buttonTheme, { alignSelf: "end" }]}
        >
          Marcar tudo como lido
        </Button>
      </Box>

      <Box>
        {notificacoes.map((notificacao) => (
          <Box
            key={notificacao.id}
            onClick={() => marcarComoLida(notificacao.id)}
            className="w-full p-2 mb-2 border cursor-pointer hover:transform hover:scale-[1.01] transition-all duration-200 ease-in-out rounded-lg border-[#E0E0E0] hover:border-[#5E5873]"
          >
            <Box className="flex items-center gap-1 mb-1">
              <Box className="w-full flex items-center justify-between">
                <Box className="flex items-center gap-1">
                  <Box className="flex justify-center items-center border rounded-full p-[2px] border-[#5e587330] w-[13px] h-[13px]">
                    <Box className={`w-[100%] h-[100%] rounded-full ${lidas.includes(notificacao.id) ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
                  </Box>
                  <Box className="text-[#5E5873] text-[1rem] font-medium">
                    {notificacao.titulo}
                  </Box>
                </Box>
              </Box>
              <Box className="text-[#5E5873] text-[0.9rem]">
                {notificacao.data}
              </Box>
            </Box>
            <Box className="text-[#5E5873] text-[0.9rem]">
              {notificacao.descricao}
            </Box>

          </Box>
        ))}
      </Box>
    </Box>
  );
}