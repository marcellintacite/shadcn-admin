import {
  IconChecklist,
  IconLayoutDashboard,
  IconMessages,
  IconServerOff,
  IconSettings,
  IconUsers,
  IconBuilding,
  IconBook,
  IconChartArcs,
  IconZoomMoney,
  IconHospital,
  IconPlus,
} from '@tabler/icons-react'

export interface NavLink {
  title: string
  label?: string
  href: string
  icon: JSX.Element
  roles: string[]
}

export interface SideLink extends NavLink {
  sub?: NavLink[]
}

export const sidelinks: SideLink[] = [
  {
    title: 'Tableau de bord',
    href: '/dashboard',
    icon: <IconLayoutDashboard size={18} />,
    roles: ['admin_global', 'admin_zone', 'agent_structure'], // Accessible par tous
  },
  {
    title: 'Membres',
    href: '/dashboard/members',
    icon: <IconChecklist size={18} />,
    roles: ['admin_zone'],
  },
  {
    title: 'Vérification des membres',
    href: '/dashboard/members-verification',
    icon: <IconChecklist size={18} />,
    roles: ['agent_structure'],
  },
  {
    title: 'Traitement des membres',
    href: '/dashboard/members-treatment',
    icon: <IconHospital size={18} />,
    roles: ['agent_structure'],
  },
  {
    title: 'Chat',
    label: '9',
    href: '/dashboard/chats',
    icon: <IconMessages size={18} />,
    roles: ['admin_zone', 'agent_structure'],
  },
  {
    title: 'Zone de santé',
    href: '/dashboard/health-zone',
    icon: <IconBuilding size={18} />,
    roles: ['admin_global'],
    sub: [
      {
        title: 'Gérer',
        href: '/dashboard/health-zone/',
        icon: <IconPlus size={18} />,
        roles: ['admin_global'],
      },
      {
        title: 'Membres',
        href: '/dashboard/health-zone/members',
        icon: <IconUsers size={18} />,
        roles: ['admin_global'],
      },
      {
        title: 'Statistiques',
        href: '/dashboard/health-zone/statistics',
        icon: <IconChartArcs size={18} />,
        roles: ['admin_global'],
      },
    ],
  },
  {
    title: 'Rapports',
    href: '/dashboard/reports',
    icon: <IconBook size={18} />,
    roles: ['admin_global', 'admin_zone'],
  },
  {
    title: 'Utilisateurs',
    href: '/dashboard/users',
    icon: <IconUsers size={18} />,
    roles: ['admin_global'],
  },
  {
    title: 'Paiements',
    href: '/dashboard/subscriptions',
    icon: <IconZoomMoney size={18} />,
    roles: ['admin_global', 'admin_zone'],
  },
  {
    title: 'Structure sanitaire',
    href: '/dashboard/health-facility',
    icon: <IconBuilding size={18} />,
    roles: ['admin_zone'],
    sub: [
      {
        title: 'Liste des structures',
        href: '/dashboard/health-facility/list',
        icon: <IconBook size={18} />,
        roles: ['admin_zone'],
      },
      {
        title: 'Maps',
        href: '/dashboard/health-facility/maps',
        icon: <IconServerOff size={18} />,
        roles: ['admin_zone'],
      },
    ],
  },
  {
    title: 'Paramètres',
    href: '/dashboard/settings',
    icon: <IconSettings size={18} />,
    roles: ['admin_global', 'admin_zone'],
  },
]
