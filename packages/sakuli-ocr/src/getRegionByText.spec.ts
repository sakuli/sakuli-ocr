jest.mock("@sakuli/legacy/dist/context/common");
jest.mock("./functions/searchTextOnScreenshot");

import { createSearchTextOnScreenshot } from "./functions/searchTextOnScreenshot";
import { getRegionByText } from "./getRegionByText";
import { mockPartial } from "sneer";
import { Project, TestExecutionContext } from "@sakuli/core";
import { SimpleLogger } from "@sakuli/commons";
import { ThenableRegion } from "@sakuli/legacy";
import {
  createThenableEnvironmentClass,
  createThenableRegionClass,
} from "@sakuli/legacy/dist/context/common";
import mockFs from "mock-fs";

describe("getRegionByText", () => {
  const project = mockPartial<Project>({});
  const searchText = "foobar";
  const testExecutionContextMock = mockPartial<TestExecutionContext>({
    logger: mockPartial<SimpleLogger>({
      debug: jest.fn(),
    }),
  });
  const expectedResultRegion = { _left: 42 };
  const ThenableRegionClassMock = jest.fn(async (x, y, w, h, callback) => {
    await callback();
    return expectedResultRegion;
  });
  (createThenableRegionClass as jest.Mock).mockReturnValue(
    ThenableRegionClassMock
  );

  const searchTextOnScreenshot = jest.fn();
  (createSearchTextOnScreenshot as jest.Mock).mockReturnValue(
    searchTextOnScreenshot
  );

  mockFs({ "ocr-screenshot.png": "image data ^.^" });

  describe("search whole screen", () => {
    const takeScreenshotMock = jest.fn().mockResolvedValue("");
    const thenableEnvironmentMock = {
      takeScreenshot: takeScreenshotMock,
    };

    (createThenableEnvironmentClass as jest.Mock)
      .mockReturnValue(() => {
        return thenableEnvironmentMock;
      })(searchTextOnScreenshot as jest.Mock)
      .mockReturnValue(expectedResultRegion);

    it("should consider whole screen on search", () => {
      //GIVEN

      //WHEN
      const resultRegion = getRegionByText(
        searchText,
        project,
        testExecutionContextMock
      );

      //THEN
      expect(resultRegion).toBe(expectedResultRegion);
    });

    it("should delete screenshot on success", () => {
      fail("implement me!");
    });

    it("should delete screenshot on error", () => {
      fail("implement me!");
    });
  });

  describe("search region screen", () => {
    const searchRegion = mockPartial<ThenableRegion>({});

    it("should consider provided region only on search", () => {
      fail("implement me!");
    });

    it("should delete screenshot on success", () => {
      fail("implement me!");
    });

    it("should delete screenshot on error", () => {
      fail("implement me!");
    });
  });

  describe("postprocess screenshot", () => {
    it("should search on post processed screenshot as fallback", () => {
      fail("implement me!");
    });
  });
});
