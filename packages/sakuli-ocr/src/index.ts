import { SakuliPresetProvider } from "@sakuli/core";
import {
  GetRegionByText,
  GetTextFromRegion,
  OcrContextProvider,
} from "./OcrContext";

const ocrPreset: SakuliPresetProvider = (registry) => {
  registry.registerContextProvider(new OcrContextProvider());
};

export default ocrPreset;

declare global {
  const _getTextFromRegion: GetTextFromRegion;
  const _getRegionByText: GetRegionByText;
}
