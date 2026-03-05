import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Loader from '../src/components/Loader';

describe('Loader Component', () => {
  it('should render loading spinner', () => {
    const { container } = render(
      <BrowserRouter>
        <Loader />
      </BrowserRouter>
    );

    const loader = container.querySelector('.loader');
    expect(loader).toBeInTheDocument();
  });

  it('should have loading animation class', () => {
    const { container } = render(
      <BrowserRouter>
        <Loader />
      </BrowserRouter>
    );

    const loader = container.querySelector('.loading');
    expect(loader).toBeInTheDocument();
  });

  it('should show loading text when provided', () => {
    render(
      <BrowserRouter>
        <Loader message="Loading..." />
      </BrowserRouter>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
