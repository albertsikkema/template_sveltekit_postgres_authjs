import {
	HomeIcon,
	CameraIcon,
	FolderIcon,
	UsersIcon,
	ChartBarIcon
} from 'heroicons-svelte/24/outline';

export const navigation = [
	{
		name: 'Start',
		href: '/',
		icon: HomeIcon
	},
	{
		name: 'Dashboard',
		href: '/dashboard',
		icon: ChartBarIcon,
		permission: 'canSeeDashboard'
	},
	// {
	// 	name: 'New Ticket',
	// 	href: '/dashboard/tickets/new',
	// 	icon: CameraIcon,
	// 	permission: 'canCrudTickets'
	// },
	// {
	// 	name: 'Tickets',
	// 	href: '/dashboard/tickets',
	// 	icon: FolderIcon,
	// 	count: 'opentickets',
	// 	permission: 'canCrudTickets'
	// },
	{ name: 'Users', href: '/dashboard/users', icon: UsersIcon, permission: 'canCrudUsers' }
	// { name: 'Calendar', href: '#', icon: CalendarMonthOutline, count: '20+', permission: '' },
	// { name: 'Documents', href: '#', icon: FileLinesOutline, permission: '' },
	// { name: 'Reports', href: '#', icon: ChartPieOutline, permission: '' },
];
