import React from 'react';

export const Card = ({ children, className = '', onClick, hover = true }) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-lg border border-slb-gray-light shadow-sm
        ${hover ? 'hover:shadow-md transition-shadow duration-300 cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export const SolutionCard = ({ icon: Icon, title, description, onClick, stats }) => {
  return (
    <Card
      onClick={onClick}
      className="p-6 hover:shadow-lg hover:border-slb-accent transition-all"
    >
      <div className="flex items-start gap-4">
        {Icon && (
          <div className="flex-shrink-0">
            <Icon className="w-8 h-8 text-slb-accent" />
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slb-navy mb-2">{title}</h3>
          <p className="text-slb-gray-dark text-sm mb-4">{description}</p>
          {stats && (
            <div className="flex gap-4 text-xs">
              {stats.map((stat, idx) => (
                <div key={idx}>
                  <p className="text-slb-accent font-semibold">{stat.value}</p>
                  <p className="text-slb-gray-dark">{stat.label}</p>
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
        <span className="text-slb-gray-dark text-sm font-medium">{label}</span>
        {Icon && <Icon className="w-5 h-5 text-slb-accent" />}
      </div>
      <div>
        <p className="text-3xl font-bold text-slb-navy mb-2">{value}</p>
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
