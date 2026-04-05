import { cleanup, fireEvent, screen, waitFor } from '@testing-library/react';
import { message } from 'antd';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ProcessingList from '@/modules/processing/components/ProcessingList';
import { renderWithProviders } from '@/shared/test/renderWithProviders';

const mockGenerate = vi.fn();
const mockMutate = vi.fn();

vi.mock('antd', () => {
  return {
    Button: ({
      children,
      onClick,
    }: {
      children: React.ReactNode;
      onClick?: () => void;
    }) => <button onClick={onClick}>{children}</button>,
    Table: ({
      columns,
      dataSource,
    }: {
      columns: Array<Record<string, any>>;
      dataSource: Array<Record<string, any>>;
    }) => (
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataSource.map((record, index) => (
            <tr key={index}>
              {columns.map((column) => {
                const value = record[column.dataIndex];
                const content = column.render
                  ? column.render(value, record)
                  : value;
                return <td key={column.key}>{content}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    ),
    Typography: {
      Title: ({ children }: { children: React.ReactNode }) => (
        <h3>{children}</h3>
      ),
    },
    message: {
      success: vi.fn(),
      error: vi.fn(),
      warning: vi.fn(),
    },
  };
});

vi.mock('@/shared/stores/dateStore', () => ({
  useDateStore: (selector: (state: { date: string }) => unknown) =>
    selector({ date: '2026-04-04' }),
}));

vi.mock('@/modules/processing/hooks/useProcessingList', () => ({
  useProcessingList: () => ({
    items: [
      {
        material_name: 'Chicken Breast',
        category: 'Protein',
        processing_method: 'Trim',
        processing_requirement: 12.5,
        processing_time: '08:00',
      },
    ],
    isLoading: false,
    mutate: mockMutate,
  }),
}));

vi.mock('@/modules/processing/hooks/useProcessingGenerate', () => ({
  useProcessingGenerate: () => ({
    trigger: mockGenerate,
  }),
}));

describe('Processing module', () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    mockGenerate.mockReset();
    mockMutate.mockReset();
    vi.mocked(message.success).mockReset();
    vi.mocked(message.error).mockReset();
  });

  it('renders processing rows and generates the list for the selected date', async () => {
    mockGenerate.mockResolvedValue(undefined);

    renderWithProviders(<ProcessingList />);

    expect(
      screen.getByRole('heading', { name: 'Processing' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Chicken Breast')).toBeInTheDocument();
    expect(screen.getByText('12.50')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Regenerate' }));

    await waitFor(() => {
      expect(mockGenerate).toHaveBeenCalledWith({ date: '2026-04-04' });
      expect(mockMutate).toHaveBeenCalled();
    });
  });

  it('shows an error and skips mutate when generation fails', async () => {
    mockGenerate.mockRejectedValue(new Error('Generation failed'));

    renderWithProviders(<ProcessingList />);

    fireEvent.click(screen.getByRole('button', { name: 'Regenerate' }));

    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith('Generation failed');
      expect(mockMutate).not.toHaveBeenCalled();
    });
  });
});
