import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import Textarea from './TextArea.svelte'; // Ensure correct import path

describe('Textarea Component', () => {
  
  it('renders the textarea with the correct label', () => {
    render(Textarea, { props: { inputKey: 'Description' } });

    // ✅ Ensure label is displayed
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('displays initial character count correctly', () => {
    render(Textarea, { props: { inputKey: 'Comment', inputValue: '', maxLength: 500 } });

    // ✅ Check length indicator
    expect(screen.getByText('0/500')).toBeInTheDocument();
  });

  it('updates character count dynamically as user types', async () => {
    const user = userEvent.setup();
    render(Textarea, { props: { inputKey: 'Notes', inputValue: '', maxLength: 200 } });

    const textarea = screen.getByRole('textbox');

    // Type some text
    await user.type(textarea, 'Hello');

    // ✅ Check updated length count
    expect(screen.getByText('5/200')).toBeInTheDocument();
  });
  it('prevents entering more than maxLength characters', async () => {
    const user = userEvent.setup();
    render(Textarea, { props: { inputKey: 'Summary', maxLength: 6 } });

    const textarea = screen.getByRole('textbox');

    // Try entering more than maxLength
    await user.type(textarea, 'exceeding');

    // ✅ Ensure only maxLength characters are entered
    expect(textarea.value.length).toBe(6);
    expect(textarea.validity.tooLong).toBe(false);
  });

  it('rejects invalid characters based on pattern', async () => {
    const user = userEvent.setup();
    render(Textarea, { props: { inputKey: 'fdfsdfsdf#@$' } });

    const textarea = screen.getByRole('textbox');

    await user.type(textarea, 'punctuation (like !, @, #, $, %, etc.), special characters (like &, *, (, ), +, =, etc.), underscores (_), accented or non-English letters, and any other symbols would be disallowed.');
    await user.tab();

    // ✅ Ensure patternMismatch is triggered
    expect(textarea.validity.customError).toBe(true);
  });

  it('has a `name` attribute in lowercase', () => {
    render(Textarea, { props: { inputKey: 'Message' } });

    const textarea = screen.getByRole('textbox');

    // ✅ Ensure name attribute matches inputKey.toLowerCase()
    expect(textarea).toHaveAttribute('name', 'message');
  });



});