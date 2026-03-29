export const siteSettings = {
  // Store branding & naming
  shopName: 'Pluto',              // Edit here: change your store name
  logoText: 'Pluto',              // Edit here: change logo text
  footerText: '© 2026 Pluto Commerce. All rights reserved.', // Edit here: update copyright
  
  // Social media links - Edit all social URLs below
  socials: {
    instagram: 'https://www.instagram.com/ali_aljawad_',
    whatsapp: 'https://chat.whatsapp.com/HLIKiYbCw4nHCpC6MrdbF8?mode=gi_t',
    discord: 'https://discord.gg/saPPVPKG4m',
    // Add more: facebook, twitter, tiktok, linkedin, etc.
    // facebook: 'https://facebook.com/yourpage',
    // twitter: 'https://twitter.com/yourhandle',
  },
  
  // Currency and localization
  currency: 'USD',                // Edit: change to 'EUR', 'GBP', etc.
  currencySymbol: '$',            // Edit: change currency symbol
  
  // Theme colors - uses Tailwind css class names
  theme: {
    primary: 'brand-600',         // Edit: change primary color
    primaryHover: 'brand-700',    // Edit: change hover color
    dark: false,                  // Edit: set default dark mode (true/false)
  },
  
  // Image fallback URL - used when product images fail to load
  fallbackImage: 'https://via.placeholder.com/500x400?text=No+Image',
  
  // Admin
  adminPassword: 'letmein123',    // Edit: change admin panel password (also in src/pages/Admin.jsx)
};
