// src/lib/navigation.js
import {
	HomeOutline,
	CameraPhotoOutline,
	FolderOutline,
	UsersOutline,
	CalendarWeekOutline,
	FileDocOutline,
	ChartPieOutline
} from 'flowbite-svelte-icons';

// Define the navigation items
export const navigation = [
	{ name: 'Dashboard', href: '/dashboard', icon: HomeOutline, count: '5', current: false },
	{ name: 'New Ticket', href: '/dashboard/newticket', icon: CameraPhotoOutline, current: false },
	{ name: 'Tickets', href: '/dashboard/tickets', icon: FolderOutline, count: '12', current: false },
	{ name: 'Users', href: '/dashboard/users', icon: UsersOutline, current: false },
	{
		name: 'Calendar',
		href: '/dashboard/calendar',
		icon: CalendarWeekOutline,
		count: '20+',
		current: false
	},
	{ name: 'Documents', href: '/dashboard/documents', icon: FileDocOutline, current: false },
	{ name: 'Reports', href: '/dashboard/reports', icon: ChartPieOutline, current: false }
];
