export interface ColorSwatch {
  hex: string;
  name: string;
  usage: string;
}

export interface FontPairing {
  role: string;
  fontName: string;
  googleFontUrl: string;
  rationale: string;
}

export interface BrandLogo {
  description: string;
  svgData: string; // The inner content of an SVG tag
}

export interface BrandIdentity {
  brandName: string;
  tagline: string;
  missionSummary: string;
  brandVoice: string[];
  palette: ColorSwatch[];
  typography: FontPairing[];
  primaryLogo: BrandLogo;
  secondaryMark: BrandLogo;
  monochromeLogo: BrandLogo;
  favicon: BrandLogo;
  usageGuidelines: {
    logoPlacement: string;
    clearSpace: string;
    colorApplication: string;
  };
}
