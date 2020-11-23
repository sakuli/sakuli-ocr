import { TestExecutionLifecycleHooks } from "@sakuli/core/dist/runner/context-provider.interface";
import { Region, ThenableRegion } from "@sakuli/legacy";
import { getTextFromRegion } from "./getTextFromRegion";
import { getRegionByText } from "./getRegionByText";

export interface OcrContext {
  _getTextFromRegion: (region: Region) => Promise<string>;
  _getRegionByText: (text: string, region: ThenableRegion) => ThenableRegion;
}
export class OcrContextProvider
  implements TestExecutionLifecycleHooks<OcrContext> {
  requestContext(): Promise<OcrContext> {
    return Promise.resolve({
      _getTextFromRegion: getTextFromRegion,
      _getRegionByText: getRegionByText,
    });
  }
}
