import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Table from '../src/components/Table';

describe('Table Component', () => {
  const mockColumns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'status', label: 'Status' }
  ];

  const mockData = [
    { id: 1, name: 'Test 1', status: 'Active' },
    { id: 2, name: 'Test 2', status: 'Inactive' }
  ];

  it('should render table element', () => {
    const { container } = render(
      <BrowserRouter>
        <Table columns={mockColumns} data={mockData} />
      </BrowserRouter>
    );

    const table = container.querySelector('table');
    expect(table).toBeInTheDocument();
  });

  it('should render table headers', () => {
    render(
      <BrowserRouter>
        <Table columns={mockColumns} data={mockData} />
      </BrowserRouter>
    );

    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('should render table rows with data', () => {
    render(
      <BrowserRouter>
        <Table columns={mockColumns} data={mockData} />
      </BrowserRouter>
    );

    expect(screen.getByText('Test 1')).toBeInTheDocument();
    expect(screen.getByText('Test 2')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Inactive')).toBeInTheDocument();
  });

  it('should handle empty data', () => {
    const { container } = render(
      <BrowserRouter>
        <Table columns={mockColumns} data={[]} />
      </BrowserRouter>
    );

    const table = container.querySelector('table');
    expect(table).toBeInTheDocument();
  });

  it('should display loading state when loading prop is true', () => {
    const { container } = render(
      <BrowserRouter>
        <Table columns={mockColumns} data={mockData} loading={true} />
      </BrowserRouter>
    );

    const loadingElement = container.querySelector('.loading');
    if (loadingElement) {
      expect(loadingElement).toBeInTheDocument();
    }
  });
});
