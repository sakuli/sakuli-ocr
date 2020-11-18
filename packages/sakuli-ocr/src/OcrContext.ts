import { TestExecutionLifecycleHooks } from "@sakuli/core/dist/runner/context-provider.interface";
import { ThenableRegion } from "@sakuli/legacy";
import { getTextFromRegion } from "./getTextFromRegion";

export interface OcrContext{
    _getTextFromRegion: (region: ThenableRegion) => Promise<string>
}
export class OcrContextProvider implements TestExecutionLifecycleHooks<OcrContext>{
    requestContext(): Promise<OcrContext> {

        return Promise.resolve({
            _getTextFromRegion: getTextFromRegion
        })
    }
}