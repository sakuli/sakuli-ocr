jest.mock("@sakuli/legacy/dist/context/common");
jest.mock("./functions/searchTextOnScreenshot");
jest.mock("./functions/postprocessScreenshot");

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
import mock from "mock-fs";
import fs from "fs";
import { postprocessScreenshot } from "./functions/postprocessScreenshot";

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
    await callback;
    return expectedResultRegion;
  });
  (createThenableRegionClass as jest.Mock).mockReturnValue(
    ThenableRegionClassMock
  );
  const searchTextOnScreenshot = jest.fn();
  (createSearchTextOnScreenshot as jest.Mock).mockReturnValue(
    searchTextOnScreenshot
  );
  (searchTextOnScreenshot as jest.Mock).mockReturnValue(expectedResultRegion);

  const screenshotName = "ocr-screenshot.png";
  mockFs({});

  afterAll(() => mock.restore());

  describe("search on whole screen", () => {
    const takeScreenshotMock = jest.fn().mockImplementation((name) => {
      fs.writeFileSync(name, "data");
      return Promise.resolve();
    });
    const thenableEnvironmentMock = {
      takeScreenshot: takeScreenshotMock,
    };

    (createThenableEnvironmentClass as jest.Mock).mockReturnValue(
      jest.fn(() => {
        return thenableEnvironmentMock;
      })
    );

    it("should consider whole screen on search", async () => {
      //WHEN
      const resultRegion = await getRegionByText(
        searchText,
        project,
        testExecutionContextMock
      );

      //THEN
      expect(takeScreenshotMock).toBeCalledWith(
        expect.stringMatching(screenshotName)
      );
      expect(searchTextOnScreenshot).toBeCalled();
      expect(fs.existsSync(screenshotName)).toBeFalsy();
      expect(resultRegion).toBe(expectedResultRegion);
    });

    it("should delete screenshot on error", async () => {
      //GIVEN
      (searchTextOnScreenshot as jest.Mock).mockImplementation(() => {
        throw Error("Error while searching text on screen");
      });
      (postprocessScreenshot as jest.Mock).mockImplementation(() => {
        throw Error("Error while postprocessing");
      });

      //WHEN
      const executeGetRegionByText = getRegionByText(
        searchText,
        project,
        testExecutionContextMock
      );

      //THEN
      await expect(() => executeGetRegionByText).rejects.toThrowError();
      expect(fs.existsSync(screenshotName)).toBeFalsy();
    });
  });

  describe("search in region on screen", () => {
    const searchRegion = mockPartial<ThenableRegion>({});

    it("should consider provided region only on search", () => {
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
