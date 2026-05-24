import React from 'react';

export const SolutionGrid = ({ items, columns = 3, children }) => {
  return (
    <div
      className={`
        grid gap-6 mb-8
        grid-cols-1
        md:grid-cols-2
        ${columns >= 3 ? 'lg:grid-cols-3' : ''}
        ${columns >= 4 ? 'xl:grid-cols-4' : ''}
      `}
    >
      {children || items?.map((item, idx) => <div key={idx}>{item}</div>)}
    </div>
  );
};

export const Container = ({ children, className = '', size = 'lg' }) => {
  const sizes = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-7xl',
    xl: 'max-w-full',
  };

  return (
    <div className={`container mx-auto px-4 md:px-8 ${sizes[size]} ${className}`}>
      {children}
    </div>
  );
};

export const Section = ({ children, className = '', bg = 'white' }) => {
  const bgColors = {
    white: 'bg-white',
    light: 'bg-slb-gray',
    navy: 'bg-slb-navy text-white',
  };

  return (
    <section className={`py-12 md:py-16 lg:py-20 ${bgColors[bg]} ${className}`}>
      {children}
    </section>
  );
};

export default SolutionGrid;
