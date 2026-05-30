import React, { useState } from 'react';
import clsx from 'clsx';

/**
 * Tabs Component
 * Tab navigation with panel content
 */
export const Tabs = ({ tabs, defaultTab = 0, onChange, className = '' }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabChange = (index) => {
    setActiveTab(index);
    onChange?.(index);
  };

  return (
    <div className={className}>
      {/* Tab List */}
      <div className="flex gap-1 border-b border-border-light p-0 overflow-x-auto">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => handleTabChange(index)}
            className={clsx(
              'px-4 py-3 font-medium text-sm transition-all duration-200 border-b-2',
              'relative whitespace-nowrap',
              activeTab === index
                ? 'text-text-primary border-b-slb-blue-500'
                : 'text-text-secondary border-b-transparent hover:text-text-primary hover:bg-surface-secondary'
            )}
          >
            {tab.icon && <tab.icon className="inline-block mr-2" size={16} />}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {tabs[activeTab]?.content}
      </div>
    </div>
  );
};

export default Tabs;
