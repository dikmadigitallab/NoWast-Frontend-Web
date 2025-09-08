'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Box, Collapse } from '@mui/material';
import { FiChevronDown, FiMenu, FiX } from 'react-icons/fi';
import { FaCircle } from 'react-icons/fa';
import Logo from "@/app/assets/logo-1.png";
import { ADM_DIKMA, ADM_CLIENTE, GESTAO, DIKMA_DIRECTOR, DEFAULT } from '../navigation/navigation';
import { useAuthStore } from '../store/storeApp';
import UserFooter from './userFooter';
import { useSelectModule } from '../store/isSelectModule';

type OpenAccordionState = {
    [key: string]: boolean;
};

const STORAGE_KEY = 'lastOpenedAccordion';

export default function MobileNavigation() {
    const pathname = usePathname();
    const { userType } = useAuthStore();
    const [mounted, setMounted] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isSelectModule } = useSelectModule();
    const [openAccordion, setOpenAccordion] = useState<OpenAccordionState>({});

    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isMenuOpen]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
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

    const getNavItems = () => {
        if (!isSelectModule) {
            return DEFAULT;
        }

        switch (userType) {
            case 'DEFAULT':
                return DEFAULT;
            case 'ADM_DIKMA':
                return ADM_DIKMA;
            case 'ADM_CLIENTE':
                return ADM_CLIENTE;
            case 'GESTAO':
                return GESTAO;
            case 'DIKMA_DIRECTOR':
                return DIKMA_DIRECTOR;
            default:
                return [];
        }
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || !userType || (pathname === "/sign-in" || pathname === "/forgot-pass" || pathname === "/recover-pass")) return null;

    return (
        <>
            <header className="w-full xl:hidden fixed top-0 h-[50px] bg-white shadow-md z-40">
                <div className="h-full px-4 py-3 flex justify-between items-center ">
                    <Link href="/" className="flex items-center">
                        <Image src={Logo} alt="Logo" width={80} height={30} priority />
                    </Link>
                    <button onClick={toggleMenu} className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none transition-colors duration-200" aria-label="Menu">
                        {isMenuOpen ? (<FiX className="w-6 h-6" />) : (<FiMenu className="w-6 h-6" />)}
                    </button>
                </div>
            </header>

            <div className={`xl:hidden fixed inset-0 bg-[#00000047] bg-opacity-50 z-30 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={toggleMenu} />

            <aside className={`xl:hidden fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-40 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="h-full flex flex-col">
                    <div className="p-4 border-b flex justify-between items-center bg-[#00B288] text-white">
                        <Image src={Logo} alt="Logo" width={100} height={30} className="h-8 w-auto" />
                        <button onClick={toggleMenu} className="p-1 rounded-full hover:bg-white/20 transition-colors duration-200">
                            <FiX className="w-5 h-5" />
                        </button>
                    </div>
                    <nav className="flex-1 overflow-y-auto py-4 px-2">
                        <Box className="font-medium text-[1.1rem] text-[#B9B9C3] mb-5 px-4">Menu</Box>
                        {getNavItems()?.map(({ name, href, icon: Icon, subItems }) =>
                            subItems ? (
                                <Box key={name} className="mb-1">
                                    <Box
                                        className={`group flex items-center justify-between px-4 py-2 rounded transition-colors hover:bg-[#00B288] cursor-pointer ${openAccordion[name] ? 'bg-[#00B288] text-white' : ''}`}
                                        onClick={() => handleAccordionToggle(name)}
                                    >
                                        <Box className="flex items-center gap-3">
                                            <Icon className="transition-colors group-hover:!text-white" color={openAccordion[name] ? '#fff' : '#5E5873'} size={25} />
                                            <span className={`font-medium text-[1rem] ${openAccordion[name] ? 'text-white' : 'text-[#5E5873]'} group-hover:text-white transition-colors tracking-3`}>
                                                {name}
                                            </span>
                                        </Box>
                                        <FiChevronDown className={`transition-transform duration-300 ${openAccordion[name] ? 'rotate-180 text-white' : 'text-[#5E5873]'}`} size={20} />
                                    </Box>
                                    <Collapse in={openAccordion[name]}>
                                        {subItems.map(({ icon: SubIcon, name: subName, href: subHref, subItems: nestedSubItems }) =>
                                            nestedSubItems ? (
                                                <Box key={subName} className="pl-6">
                                                    <Box
                                                        className={`group flex items-center justify-between px-4 py-2 rounded transition-colors hover:bg-[#00B288] cursor-pointer ${openAccordion[subName] ? 'bg-[#00B288] text-white' : ''}`}
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
                                                        {nestedSubItems.map(({ icon: NestedIcon, name: nestedName, href: nestedHref }) => (
                                                            <Link
                                                                key={nestedName}
                                                                href={nestedHref[0]}
                                                                className={`group flex items-center mb-2  px-10 py-2 gap-2 rounded transition-colors hover:bg-[#00B288] ${nestedHref.includes(pathname) ? 'bg-[#00B288]/10' : ''}`}
                                                            >
                                                                {NestedIcon && <FaCircle className={`${nestedHref.includes(pathname) ? 'text-[#1e876e] animate-pulse' : 'text-[#dbdbdb]'}`} size={10} />}
                                                                <span className={`font-medium text-[1rem] ${nestedHref.includes(pathname) ? 'text-[#1e876e]' : 'text-[#5E5873]'} group-hover:text-white transition-colors tracking-3`}>
                                                                    {nestedName}
                                                                </span>
                                                            </Link>
                                                        ))}
                                                    </Collapse>
                                                </Box>
                                            ) : (
                                                <Link
                                                    key={subName}
                                                    href={subHref[0]}
                                                    className={`group flex mt-2 items-center mb-2 px-8 py-2 gap-2 rounded transition-colors hover:bg-[#00B288] ${subHref.includes(pathname) ? 'bg-[#00B288]/10' : ''}`}
                                                >
                                                    {SubIcon && <FaCircle className={`${subHref.includes(pathname) ? 'text-[#1e876e] animate-pulse' : 'text-[#dbdbdb]'}`} size={10} />}
                                                    <span className={`font-medium text-[1rem] ${subHref.includes(pathname) ? 'text-[#1e876e]' : 'text-[#5E5873]'} group-hover:text-white transition-colors tracking-3`}>
                                                        {subName}
                                                    </span>
                                                </Link>
                                            )
                                        )}
                                    </Collapse>
                                </Box>
                            ) : (
                                <Link
                                    onClick={() => handleAccordionToggle(name)}
                                    key={name}
                                    href={href ? href[0] : '#'}
                                    className={`group flex items-center px-4 py-2 gap-3 rounded transition-colors mb-1 hover:bg-[#00B288] ${href?.includes(pathname) ? 'bg-[#00B288] text-white' : ''}`}
                                >
                                    <Icon className="transition-colors group-hover:!text-white" color={href?.includes(pathname) ? '#fff' : '#5E5873'} size={25} />
                                    <span className={`font-medium text-[1rem] ${href?.includes(pathname) ? 'text-white' : 'text-[#5E5873]'} group-hover:text-white transition-colors tracking-3`}>
                                        {name}
                                    </span>
                                </Link>
                            )
                        )}
                    </nav>

                    <div className="p-4 border-t-1 border-solid border-[#0000000a]">
                        <UserFooter />
                    </div>
                </div>
            </aside>

            <div className="h-16 xl:hidden"></div>
        </>
    );
}