import {
	UsersOutline,
	ChartOutline,
	CameraPhotoOutline,
	FolderOutline,
	CalendarMonthOutline,
	FileLinesOutline,
	ChartPieOutline
} from 'flowbite-svelte-icons';

export const navigation = [
	{
		name: 'Dashboard',
		href: '/dashboard',
		icon: ChartOutline,
		permission: 'canSeeDashboard'
	},
	{
		name: 'New Ticket',
		href: '/dashboard/tickets/new',
		icon: CameraPhotoOutline,
		permission: 'canCrudTickets'
	},
	{
		name: 'Tickets',
		href: '/dashboard/tickets',
		icon: FolderOutline,
		count: 'opentickets',
		permission: 'canCrudTickets'
	},
	{ name: 'Users', href: '/dashboard/users', icon: UsersOutline, permission: 'canCrudUsers' }
	// { name: 'Calendar', href: '#', icon: CalendarMonthOutline, count: '20+', permission: '' },
	// { name: 'Documents', href: '#', icon: FileLinesOutline, permission: '' },
	// { name: 'Reports', href: '#', icon: ChartPieOutline, permission: '' },
];
