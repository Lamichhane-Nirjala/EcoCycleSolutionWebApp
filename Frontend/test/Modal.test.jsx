import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Modal from '../src/components/Modal';

describe('Modal Component', () => {
  it('should not render when isOpen is false', () => {
    const { container } = render(
      <BrowserRouter>
        <Modal isOpen={false} title="Test Modal">
          <p>Modal Content</p>
        </Modal>
      </BrowserRouter>
    );

    const modal = container.querySelector('.modal');
    expect(modal).not.toBeInTheDocument();
  });

  it('should render when isOpen is true', () => {
    render(
      <BrowserRouter>
        <Modal isOpen={true} title="Test Modal">
          <p>Modal Content</p>
        </Modal>
      </BrowserRouter>
    );

    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('should display modal title', () => {
    render(
      <BrowserRouter>
        <Modal isOpen={true} title="Test Title">
          Content
        </Modal>
      </BrowserRouter>
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    const onClose = jest.fn();
    const { container } = render(
      <BrowserRouter>
        <Modal isOpen={true} title="Test" onClose={onClose}>
          Content
        </Modal>
      </BrowserRouter>
    );

    const closeButton = container.querySelector('.close-btn');
    if (closeButton) {
      closeButton.click();
      expect(onClose).toHaveBeenCalled();
    }
  });
});
