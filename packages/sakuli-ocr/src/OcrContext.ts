import { TestExecutionLifecycleHooks } from "@sakuli/core/dist/runner/context-provider.interface";
import { Region, ThenableRegion } from "@sakuli/legacy";
import { getTextFromRegion } from "./getTextFromRegion";
import { getRegionByText } from "./getRegionByText";
import { Project, TestExecutionContext } from "@sakuli/core";

export type GetRegionByText = (
  text: string,
  region?: ThenableRegion
) => ThenableRegion;
export interface OcrContext {
  _getTextFromRegion: (region: Region) => Promise<string>;
  _getRegionByText: GetRegionByText;
}
export class OcrContextProvider
  implements TestExecutionLifecycleHooks<OcrContext> {
  requestContext(
    testExecutionContext: TestExecutionContext,
    project: Project
  ): Promise<OcrContext> {
    return Promise.resolve({
      _getTextFromRegion: (region) =>
        getTextFromRegion(region, testExecutionContext),
      _getRegionByText: (text, region) =>
        getRegionByText(text, project, testExecutionContext, region),
    });
  }
}
