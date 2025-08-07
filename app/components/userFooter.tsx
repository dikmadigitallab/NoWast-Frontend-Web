'use client';

import { Box, Modal, Button } from "@mui/material";
import { IoMdSettings } from "react-icons/io";
import { IoLogOutOutline } from "react-icons/io5";
import { Logout } from "../utils/logout";
import { useSelectModule } from "../store/isSelectModule";
import { useState } from "react";
import { buttonTheme, buttonThemeNoBackground } from "../styles/buttonTheme/theme";
import { useAuthStore } from "../store/storeApp";

export default function UserFooter() {

    const { userInfo } = useAuthStore();
    const { SetisSelectModule } = useSelectModule();
    const [openLogoutModal, setOpenLogoutModal] = useState(false);
    const handleOpenLogoutModal = () => setOpenLogoutModal(true);
    const handleCloseLogoutModal = () => setOpenLogoutModal(false);

    const handleLogout = () => {
        SetisSelectModule(false);
        Logout();
        handleCloseLogoutModal();
    };

    return (
        <Box className="flex flex-row items-center justify-between w-[100%]">
            <Box className="flex flex-row gap-3 items-center">
                <Box className="relative">
                    <img className="w-[50px] h-[50px] rounded-full object-cover" src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg" alt="User" />
                    <Box className="absolute bottom-0 right-0 w-[22px] h-[22px] bg-[#00B288] rounded-full flex justify-center items-center z-10">
                        <IoMdSettings color="#fff" size={15} />
                    </Box>
                </Box>
                <Box>
                    <span className="font-medium text-[.8rem] text-[#5E5873]">{userInfo?.name}</span>
                    <Box className="text-[#B9B9C3] text-[.7rem]">{userInfo?.position}</Box>
                </Box>
            </Box>
            <Box onClick={handleOpenLogoutModal} >
                <IoLogOutOutline color='#5E5873' size={30} className='cursor-pointer' />
            </Box>
            <Modal open={openLogoutModal} onClose={handleCloseLogoutModal} aria-labelledby="logout-modal-title" aria-describedby="logout-modal-description">
                <Box sx={{ width: 400, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', p: 4, borderRadius: '8px' }}>
                    <Box className="flex flex-row items-center gap-2">
                        <IoLogOutOutline size={30} />
                        <h2 id="logout-modal-title" className="text-lg font-medium text-[#5E5873]">
                            Confirmar Saída
                        </h2>
                    </Box>
                    <p id="logout-modal-description" className="mt-2 text-[#5E5873]">
                        Tem certeza que deseja sair do sistema?
                    </p>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                        <Button variant="outlined" onClick={handleCloseLogoutModal} sx={buttonThemeNoBackground}>
                            Cancelar
                        </Button>
                        <Button variant="contained" onClick={handleLogout} sx={buttonTheme}>
                            Confirmar
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Box>
    )
}