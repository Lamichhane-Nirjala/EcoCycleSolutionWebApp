import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Card from '../src/components/Card';

describe('Card Component', () => {
  it('should render card with title', () => {
    render(
      <BrowserRouter>
        <Card title="Test Card">
          <p>Card Content</p>
        </Card>
      </BrowserRouter>
    );

    expect(screen.getByText('Test Card')).toBeInTheDocument();
  });

  it('should render children content', () => {
    render(
      <BrowserRouter>
        <Card title="Test">
          <p>Test Content</p>
        </Card>
      </BrowserRouter>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <BrowserRouter>
        <Card title="Test" className="custom-card">
          Content
        </Card>
      </BrowserRouter>
    );

    const card = container.querySelector('.custom-card');
    expect(card).toBeInTheDocument();
  });
});
