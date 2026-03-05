import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Button from '../src/components/Button';

describe('Button Component', () => {
  it('should render button with text', () => {
    render(
      <BrowserRouter>
        <Button>Click Me</Button>
      </BrowserRouter>
    );

    const button = screen.getByText('Click Me');
    expect(button).toBeInTheDocument();
  });

  it('should have correct styling classes', () => {
    const { container } = render(
      <BrowserRouter>
        <Button className="test-class">Test</Button>
      </BrowserRouter>
    );

    const button = container.querySelector('button');
    expect(button).toHaveClass('test-class');
  });

  it('should be disabled when disabled prop is true', () => {
    render(
      <BrowserRouter>
        <Button disabled>Disabled</Button>
      </BrowserRouter>
    );

    const button = screen.getByText('Disabled');
    expect(button).toBeDisabled();
  });
});
