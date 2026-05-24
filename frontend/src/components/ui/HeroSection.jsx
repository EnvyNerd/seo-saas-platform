import React from 'react';

export const HeroSection = ({ title, subtitle, imageUrl, actions }) => {
  return (
    <section className="relative w-full h-96 md:h-[500px] bg-gradient-to-r from-slb-navy to-slb-navy-light overflow-hidden">
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-slb-navy to-transparent" />

      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {title}
            </h1>
            {subtitle && (
              <p className="text-lg md:text-xl text-gray-200 mb-8">
                {subtitle}
              </p>
            )}
            {actions && (
              <div className="flex gap-4">
                {actions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={action.onClick}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all ${action.variant === 'secondary'
                        ? 'bg-white text-slb-navy hover:bg-slb-gray'
                        : 'bg-slb-accent text-white hover:bg-slb-accent-light'
                      }`}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
