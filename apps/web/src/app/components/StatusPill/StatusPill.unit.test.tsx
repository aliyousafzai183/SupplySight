import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusPill } from './StatusPill';
import type { Status } from '../../features/products/types';

describe('StatusPill', () => {
  const renderStatusPill = (status: Status) => {
    return render(<StatusPill status={status} />);
  };

  describe('Status display', () => {
    it('should render HEALTHY status correctly', () => {
      renderStatusPill('HEALTHY');
      
      expect(screen.getByText('Healthy')).toBeInTheDocument();
      expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Status: Healthy');
      expect(screen.getByText('✓')).toBeInTheDocument();
    });

    it('should render LOW status correctly', () => {
      renderStatusPill('LOW');
      
      expect(screen.getByText('Low')).toBeInTheDocument();
      expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Status: Low');
      expect(screen.getByText('△')).toBeInTheDocument();
    });

    it('should render CRITICAL status correctly', () => {
      renderStatusPill('CRITICAL');
      
      expect(screen.getByText('Critical')).toBeInTheDocument();
      expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Status: Critical');
      expect(screen.getByText('✗')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      renderStatusPill('HEALTHY');
      
      const statusElement = screen.getByRole('status');
      expect(statusElement).toHaveAttribute('aria-label');
      expect(statusElement.tagName).toBe('SPAN');
    });

    it('should have proper CSS classes', () => {
      renderStatusPill('HEALTHY');
      
      const statusElement = screen.getByRole('status');
      expect(statusElement).toHaveClass('inline-flex', 'items-center', 'px-3', 'py-1', 'rounded-full', 'text-xs', 'font-medium');
    });
  });

  describe('Visual styling', () => {
    it('should apply correct status-specific classes', () => {
      const { rerender } = renderStatusPill('HEALTHY');
      expect(screen.getByRole('status')).toHaveClass('status-healthy');

      rerender(<StatusPill status="LOW" />);
      expect(screen.getByRole('status')).toHaveClass('status-low');

      rerender(<StatusPill status="CRITICAL" />);
      expect(screen.getByRole('status')).toHaveClass('status-critical');
    });
  });
});
