'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import Logo from "@/app/assets/logo-1.png";
import { usePathname } from 'next/navigation';
import { Box, Collapse, Skeleton } from '@mui/material';
import { FiChevronDown } from 'react-icons/fi';
import { ADM_DIKMA, CLIENTE_DIKMA, GESTAO, DIKMA_DIRECTOR, DEFAULT } from '../navigation/navigation';
import { FaCircle } from 'react-icons/fa';
import { useAuthStore } from '../store/storeApp';
import UserFooter from './userFooter';
import { useSelectModule } from '../store/isSelectModule';

type OpenAccordionState = {
    [key: string]: boolean;
};

const STORAGE_KEY = 'lastOpenedAccordion';

export default function Sidebar() {

    const pathname = usePathname();
    const { userType } = useAuthStore();
    const [mounted, setMounted] = useState(false);
    const { isSelectModule, isSelectLoading } = useSelectModule();
    const [openAccordion, setOpenAccordion] = useState<OpenAccordionState>({});

    const getNavItems = () => {
        if (!isSelectModule) {
            return DEFAULT
        }
        switch (userType) {
            case 'DEFAULT':
                return DEFAULT;
            case 'Admin':
                return ADM_DIKMA;
            case 'CLIENTE_DIKMA':
                return CLIENTE_DIKMA;
            case 'GESTAO':
                return GESTAO;
            case 'DIKMA_DIRECTOR':
                return DIKMA_DIRECTOR;
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
        <aside className="w-[100%] h-full bg-[#fff] text-white flex flex-col justify-between p-3">
            <Box className="flex flex-col gap-10">
                <Box
                    onClick={() => handleAccordionToggle("/")}
                    className="text-2xl font-bold"><Image src={Logo} alt="Logo" objectFit='contain' className="w-[130px]" /></Box>
                <nav className="flex-1 space-y-2">
                    <Box className="font-medium text-[1.1rem] text-[#B9B9C3] mb-5">Menu</Box>
                    {
                        isSelectLoading ?
                            <Box className="flex flex-col gap-5 animate-pulsew-[100%]">
                                <Skeleton variant="rectangular" style={{ borderRadius: 5, width: "100%", height: 40 }} />
                                <Skeleton variant="rectangular" style={{ borderRadius: 5, width: "100%", height: 40 }} />
                                <Skeleton variant="rectangular" style={{ borderRadius: 5, width: "100%", height: 40 }} />
                                <Skeleton variant="rectangular" style={{ borderRadius: 5, width: "100%", height: 40 }} />
                                <Skeleton variant="rectangular" style={{ borderRadius: 5, width: "100%", height: 40 }} />
                                <Skeleton variant="rectangular" style={{ borderRadius: 5, width: "100%", height: 40 }} />
                            </Box>
                            :
                            getNavItems()?.map(({ name, href, icon: Icon, subItems }) => (
                                subItems ? (
                                    <Box key={name}>
                                        <Box
                                            className={`group flex items-center mb-2 justify-between px-4 py-2 rounded transition-colors hover:bg-[#00B288] cursor-pointer ${openAccordion[name] ? 'bg-[#00B288] text-white' : ''}`}
                                            onClick={() => handleAccordionToggle(name)}
                                        >
                                            <Box className="flex items-center gap-3">
                                                <Icon className="transition-colors group-hover:!text-white" color={openAccordion[name] ? '#fff' : '#5E5873'} size={25} />
                                                <span className={`font-medium text-[1rem] ${openAccordion[name] ? 'text-white' : 'text-[#5E5873]'} group-hover:text-white transition-colors tracking-3`}>
                                                    {name}
                                                </span>
                                            </Box>
                                            <FiChevronDown
                                                className={`transition-transform duration-300 ${openAccordion[name] ? 'rotate-180 text-white' : 'text-[#5E5873]'}`}
                                                size={20}
                                            />
                                        </Box>
                                        <Collapse in={openAccordion[name]}>
                                            {subItems.map(({ icon: SubIcon, name: subName, href: subHref, subItems: nestedSubItems }: any) => (
                                                nestedSubItems ? (
                                                    <Box key={subName} className="pl-6">
                                                        <Box
                                                            className={`group flex items-center mb-2 justify-between px-4 py-2 rounded transition-colors hover:bg-[#00B288] cursor-pointer ${openAccordion[subName] ? 'bg-[#00B288] text-white' : ''}`}
                                                            onClick={() => handleAccordionToggle(subName)}
                                                        >
                                                            <Box className="flex items-center gap-3">
                                                                {SubIcon && <SubIcon className="transition-colors group-hover:!text-white" color={openAccordion[subName] ? '#fff' : '#5E5873'} size={20} />}
                                                                <span className={`font-medium text-[1rem] ${openAccordion[subName] ? 'text-white' : 'text-[#5E5873]'} group-hover:text-white transition-colors tracking-3`}>
                                                                    {subName}
                                                                </span>
                                                            </Box>
                                                            <FiChevronDown
                                                                className={`transition-transform duration-300 ${openAccordion[subName] ? 'rotate-180 text-white' : 'text-[#5E5873]'}`}
                                                                size={18}
                                                            />
                                                        </Box>
                                                        <Collapse in={openAccordion[subName]}>
                                                            {nestedSubItems.map(({ icon: NestedIcon, name: nestedName, href: nestedHref }: any) => (
                                                                <Link key={nestedName} href={nestedHref} className={`group flex items-center mb-2 px-10 py-2 gap-2 rounded transition-colors hover:bg-[#00B288]`}>
                                                                    {NestedIcon && <FaCircle className={`${pathname === nestedHref ? 'text-[#1e876e] animate-pulse' : 'text-[#dbdbdb]'} `} size={10} />}
                                                                    <span className={`font-medium text-[1rem] ${pathname === nestedHref ? 'text-[#5E5873]' : 'text-[#5E5873]'} group-hover:text-white transition-colors tracking-3`}>
                                                                        {nestedName}
                                                                    </span>
                                                                </Link>
                                                            ))}
                                                        </Collapse>
                                                    </Box>
                                                ) : (
                                                    <Link key={subName} href={subHref} className={`group flex items-center mb-2 px-8 py-2 gap-2 rounded transition-colors`}>
                                                        {SubIcon && <FaCircle className={`${pathname === subHref ? 'text-[#1e876e] animate-pulse' : 'text-[#dbdbdb]'} `} size={10} />}
                                                        <span className={`font-medium text-[1rem] ${pathname === subHref ? 'text-[#5E5873]' : 'text-[#5E5873]'}  transition-colors tracking-3`}>
                                                            {subName}
                                                        </span>
                                                    </Link>
                                                )
                                            ))}
                                        </Collapse>
                                    </Box>
                                ) : (
                                    <Link
                                        onClick={() => handleAccordionToggle(name)}
                                        key={name} href={href as string} className={`group flex items-center space-x-3 px-4 py-2 rounded transition-colors hover:bg-[#00B288] ${pathname === href ? 'bg-[#00B288] text-white' : ''}`}>
                                        <Icon className="transition-colors group-hover:!text-white" color={pathname === href ? '#fff' : '#5E5873'} size={25} />
                                        <span className={`font-medium text-[1rem] ${pathname === href ? 'text-white' : 'text-[#5E5873]'} group-hover:text-white transition-colors tracking-3`}>
                                            {name}
                                        </span>
                                    </Link>
                                )
                            ))
                    }
                </nav>
            </Box>
            <UserFooter />
        </aside>
    );
}