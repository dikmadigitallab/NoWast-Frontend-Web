import { MdOutlinePlace } from 'react-icons/md';
import { RxDashboard } from 'react-icons/rx';
import { IoHomeOutline, IoNotificationsCircleOutline } from "react-icons/io5";
import { FaRegBuilding, FaRegCalendar, FaRegCircle } from 'react-icons/fa';
import { GrUserAdmin } from "react-icons/gr";
import { FiBox, FiUser } from 'react-icons/fi';
import { BsBuildings } from 'react-icons/bs';

type SubItem = { icon?: React.ComponentType<{ className?: string; color?: string; size?: number }>; name: string; href: string };

type NavItem = {
    name: string;
    href?: string;
    icon: React.ComponentType<{ className?: string; color?: string; size?: number }>;
    subItems?: SubItem[];
};

export const DEFAULT: NavItem[] = [
    {
        name: 'Início', href: '/',
        icon: IoHomeOutline,
    }
];

export const ADM_CLIENTE: NavItem[] = [
    {
        name: 'Dashboard',
        icon: RxDashboard,
        subItems: [
            { icon: FaRegCircle, name: 'Atividades', href: '/dashboard/atividades' },
            { icon: FaRegCircle, name: 'Localização', href: '/dashboard/localizacao' },
        ]
    },
];

export const ADM_DIKMA: NavItem[] = [
    {
        name: 'Início',
        href: '/',
        icon: IoHomeOutline,
    },
    {
        name: 'Dashboard',
        icon: RxDashboard,
        subItems: [
            { icon: FaRegCircle, name: 'Atividades', href: '/dashboard/atividades' },
            { icon: FaRegCircle, name: 'Localização', href: '/dashboard/localizacao' },
        ]
    },
    {
        name: 'Negócios',
        icon: FaRegBuilding,
        subItems: [
            { icon: FaRegCircle, name: 'Empresa', href: '/empresa/listagem' },
            { icon: FaRegCircle, name: 'Contrato', href: '/contrato/listagem' },
        ]
    },
    {
        name: 'Itens',
        icon: FiBox,
        subItems: [
            { icon: FaRegCircle, name: 'EPI', href: '/items/epi/listagem' },
            { icon: FaRegCircle, name: 'Equipamento', href: '/items/equipamento/listagem' },
            { icon: FaRegCircle, name: 'Produto', href: '/items/produto/listagem' },
            { icon: FaRegCircle, name: 'Transporte', href: '/items/transporte/listagem' },
        ]
    },
    {
        name: 'Locais',
        icon: MdOutlinePlace,
        subItems: [
            { icon: FaRegCircle, name: 'Prédio', href: '/locais/predio/listagem' },
            { icon: FaRegCircle, name: 'Setor', href: '/locais/setor/listagem' },
            { icon: FaRegCircle, name: 'Ambiente', href: '/locais/ambiente/listagem' }
        ]
    },
    {
        name: 'Atividades',
        icon: FaRegCalendar,
        subItems: [
            { icon: FaRegCircle, name: 'Listagem', href: '/atividade/listagem' }
        ]
    },
    {
        name: 'Notificações', href: '/notificacoes',
        icon: IoNotificationsCircleOutline,
    },
    {
        name: 'Pessoas',
        icon: GrUserAdmin,
        subItems: [
            { icon: FaRegCircle, name: 'Listagem', href: '/usuario/listagem' },
        ]
    },
];

export const CLIENTE_DIKMA: NavItem[] = [
    {
        name: 'Início', href: '/',
        icon: IoHomeOutline,
    },
    {
        name: 'Dashboard',
        icon: RxDashboard,
        subItems: [
            { icon: FaRegCircle, name: 'Atividades', href: '/dashboard/atividades' },
            { icon: FaRegCircle, name: 'Localização', href: '/dashboard/localizacao' },
        ]
    },
    {
        name: 'Pessoas',
        icon: FiUser,
        subItems: [
            { icon: FaRegCircle, name: 'Listagem', href: '/pessoas/listagem' }
        ]
    },
    {
        name: 'Itens',
        icon: FiBox,
        subItems: [
            { icon: FaRegCircle, name: 'EPI', href: '/items/epi/listagem' },
            { icon: FaRegCircle, name: 'Equipamento', href: '/items/equipamento/listagem' },
            { icon: FaRegCircle, name: 'Produto', href: '/items/produto/listagem' },
            { icon: FaRegCircle, name: 'Transporte', href: '/items/transporte/listagem' },
        ]
    },
    {
        name: 'Locais',
        icon: MdOutlinePlace,
        subItems: [
            { icon: FaRegCircle, name: 'Prédio', href: '/locais/predio/listagem' },
            { icon: FaRegCircle, name: 'Setor', href: '/locais/setor/listagem' },
            { icon: FaRegCircle, name: 'Ambiente', href: '/locais/ambiente/listagem' }
        ]
    },
    {
        name: 'Atividades',
        icon: FaRegCalendar,
        subItems: [
            { icon: FaRegCircle, name: 'Listagem', href: '/atividade/listagem' }
        ]
    }
];

export const GESTAO: NavItem[] = [
    {
        name: 'Início', href: '/',
        icon: IoHomeOutline,
        subItems: [
            { icon: FaRegCircle, name: 'Módulos', href: '/' },
            { icon: FaRegCircle, name: 'Prédios', href: '/modulos/predios' },
        ]
    },
    {
        name: 'Dashboard',
        icon: RxDashboard,
        subItems: [
            { icon: FaRegCircle, name: 'Atividades', href: '/dashboard/atividades' },
            { icon: FaRegCircle, name: 'Localização', href: '/dashboard/localizacao' },
        ]
    },
    {
        name: 'Prédios', href: '/predio/listagem',
        icon: BsBuildings,
    },
    {
        name: 'Notificações', href: '/notificacoes',
        icon: IoNotificationsCircleOutline,
    },
];

export const DIKMA_DIRETORIA: NavItem[] = [
    {
        name: 'Início', href: '/',
        icon: IoHomeOutline,
        subItems: [
            { icon: FaRegCircle, name: 'Módulos', href: '/' },
            { icon: FaRegCircle, name: 'Empresas', href: '/modulos/empresas' },
        ]
    },
    {
        name: 'Dashboard',
        icon: RxDashboard,
        subItems: [
            { icon: FaRegCircle, name: 'Atividades', href: '/dashboard/atividades' },
            { icon: FaRegCircle, name: 'Localização', href: '/dashboard/localizacao' },
        ]
    },
    {
        name: 'Notificações', href: '/notificacoes',
        icon: IoNotificationsCircleOutline,
    },
];