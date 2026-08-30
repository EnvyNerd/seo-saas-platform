import React from 'react';
import { ChevronDown, LogOut, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../ThemeToggle';
import { useAuth } from '../../context/AuthContext';

export const Header = ({ logo, navigation, className = '', isMenuOpen, onMenuToggle }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const menuOpen = isMenuOpen ?? isOpen;
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const profileEmail = user?.email || 'user@example.com';
  const profileInitial = profileEmail.charAt(0).toUpperCase();

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate('/login');
  };

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
          <div className="flex items-center gap-3">
            <ThemeToggle />

            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen((open) => !open)}
                aria-expanded={profileOpen}
                aria-label="Open user profile"
                title="User profile"
                className="flex items-center gap-2 rounded-lg p-1.5 text-text-primary transition-colors hover:bg-surface-secondary"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slb-navy text-sm font-bold text-white">
                  {profileInitial}
                </span>
                <span className="hidden max-w-[150px] truncate text-sm font-medium text-text-secondary lg:block">
                  {profileEmail}
                </span>
                <ChevronDown size={15} className={`hidden text-text-muted transition-transform sm:block ${profileOpen ? 'rotate-180' : ''}`} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full z-[60] mt-2 w-64 rounded-xl border border-border-light bg-surface-primary p-2 shadow-xl">
                  <div className="border-b border-border-light px-3 py-3">
                    <p className="text-xs font-bold uppercase tracking-widest text-text-muted">Signed in as</p>
                    <p className="mt-1 truncate text-sm font-semibold text-text-primary">{profileEmail}</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/10"
                  >
                    <LogOut size={16} />
                    Sign out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => {
                if (onMenuToggle) onMenuToggle();
                else setIsOpen((open) => !open);
              }}
              aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
              className="md:hidden p-2 text-text-primary hover:bg-surface-secondary rounded-lg transition-colors"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
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
