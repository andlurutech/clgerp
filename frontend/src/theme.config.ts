// White-Label Configuration Engine

export const themeConfig = {
  institutionName: process.env.NEXT_PUBLIC_INSTITUTION_NAME || "Demo University",
  primaryColor: process.env.NEXT_PUBLIC_PRIMARY_COLOR || "#10b981", // Default Emerald Green
  secondaryColor: process.env.NEXT_PUBLIC_SECONDARY_COLOR || "#3b82f6", // Default Blue
  logoUrl: process.env.NEXT_PUBLIC_LOGO_URL || "/default-logo.svg",
  
  // Advanced Glassmorphism Tuning
  glassOpacity: process.env.NEXT_PUBLIC_GLASS_OPACITY || "0.1",
  glassBlur: process.env.NEXT_PUBLIC_GLASS_BLUR || "10px",
  
  applyTheme: () => {
    if (typeof window !== "undefined") {
      const root = document.documentElement;
      root.style.setProperty("--primary-color", themeConfig.primaryColor);
      root.style.setProperty("--secondary-color", themeConfig.secondaryColor);
      root.style.setProperty("--glass-opacity", themeConfig.glassOpacity);
      root.style.setProperty("--glass-blur", themeConfig.glassBlur);
    }
  }
};
