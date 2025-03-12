// Footer.test.js 

import { render } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import Footer from './Footer.svelte';

describe('Footer component', () => {
    it('renders correctly with the current year and expected text', () => {
        // Calculate the expected current year.
        const currentYear = new Date().getFullYear();
        const { container, getByText } = render(Footer);

        // Verify that the footer element is present with the proper classes.
        const footer = container.querySelector('footer');
        expect(footer).toBeInTheDocument();
        // Check for classes like 'hidden', 'md:block', etc.
        expect(footer.className).toMatch(/footer/);
        expect(footer.className).toMatch(/hidden/);
        expect(footer.className).toMatch(/md:block/);

        // Verify the copyright text is rendered with the current year.
        const copyrightText = `Copyright © ${currentYear} - ePublic Solutions BV`;
        expect(getByText(copyrightText)).toBeInTheDocument();

    });
});