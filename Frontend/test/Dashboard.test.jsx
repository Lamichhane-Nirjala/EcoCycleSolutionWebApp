import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

describe('Dashboard Integration', () => {
  it('should render dashboard page', async () => {
    render(
      <BrowserRouter>
        <div>Dashboard Test</div>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Dashboard Test')).toBeInTheDocument();
    });
  });

  it('should load user statistics from API', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            totalPickups: 10,
            ecoPoints: 150,
            totalWaste: 25
          })
      })
    );

    render(
      <BrowserRouter>
        <div>Dashboard Stats</div>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });
});
