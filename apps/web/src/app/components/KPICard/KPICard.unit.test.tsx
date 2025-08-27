import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { KPICard } from './KPICard';

describe('KPICard', () => {
  const defaultProps = {
    title: 'Test KPI',
    value: 1000,
  };

  describe('Basic rendering', () => {
    it('should render title and value correctly', () => {
      render(<KPICard {...defaultProps} />);
      
      expect(screen.getByText('Test KPI')).toBeInTheDocument();
      expect(screen.getByText('1,000')).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      render(<KPICard {...defaultProps} className="custom-class" />);
      
      const card = screen.getByText('Test KPI').closest('.kpi-card');
      expect(card).toHaveClass('custom-class');
    });
  });

  describe('Number formatting', () => {
    it('should format numbers with commas', () => {
      render(<KPICard title="Large Number" value={1234567} />);
      
      expect(screen.getByText('1,234,567')).toBeInTheDocument();
    });

    it('should handle zero values', () => {
      render(<KPICard title="Zero" value={0} />);
      
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('should handle decimal numbers', () => {
      render(<KPICard title="Decimal" value={1234.56} />);
      
      expect(screen.getByText('1,234.56')).toBeInTheDocument();
    });
  });

  describe('Percentage formatting', () => {
    it('should format percentages correctly', () => {
      render(<KPICard title="Fill Rate" value={0.75} format="percentage" />);
      
      expect(screen.getByText('0.8%')).toBeInTheDocument();
    });

    it('should handle zero percentage', () => {
      render(<KPICard title="Zero Rate" value={0} format="percentage" />);
      
      expect(screen.getByText('0.0%')).toBeInTheDocument();
    });
  });

  describe('Loading state', () => {
    it('should show loading skeleton when loading', () => {
      render(<KPICard {...defaultProps} loading={true} />);
      
      // Should not show actual content
      expect(screen.queryByText('Test KPI')).not.toBeInTheDocument();
      expect(screen.queryByText('1,000')).not.toBeInTheDocument();
      
      // Should show skeleton elements
      const skeletonElements = document.querySelectorAll('.animate-pulse');
      expect(skeletonElements.length).toBeGreaterThan(0);
    });

    it('should show content when not loading', () => {
      render(<KPICard {...defaultProps} loading={false} />);
      
      expect(screen.getByText('Test KPI')).toBeInTheDocument();
      expect(screen.getByText('1,000')).toBeInTheDocument();
    });
  });

  describe('Visual elements', () => {
    it('should have proper card structure', () => {
      render(<KPICard {...defaultProps} />);
      
      const card = screen.getByText('Test KPI').closest('.kpi-card');
      expect(card).toBeInTheDocument();
    });

    it('should have gradient text styling', () => {
      render(<KPICard {...defaultProps} />);
      
      const valueElement = screen.getByText('1,000');
      expect(valueElement).toHaveClass('text-3xl', 'font-bold', 'bg-gradient-to-r', 'from-gray-800', 'to-gray-600', 'bg-clip-text', 'text-transparent');
    });

    it('should have decorative icon', () => {
      render(<KPICard {...defaultProps} />);
      
      const iconContainer = document.querySelector('.w-12.h-12.rounded-full.bg-gradient-to-br.from-blue-500.to-purple-600');
      expect(iconContainer).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      render(<KPICard {...defaultProps} />);
      
      const title = screen.getByText('Test KPI');
      expect(title.tagName).toBe('H3');
    });

    it('should have proper text contrast', () => {
      render(<KPICard {...defaultProps} />);
      
      const title = screen.getByText('Test KPI');
      expect(title).toHaveClass('text-gray-600');
    });
  });
});
