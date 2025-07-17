'use client';

import { Box } from "@mui/material";
import { IoMdSettings } from "react-icons/io";
import { IoLogOutOutline } from "react-icons/io5";
import { Logout } from "../utils/logout";

export default function UserFooter() {
    return (
        <Box className="flex flex-row items-center justify-between w-[100%]">
            <Box className="flex flex-row gap-3 items-center">
                <Box className="relative">
                    <img className="w-[50px] h-[50px] rounded-full object-cover" src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg" alt="Logout Icon" />
                    <Box className="absolute bottom-0 right-0 w-[22px] h-[22px] bg-[#00B288] rounded-full flex justify-center items-center z-10">
                        <IoMdSettings color="#fff" size={15} />
                    </Box>
                </Box>
                <Box>
                    <span className="font-medium text-[.8rem] text-[#5E5873]">Juliana Santos</span>
                    <Box className="text-[#B9B9C3] text-[.7rem]">Admin</Box>
                </Box>
            </Box>
            <Box onClick={() => Logout()} component="div">
                <IoLogOutOutline color='#5E5873' size={30} className='cursor-pointer' />
            </Box>
        </Box>
    )
}
