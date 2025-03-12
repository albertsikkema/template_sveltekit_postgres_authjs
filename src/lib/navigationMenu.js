import {
    UsersOutline,
    ChartOutline,
    CameraPhotoOutline,
    FolderOutline,
    CalendarMonthOutline,
    FileLinesOutline,
    ChartPieOutline,
} from 'flowbite-svelte-icons';


export const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: ChartOutline, count: '5', permission: 'canSeeDashboard' },
    // { name: 'New Ticket', href: '/dashboard/newticket', icon: CameraPhotoOutline, permission: 'canCrudTickets' },
    { name: 'Tickets', href: '/dashboard/tickets', icon: FolderOutline, count: '12', permission: 'canCrudTickets' },
    { name: 'Users', href: '/dashboard/users', icon: UsersOutline, permission: 'canCrudUsers' },
    // { name: 'Calendar', href: '#', icon: CalendarMonthOutline, count: '20+', permission: '' },
    // { name: 'Documents', href: '#', icon: FileLinesOutline, permission: '' },
    // { name: 'Reports', href: '#', icon: ChartPieOutline, permission: '' },
]
