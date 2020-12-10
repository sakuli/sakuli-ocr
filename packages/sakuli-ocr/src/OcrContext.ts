import { TestExecutionLifecycleHooks } from "@sakuli/core/dist/runner/context-provider.interface";
import { Region } from "@sakuli/legacy";
import { getTextFromRegion } from "./getTextFromRegion";

export interface OcrContext{
    _getTextFromRegion: (region: Region) => Promise<string>
}
export class OcrContextProvider implements TestExecutionLifecycleHooks<OcrContext>{
    requestContext(): Promise<OcrContext> {
        return Promise.resolve({
            _getTextFromRegion: getTextFromRegion
        })
    }
}