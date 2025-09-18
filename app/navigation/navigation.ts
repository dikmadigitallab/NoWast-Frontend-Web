import { MdOutlinePlace } from 'react-icons/md';
import { RxDashboard } from 'react-icons/rx';
import { IoHomeOutline, IoNotificationsCircleOutline } from "react-icons/io5";
import { FaRegBuilding, FaRegCalendar, FaRegCalendarAlt, FaRegCircle } from 'react-icons/fa';
import { GrUserAdmin } from "react-icons/gr";
import { FiBox } from 'react-icons/fi';

type SubItem = {
    icon?: React.ComponentType<{ className?: string; color?: string; size?: number }>;
    name: string;
    href: string[];
    subItems?: SubItem[];
};

type NavItem = {
    name: string;
    href?: string[];
    icon: React.ComponentType<{ className?: string; color?: string; size?: number }>;
    subItems?: SubItem[];
};

export const DEFAULT: NavItem[] = [
    {
        name: 'Início',
        href: ['/'],
        icon: IoHomeOutline,
    }
];

export const ADM_DIKMA: NavItem[] = [
    {
        name: 'Início',
        href: ['/'],
        icon: IoHomeOutline,
    },
    {
        name: 'Dashboard',
        icon: RxDashboard,
        subItems: [
            { icon: FaRegCircle, name: 'Atividades', href: ['/dashboard/atividades'] },
            { icon: FaRegCircle, name: 'Localização', href: ['/dashboard/localizacao'] },
            { icon: FaRegCircle, name: 'Cadastro', href: ['/dashboard/cadastros'] },
        ]
    },
    {
        name: 'Locais',
        icon: MdOutlinePlace,
        subItems: [
            { icon: FaRegCircle, name: 'Prédio', href: ['/locais/predio/listagem', '/locais/predio/cadastro', '/locais/predio/atualizar'] },
            { icon: FaRegCircle, name: 'Setor', href: ['/locais/setor/listagem', '/locais/setor/cadastro', '/locais/setor/atualizar'] },
            { icon: FaRegCircle, name: 'Ambiente', href: ['/locais/ambiente/listagem', '/locais/ambiente/cadastro', '/locais/ambiente/atualizar'] }
        ]
    },
    {
        name: 'Itens',
        icon: FiBox,
        subItems: [
            { icon: FaRegCircle, name: 'EPI', href: ['/items/epi/listagem', '/items/epi/cadastro', '/items/epi/atualizar'] },
            { icon: FaRegCircle, name: 'Equipamento', href: ['/items/equipamento/listagem', '/items/equipamento/cadastro', '/items/equipamento/atualizar'] },
            { icon: FaRegCircle, name: 'Produto', href: ['/items/produto/listagem', '/items/produto/cadastro', '/items/produto/atualizar'] },
            { icon: FaRegCircle, name: 'Transporte', href: ['/items/transporte/listagem', '/items/transporte/cadastro', '/items/transporte/atualizar'] },
        ]
    },
    {
        name: 'Atividades',
        icon: FaRegCalendar,
        subItems: [
            { icon: FaRegCircle, name: 'Listagem', href: ['/atividade/listagem', '/atividade/cadastro', '/atividade/atualizar'] }
        ]
    },
    {
        name: 'Pessoas',
        icon: GrUserAdmin,
        href: ['/usuario/listagem']
    },
    {
        name: 'Cronograma',
        icon: FaRegCalendarAlt,
        href: ['/calendar']
    },
    {
        name: 'Notificações',
        href: ['/notificacoes'],
        icon: IoNotificationsCircleOutline,
    },
];

export const ADM_CLIENTE: NavItem[] = [
    {
        name: 'Início',
        href: ['/'],
        icon: IoHomeOutline,
    },
    {
        name: 'Dashboard',
        icon: RxDashboard,
        subItems: [
            { icon: FaRegCircle, name: 'Atividades', href: ['/dashboard/atividades'] },
            { icon: FaRegCircle, name: 'Localização', href: ['/dashboard/localizacao'] },
            { icon: FaRegCircle, name: 'Cadastro', href: ['/dashboard/cadastros'] },
        ]
    },
];

export const GESTAO: NavItem[] = [
    {
        name: 'Início',
        href: ['/'],
        icon: IoHomeOutline,
        subItems: [
            { icon: FaRegCircle, name: 'Módulos', href: ['/'] },
            { icon: FaRegCircle, name: 'Prédios', href: ['/modulos/predios'] },
        ]
    },
    {
        name: 'Dashboard',
        icon: RxDashboard,
        subItems: [
            { icon: FaRegCircle, name: 'Atividades', href: ['/dashboard/atividades'] },
            { icon: FaRegCircle, name: 'Localização', href: ['/dashboard/localizacao'] },
            { icon: FaRegCircle, name: 'Cadastro', href: ['/dashboard/cadastros'] },
        ]
    },
    {
        name: 'Notificações',
        href: ['/notificacoes'],
        icon: IoNotificationsCircleOutline,
    },
];

export const DIKMA_DIRECTOR: NavItem[] = [
    {
        name: 'Início',
        href: ['/'],
        icon: IoHomeOutline,
        subItems: [
            { icon: FaRegCircle, name: 'Módulos', href: ['/'] }
        ]
    },
    {
        name: "Unidades",
        icon: FaRegBuilding,
        subItems: [
            { icon: FaRegCircle, name: 'Empresas', href: ['/modulos/empresas'] },
            { icon: FaRegCircle, name: 'Prédios', href: ['/modulos/predios'] },
        ]
    },
    {
        name: 'Dashboard',
        icon: RxDashboard,
        subItems: [
            { icon: FaRegCircle, name: 'Atividades', href: ['/dashboard/atividades'] },
            { icon: FaRegCircle, name: 'Localização', href: ['/dashboard/localizacao'] },
            { icon: FaRegCircle, name: 'Cadastro', href: ['/dashboard/cadastros'] },
        ]
    },
    {
        name: 'Notificações',
        href: ['/notificacoes'],
        icon: IoNotificationsCircleOutline,
    },
];