import { render, fireEvent, screen } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Page from './+page.svelte'; 

describe('Page component', () => {
  const dummyForm = {}; 

  it('renders the header "Dashboard"', () => {
    render(Page);
    expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
  }); 
});