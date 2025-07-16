'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import Logo from "@/app/assets/logo-1.png";
import { usePathname } from 'next/navigation';
import { Box, Collapse } from '@mui/material';
import { IoMdSettings } from 'react-icons/io';
import { IoLogOutOutline } from "react-icons/io5";
import { FiChevronDown } from 'react-icons/fi';
import { ADM_DIKMA, CLIENTE_DIKMA, GESTAO, DIKMA_DIRETORIA, DEFAULT } from '../navigation/navigation';
import { Logout } from '../utils/logout';
import { FaCircle } from 'react-icons/fa';
import { useAuthStore } from '../store/storeApp';

type OpenAccordionState = {
    [key: string]: boolean;
};

const STORAGE_KEY = 'lastOpenedAccordion';

export default function Sidebar() {

    const pathname = usePathname();
    const { userType } = useAuthStore();
    const [mounted, setMounted] = useState(false);
    const [openAccordion, setOpenAccordion] = useState<OpenAccordionState>({});

    const getNavItems = () => {
        switch (userType) {
            case 'DEFAULT':
                return DEFAULT;
            case 'ADM_DIKMA':
                return ADM_DIKMA;
            case 'CLIENTE_DIKMA':
                return CLIENTE_DIKMA;
            case 'GESTAO':
                return GESTAO;
            case 'DIKMA_DIRETORIA':
                return DIKMA_DIRETORIA;
            default:
                return [];
        }
    };

    useEffect(() => {
        const savedState = sessionStorage.getItem(STORAGE_KEY);
        if (savedState) {
            try {
                setOpenAccordion(JSON.parse(savedState));
            } catch (error) {
                console.error('Failed to parse saved accordion state', error);
            }
        }
    }, []);

    if (typeof sessionStorage !== 'undefined' && pathname === '/') {
        sessionStorage.clear();
    }

    const handleAccordionToggle = (itemName: string) => {

        if (itemName === '/' || itemName === 'predio') {
            setOpenAccordion({});
            sessionStorage.clear();
        }

        setOpenAccordion(prev => {
            const newState: OpenAccordionState = {};
            newState[itemName] = !prev[itemName];
            return newState;
        });

        const lastAcordeon: OpenAccordionState = { [itemName]: true };
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(lastAcordeon));
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || !userType) return null;

    return (
        <aside className="w-[100%] h-full bg-[#fff] text-white flex flex-col justify-between p-5">
            <Box className="flex flex-col gap-10">
                <Box
                    onClick={() => handleAccordionToggle("/")}
                    className="text-2xl font-bold"><Image src={Logo} alt="Logo" objectFit='contain' className="w-[130px]" /></Box>
                <nav className="flex-1 space-y-2">
                    <Box className="font-medium text-[1.1rem] text-[#B9B9C3] mb-5">Menu</Box>
                    {getNavItems()?.map(({ name, href, icon: Icon, subItems }) => (
                        subItems ? (
                            <Box key={name}>
                                <Box
                                    className={`group flex items-center mb-2 justify-between px-4 py-2 rounded transition-colors hover:bg-[#00B288] cursor-pointer ${openAccordion[name] ? 'bg-[#00B288] text-white' : ''}`}
                                    onClick={() => handleAccordionToggle(name)}
                                >
                                    <Box className="flex items-center gap-3">
                                        <Icon className="transition-colors group-hover:!text-white" color={openAccordion[name] ? '#fff' : '#5E5873'} size={25} />
                                        <span className={`font-medium text-[1.2rem] ${openAccordion[name] ? 'text-white' : 'text-[#5E5873]'} group-hover:text-white transition-colors tracking-3`}>
                                            {name}
                                        </span>
                                    </Box>
                                    <FiChevronDown
                                        className={`transition-transform duration-300 ${openAccordion[name] ? 'rotate-180 text-white' : 'text-[#5E5873]'}`}
                                        size={20}
                                    />
                                </Box>
                                <Collapse in={openAccordion[name]}>
                                    {subItems.map(({ icon: Icon, name: subName, href: subHref }) => (
                                        <Link key={subName} href={subHref} className={`group flex items-center mb-2 px-10 py-2 gap-2 rounded transition-colors hover:bg-[#00B288]`}>
                                            {Icon && <FaCircle className={`${pathname === subHref ? 'text-[#1e876e] animate-pulse' : 'text-[#dbdbdb]'} `} size={10} />}
                                            <span className={`font-medium text-[1.1rem] ${pathname === subHref ? 'text-[#5E5873]' : 'text-[#5E5873]'} group-hover:text-white transition-colors tracking-3`}>
                                                {subName}
                                            </span>
                                        </Link>
                                    ))}
                                </Collapse>
                            </Box>
                        ) : (
                            <Link
                                onClick={() => handleAccordionToggle(name)}
                                key={name} href={href as string} className={`group flex items-center space-x-3 px-4 py-2 rounded transition-colors hover:bg-[#00B288] ${pathname === href ? 'bg-[#00B288] text-white' : ''}`}>
                                <Icon className="transition-colors group-hover:!text-white" color={pathname === href ? '#fff' : '#5E5873'} size={25} />
                                <span className={`font-medium text-[1.2rem] ${pathname === href ? 'text-white' : 'text-[#5E5873]'} group-hover:text-white transition-colors tracking-3`}>
                                    {name}
                                </span>
                            </Link>
                        )
                    ))}
                </nav>
            </Box>
            <Box className="flex flex-row items-center justify-between w-[100%]">
                <Box className="flex flex-row gap-3 items-center">
                    <Box className="relative">
                        <img className="w-[60px] h-[60px] rounded-full object-cover" src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg" alt="Logout Icon" />
                        <Box className="absolute bottom-0 right-0 w-[27px] h-[27px] bg-[#00B288] rounded-full flex justify-center items-center z-10">
                            <IoMdSettings color="#fff" size={16} />
                        </Box>
                    </Box>
                    <Box>
                        <span className="font-medium text-[1rem] text-[#5E5873]">Juliana Santos</span>
                        <Box className="text-[#B9B9C3] text-[.9rem]">Admin</Box>
                    </Box>
                </Box>
                <Box onClick={() => Logout()} component="div">
                    <IoLogOutOutline color='#5E5873' size={35} className='cursor-pointer' />
                </Box>
            </Box>
        </aside>
    );
}