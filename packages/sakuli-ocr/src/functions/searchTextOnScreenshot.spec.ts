import { mockPartial } from "sneer";
import { TestExecutionContext } from "@sakuli/core";
import { SimpleLogger } from "@sakuli/commons";

describe("searchTextOnScreenshot", () => {
  const testExecutionContextMock = mockPartial<TestExecutionContext>({
    logger: mockPartial<SimpleLogger>({
      debug: jest.fn(),
    }),
  });

  const ThenableRegionClassMock = jest.fn();

  it("should search with tesseract in default config", () => {
    fail("Implement me!");
  });

  it("should search with alternative config if default search fails ", () => {
    fail("Implement me!");
  });
});
