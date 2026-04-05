import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import AuthHomePage from '@/modules/auth/pages/HomePage';
import { renderWithProviders } from '@/shared/test/renderWithProviders';

describe('Auth module', () => {
  it('renders the auth home page', () => {
    renderWithProviders(<AuthHomePage />);

    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });
});
