import React from 'react';

const SacredGeometryBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Very light gradient overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-[#1A1A1A]/20" />
      
      <svg className="absolute w-full h-full opacity-90" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Flower of Life Pattern */}
          <pattern id="flowerOfLife" x="0" y="0" width="300" height="300" patternUnits="userSpaceOnUse">
            <circle className="animate-sacred-rotate" cx="150" cy="150" r="60" stroke="#B87D3B" strokeWidth="2" fill="none"/>
            <circle className="animate-sacred-rotate" cx="210" cy="150" r="60" stroke="#B87D3B" strokeWidth="2" fill="none"/>
            <circle className="animate-sacred-rotate" cx="180" cy="201" r="60" stroke="#B87D3B" strokeWidth="2" fill="none"/>
            <circle className="animate-sacred-rotate" cx="120" cy="201" r="60" stroke="#B87D3B" strokeWidth="2" fill="none"/>
            <circle className="animate-sacred-rotate" cx="90" cy="150" r="60" stroke="#B87D3B" strokeWidth="2" fill="none"/>
            <circle className="animate-sacred-rotate" cx="150" cy="99" r="60" stroke="#B87D3B" strokeWidth="2" fill="none"/>
          </pattern>
        </defs>

        {/* Single Animated Background Layer */}
        <rect className="animate-sacred-rotate" width="100%" height="100%" fill="url(#flowerOfLife)"/>
      </svg>
    </div>
  );
};

export default SacredGeometryBackground; 