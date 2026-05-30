import React from 'react';
import { Menu, X } from 'lucide-react';
import ThemeToggle from '../ThemeToggle';

export const Header = ({ logo, navigation, className = '' }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <header
      className={`
        bg-surface-primary border-b border-border-light shadow-sm sticky top-0 z-50
        ${className}
      `}
    >
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            {logo}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8 items-center">
            {navigation?.map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                className={`
                  font-medium transition-colors
                  ${item.active
                    ? 'text-slb-accent'
                    : 'text-text-secondary hover:text-text-primary'
                  }
                `}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right Section: Theme Toggle + Mobile Menu */}
          <div className="flex items-center gap-4">
            <ThemeToggle />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-text-primary hover:bg-surface-secondary rounded-lg transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden pb-4 flex flex-col gap-4">
            {navigation?.map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                className={`
                  font-medium transition-colors py-2
                  ${item.active
                    ? 'text-slb-accent'
                    : 'text-text-secondary hover:text-text-primary'
                  }
                `}
              >
                {item.label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
