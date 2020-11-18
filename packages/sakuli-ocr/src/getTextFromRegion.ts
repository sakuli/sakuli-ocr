import { ThenableRegion } from "@sakuli/legacy";

export async function getTextFromRegion(region: ThenableRegion): Promise<string>{
    return Promise.resolve("foo")
}