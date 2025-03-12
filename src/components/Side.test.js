// Side.test.js 

import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import { writable } from 'svelte/store';
import Side from './Side.svelte';

vi.mock('lib/navigationMenu', () => {
    const DummyIcon = {
        $render: () => '<span data-testid="dummy-icon">Icon</span>'
    };
    return {
        navigation: [
            {
                name: 'Dashboard',
                href: '/dashboard',
                icon: DummyIcon,
                permission: 'canSeeDashboard',
                count: 2
            },
            {
                name: 'Settings',
                href: '/settings',
                icon: DummyIcon,
                permission: 'dummy'
            }
        ]
    };
});

vi.mock('$app/stores', () => {
    return {
        page: writable({ url: new URL('http://localhost/dashboard ') })
    };
});

describe('Side component', () => {
    it('renders the desktop sidebar', async () => {
        render(Side, { props: { data: {} } });
        // Verify that the upper section with the title is present.
        expect(screen.getByText('Beheer')).toBeInTheDocument();
    });

    it('renders the mobile dock navigation correctly', () => {
        render(Side, { props: { data: {} } });
        // find if there is a class='dock-label' in the screen
        const dockLabels = screen.getAllByText((content, element) => {
            return element?.classList && element.classList.contains('dock-label');
          });
        expect(dockLabels.length).toBeGreaterThan(0);
    });
});