import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import ErrorMessage from './ErrorMessage.svelte'; // Ensure the correct import path

describe('ErrorMessage Component', () => {
  
  it('renders an error message when formMessage.success is false', () => {
    const formMessage = { success: false, message: 'There was an error' };
    render(ErrorMessage, { props: { formMessage } });

    // Expect the alert div to be present
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();

    // Expect the message to be displayed
    expect(screen.getByText('There was an error')).toBeInTheDocument();
  });

  it('does not render anything when formMessage is undefined', () => {
    render(ErrorMessage, { props: { formMessage: undefined } });

    // There should be no alert in the document
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('does not render anything when formMessage.success is true', () => {
    const formMessage = { success: true, message: 'Success message' };
    render(ErrorMessage, { props: { formMessage } });

    // The alert should not be in the DOM since success is true
    expect(screen.queryByRole('alert')).toBeNull();
  });

});