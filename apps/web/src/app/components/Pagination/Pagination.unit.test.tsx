import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Pagination } from './Pagination';

describe('Pagination', () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 5,
    hasNextPage: true,
    hasPreviousPage: false,
    onPageChange: vi.fn(),
  };

  describe('Basic rendering', () => {
    it('should render pagination controls', () => {
      render(<Pagination {...defaultProps} />);
      
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('should show current page and total pages', () => {
      render(<Pagination {...defaultProps} />);
      
      expect(screen.getByText('Page 1 of 5')).toBeInTheDocument();
    });
  });

  describe('Navigation buttons', () => {
    it('should render previous button when hasPreviousPage is true', () => {
      render(<Pagination {...defaultProps} hasPreviousPage={true} />);
      
      expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument();
    });

    it('should not render previous button when hasPreviousPage is false', () => {
      render(<Pagination {...defaultProps} hasPreviousPage={false} />);
      
      expect(screen.queryByRole('button', { name: /previous/i })).not.toBeInTheDocument();
    });

    it('should render next button when hasNextPage is true', () => {
      render(<Pagination {...defaultProps} hasNextPage={true} />);
      
      expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
    });

    it('should not render next button when hasNextPage is false', () => {
      render(<Pagination {...defaultProps} hasNextPage={false} />);
      
      expect(screen.queryByRole('button', { name: /next/i })).not.toBeInTheDocument();
    });
  });

  describe('Button interactions', () => {
    it('should call onPageChange with previous page when previous button is clicked', () => {
      const onPageChange = vi.fn();
      render(<Pagination {...defaultProps} currentPage={2} hasPreviousPage={true} onPageChange={onPageChange} />);
      
      fireEvent.click(screen.getByRole('button', { name: /previous/i }));
      
      expect(onPageChange).toHaveBeenCalledWith(1);
    });

    it('should call onPageChange with next page when next button is clicked', () => {
      const onPageChange = vi.fn();
      render(<Pagination {...defaultProps} currentPage={1} hasNextPage={true} onPageChange={onPageChange} />);
      
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
      
      expect(onPageChange).toHaveBeenCalledWith(2);
    });
  });

  describe('Page information display', () => {
    it('should display correct page information for single page', () => {
      render(<Pagination {...defaultProps} totalPages={1} hasNextPage={false} hasPreviousPage={false} />);
      
      expect(screen.getByText('Page 1 of 1')).toBeInTheDocument();
    });

    it('should display correct page information for multiple pages', () => {
      render(<Pagination {...defaultProps} currentPage={3} totalPages={10} />);
      
      expect(screen.getByText('Page 3 of 10')).toBeInTheDocument();
    });
  });

  describe('Button states', () => {
    it('should disable previous button when on first page', () => {
      render(<Pagination {...defaultProps} currentPage={1} hasPreviousPage={false} />);
      
      const prevButton = screen.queryByRole('button', { name: /previous/i });
      expect(prevButton).not.toBeInTheDocument();
    });

    it('should disable next button when on last page', () => {
      render(<Pagination {...defaultProps} currentPage={5} totalPages={5} hasNextPage={false} />);
      
      const nextButton = screen.queryByRole('button', { name: /next/i });
      expect(nextButton).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper button labels', () => {
      render(<Pagination {...defaultProps} hasPreviousPage={true} hasNextPage={true} />);
      
      expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
    });

    it('should have proper navigation structure', () => {
      render(<Pagination {...defaultProps} />);
      
      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('should handle zero total pages', () => {
      const { container } = render(<Pagination {...defaultProps} totalPages={0} hasNextPage={false} hasPreviousPage={false} />);
      
      // Component should return null when totalPages is 0
      expect(container.firstChild).toBeNull();
    });

    it('should handle large page numbers', () => {
      render(<Pagination {...defaultProps} currentPage={999} totalPages={1000} />);
      
      expect(screen.getByText('Page 999 of 1000')).toBeInTheDocument();
    });
  });
});
