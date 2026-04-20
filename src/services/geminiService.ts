import { GoogleGenAI, Type } from "@google/genai";
import { BrandIdentity } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const brandIdentitySchema = {
  type: Type.OBJECT,
  properties: {
    brandName: { type: Type.STRING },
    tagline: { type: Type.STRING },
    missionSummary: { type: Type.STRING },
    brandVoice: { 
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    palette: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          hex: { type: Type.STRING },
          name: { type: Type.STRING },
          usage: { type: Type.STRING }
        },
        required: ["hex", "name", "usage"]
      }
    },
    typography: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          role: { type: Type.STRING },
          fontName: { type: Type.STRING },
          googleFontUrl: { type: Type.STRING },
          rationale: { type: Type.STRING }
        },
        required: ["role", "fontName", "googleFontUrl", "rationale"]
      }
    },
    primaryLogo: {
      type: Type.OBJECT,
      properties: {
        description: { type: Type.STRING },
        svgData: { type: Type.STRING }
      },
      required: ["description", "svgData"]
    },
    secondaryMark: {
      type: Type.OBJECT,
      properties: {
        description: { type: Type.STRING },
        svgData: { type: Type.STRING }
      },
      required: ["description", "svgData"]
    },
    monochromeLogo: {
      type: Type.OBJECT,
      properties: {
        description: { type: Type.STRING },
        svgData: { type: Type.STRING }
      },
      required: ["description", "svgData"]
    },
    favicon: {
      type: Type.OBJECT,
      properties: {
        description: { type: Type.STRING },
        svgData: { type: Type.STRING }
      },
      required: ["description", "svgData"]
    },
    usageGuidelines: {
      type: Type.OBJECT,
      properties: {
        logoPlacement: { type: Type.STRING },
        clearSpace: { type: Type.STRING },
        colorApplication: { type: Type.STRING }
      },
      required: ["logoPlacement", "clearSpace", "colorApplication"]
    }
  },
  required: [
    "brandName", 
    "tagline", 
    "missionSummary", 
    "brandVoice", 
    "palette", 
    "typography", 
    "primaryLogo", 
    "secondaryMark",
    "monochromeLogo",
    "favicon",
    "usageGuidelines"
  ]
};

export async function generateBrandIdentity(mission: string, brandNameHint?: string): Promise<BrandIdentity> {
  const prompt = `
    Context: Analyze the following company mission/description and generate a comprehensive brand identity.
    Company Mission/Description: "${mission}"
    ${brandNameHint ? `Preferred Brand Name: ${brandNameHint}` : "Generate a catchy brand name if none is clearly implied."}

    Instructions:
    1. Define a brand voice (3-5 adjectives).
    2. Create a tagline.
    3. Select a 5-color palette that reflects the brand's mood. Provide names like "Midnight Ocean", "Energetic Coral", etc.
    4. Suggested Google Font pairings: one for headings/display and one for body text.
    5. DESIGN A LOGO SYSTEM: 
       - Provide a concise description of each logo concept.
       - Provide SVG inner data (paths, circles, rects) for each.
       - The coordinate system should assume a 100x100 viewport. 
       - Use "currentColor" for strokes and fills.
       - Variants required:
         a) Primary Logo: The full, most detailed version.
         b) Secondary Mark: An icon-style simplified mark.
         c) Monochrome Logo: A version optimized for single-color usage (e.g. black or white).
         d) Favicon: A highly simplified symbol designed to work at 16x16 or 32x32px (keep paths thick and clear).
    6. USAGE GUIDELINES: Provide detailed instructions for:
       - Logo Placement: Where to place the logo in different layouts.
       - Clear Space: The minimum distance required around the logo to ensure visibility.
       - Color Application: Rules on how to use the palette correctly in documents/web (e.g., contrast rules).

    Ensure the output is valid JSON.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: brandIdentitySchema,
    }
  });

  if (!response.text) {
    throw new Error("No response from Gemini");
  }

  return JSON.parse(response.text) as BrandIdentity;
}
