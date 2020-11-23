import { SakuliPresetProvider } from "@sakuli/core";
import { OcrContextProvider } from "./OcrContext";
import { getTextFromRegion } from "./getTextFromRegion";
import { getRegionByText } from "./getRegionByText";

const ocrPreset: SakuliPresetProvider = (registry) => {
  registry.registerContextProvider(new OcrContextProvider());
};

export const pluginToken =
  "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJjYXRlZ29yeSI6MTQsImlhdCI6MTYwNTUyNzQ4MSwiYXVkIjoiQHNha3VsaS9vY3IiLCJpc3MiOiJzYWt1bGkuaW8iLCJzdWIiOiJzYWt1bGlfcGx1Z2luIn0.9J2vFBNbGKm9ZezG5olu_uC6FjxNmCyLTVl44fV-MuO0aVXT6wjlgFjodsLqK7xXI8iqqb_0YunPhMsesSI9RA";
export default ocrPreset;

declare global {
  const _getTextFromRegion: typeof getTextFromRegion;
  const _getRegionByText: typeof getRegionByText;
}
