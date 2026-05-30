import React from 'react';
import clsx from 'clsx';

export const Card = ({ children, className = '', onClick, hover = true, variant = 'default', noBorder = false }) => {
  const variants = {
    default: 'bg-surface-primary border border-border-light shadow-sm',
    elevated: 'bg-surface-primary border border-border-light shadow-md',
    flat: 'bg-surface-secondary border-0',
    outline: 'bg-surface-primary border-2 border-border-medium',
  };

  const baseClasses = clsx(
    'rounded-lg transition-all duration-200',
    variants[variant],
    hover && 'hover:shadow-lg hover:border-border-medium cursor-pointer transform hover:-translate-y-1',
    onClick && 'cursor-pointer',
    noBorder && 'border-0',
    className
  );

  return (
    <div
      onClick={onClick}
      className={baseClasses}
    >
      {children}
    </div>
  );
};

export const SolutionCard = ({ icon: Icon, title, description, onClick, stats }) => {
  return (
    <Card
      onClick={onClick}
      className="p-6"
    >
      <div className="flex items-start gap-4">
        {Icon && (
          <div className="flex-shrink-0">
            <Icon className="w-8 h-8 text-slb-accent" />
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
          <p className="text-text-secondary text-sm mb-4">{description}</p>
          {stats && (
            <div className="flex gap-4 text-xs">
              {stats.map((stat, idx) => (
                <div key={idx}>
                  <p className="text-slb-accent font-semibold">{stat.value}</p>
                  <p className="text-text-secondary">{stat.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export const MetricCard = ({ label, value, change, icon: Icon, trend = 'up' }) => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-text-secondary text-sm font-medium">{label}</span>
        {Icon && <Icon className="w-5 h-5 text-slb-accent" />}
      </div>
      <div>
        <p className="text-3xl font-bold text-text-primary mb-2">{value}</p>
        {change !== undefined && (
          <p className={`text-sm ${trend === 'up' ? 'text-slb-success' : 'text-slb-error'}`}>
            {trend === 'up' ? '↑' : '↓'} {change}
          </p>
        )}
      </div>
    </Card>
  );
};

export default Card;
