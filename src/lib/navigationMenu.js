import { HomeIcon, CameraIcon, FolderIcon, UsersIcon } from 'heroicons-svelte/24/outline';

export const navigation = [
	{
		name: 'Dashboard',
		href: '/dashboard',
		icon: HomeIcon,
		permission: 'canSeeDashboard'
	},
	{
		name: 'New Ticket',
		href: '/dashboard/tickets/new',
		icon: CameraIcon,
		permission: 'canCrudTickets'
	},
	{
		name: 'Tickets',
		href: '/dashboard/tickets',
		icon: FolderIcon,
		count: 'opentickets',
		permission: 'canCrudTickets'
	},
	{ name: 'Users', href: '/dashboard/users', icon: UsersIcon, permission: 'canCrudUsers' }
	// { name: 'Calendar', href: '#', icon: CalendarMonthOutline, count: '20+', permission: '' },
	// { name: 'Documents', href: '#', icon: FileLinesOutline, permission: '' },
	// { name: 'Reports', href: '#', icon: ChartPieOutline, permission: '' },
];
