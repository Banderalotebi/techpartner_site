import React from 'react';

interface PlatformLogoProps {
  platform: string;
  size?: number;
}

export const PlatformLogo: React.FC<PlatformLogoProps> = ({ platform, size = 40 }) => {
  const logoComponents = {
    wix: (
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        <rect width="40" height="40" rx="8" fill="#0066FF"/>
        <path d="M12 28L16 12L20 24L24 12L28 28" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    sallah: (
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        <rect width="40" height="40" rx="8" fill="#00A859"/>
        <path d="M20 8L24 16H32L26 22L28 30L20 26L12 30L14 22L8 16H16L20 8Z" fill="white"/>
      </svg>
    ),
    shopify: (
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        <rect width="40" height="40" rx="8" fill="#7AB55C"/>
        <path d="M27 14C27 14 26 12 24 12C22 12 21 13 21 13C21 13 19 12 17 14C15 16 15 18 15 18L13 30H27L25 18C25 18 27 16 27 14Z" fill="white"/>
        <circle cx="18" cy="19" r="2" fill="#7AB55C"/>
      </svg>
    ),
    wordpress: (
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        <rect width="40" height="40" rx="8" fill="#21759B"/>
        <circle cx="20" cy="20" r="12" fill="white"/>
        <circle cx="20" cy="20" r="4" fill="#21759B"/>
        <path d="M8 20H12M28 20H32M20 8V12M20 28V32" stroke="#21759B" strokeWidth="2"/>
      </svg>
    ),
    squarespace: (
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        <rect width="40" height="40" rx="8" fill="#000000"/>
        <rect x="10" y="10" width="20" height="20" rx="2" fill="white"/>
        <rect x="14" y="14" width="12" height="12" rx="1" fill="#000000"/>
      </svg>
    ),
    webflow: (
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        <rect width="40" height="40" rx="8" fill="#4353FF"/>
        <path d="M10 25L15 15L20 20L25 15L30 25" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="20" cy="20" r="3" fill="white"/>
      </svg>
    ),
    figma: (
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        <rect width="40" height="40" rx="8" fill="#F24E1E"/>
        <rect x="12" y="8" width="8" height="8" rx="4" fill="white"/>
        <rect x="20" y="8" width="8" height="8" rx="4" fill="#A259FF"/>
        <rect x="12" y="16" width="8" height="8" rx="4" fill="#FF7262"/>
        <rect x="12" y="24" width="8" height="8" rx="4" fill="#1ABCFE"/>
        <circle cx="24" cy="20" r="4" fill="#0ACF83"/>
      </svg>
    ),
    godaddy: (
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        <rect width="40" height="40" rx="8" fill="#1BDBDB"/>
        <path d="M20 8C24.418 8 28 11.582 28 16V24C28 28.418 24.418 32 20 32C15.582 32 12 28.418 12 24V16C12 11.582 15.582 8 20 8Z" fill="white"/>
        <circle cx="20" cy="18" r="3" fill="#1BDBDB"/>
        <path d="M14 26C16 28 18 28 20 28C22 28 24 28 26 26" stroke="#1BDBDB" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  };

  return (
    <div className="flex items-center justify-center">
      {logoComponents[platform as keyof typeof logoComponents] || (
        <div 
          className="bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 font-bold"
          style={{ width: size, height: size }}
        >
          {platform.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
};

export default PlatformLogo;