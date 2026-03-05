import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../src/components/Header';

describe('Header Component', () => {
  it('should render header element', () => {
    const { container } = render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    const header = container.querySelector('header');
    expect(header).toBeInTheDocument();
  });

  it('should display app name/logo', () => {
    render(
      <BrowserRouter>
        <Header title="Eco Cycle" />
      </BrowserRouter>
    );

    expect(screen.getByText('Eco Cycle')).toBeInTheDocument();
  });

  it('should have navigation menu', () => {
    const { container } = render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    const nav = container.querySelector('nav');
    expect(nav).toBeInTheDocument();
  });

  it('should render user profile section', () => {
    const { container } = render(
      <BrowserRouter>
        <Header user={{ name: 'Test User' }} />
      </BrowserRouter>
    );

    const profile = container.querySelector('.user-profile');
    expect(profile).toBeInTheDocument();
  });
});
