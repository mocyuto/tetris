import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Cell from './Cell';

describe('Cell Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<Cell type={0} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with correct color for a specific tetromino type', () => {
    // I type color is '80, 227, 230'
    const { container } = render(<Cell type="I" />);
    const cellElement = container.firstChild as HTMLElement;
    expect(cellElement.style.background).toContain('rgba(80, 227, 230, 0.8)');
  });
});
