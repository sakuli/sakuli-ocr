import { createConvertAltoElementToRegion } from "./createConvertAltoElementToRegion";
import { mockPartial } from "sneer";
import { TestExecutionContext } from "@sakuli/core";
import { SimpleLogger } from "@sakuli/commons";
import { ThenableRegion } from "@sakuli/legacy";

describe("create convert alto element to region", () => {
  const testExecutionContextMock = mockPartial<TestExecutionContext>({
    logger: mockPartial<SimpleLogger>({
      debug: jest.fn(),
    }),
  });

  const ThenableRegionClassMock = jest.fn();
  const convertAltoElementToRegion = createConvertAltoElementToRegion(
    testExecutionContextMock,
    ThenableRegionClassMock
  );

  beforeEach(() => {
    jest.resetAllMocks();
  });

  function mockGetNamedItem(
    horizontalPosition: number,
    verticalPosition: number,
    width: number,
    height: number
  ) {
    return jest.fn((name) => {
      switch (name) {
        case "HPOS":
          return { value: `${horizontalPosition}` };
        case "VPOS":
          return { value: `${verticalPosition}` };
        case "WIDTH":
          return { value: `${width}` };
        case "HEIGHT":
          return { value: `${height}` };
      }
    });
  }

  it("should convert element to region", () => {
    //GIVEN
    const searchText = "foo bar";
    const horizontalPosition = 10;
    const verticalPosition = 42;
    const width = 9;
    const height = 15;

    const altoElement = {
      attributes: {
        getNamedItem: mockGetNamedItem(
          horizontalPosition,
          verticalPosition,
          width,
          height
        ),
      },
    };

    //WHEN
    convertAltoElementToRegion(altoElement, searchText);

    //THEN
    expect(ThenableRegionClassMock.mock.calls[0][0]).toBe(horizontalPosition);
    expect(ThenableRegionClassMock.mock.calls[0][1]).toBe(verticalPosition);
    expect(ThenableRegionClassMock.mock.calls[0][2]).toBe(width);
    expect(ThenableRegionClassMock.mock.calls[0][3]).toBe(height);
    expect(testExecutionContextMock.logger.debug).toBeCalledWith(
      `Found text "${searchText}" on location {x: ${horizontalPosition}, y: ${verticalPosition}, width: ${width}, height: ${height}}`
    );
  });

  it("should convert element to region with offset", () => {
    //GIVEN
    const searchText = "foo bar";
    const horizontalPosition = 10;
    const verticalPosition = 42;
    const width = 9;
    const height = 15;
    const xOffset = 7;
    const yOffset = 13;
    const altoElement = {
      attributes: {
        getNamedItem: mockGetNamedItem(
          horizontalPosition,
          verticalPosition,
          width,
          height
        ),
      },
    };

    //WHEN
    convertAltoElementToRegion(
      altoElement,
      searchText,
      undefined,
      xOffset,
      yOffset
    );

    //THEN
    expect(ThenableRegionClassMock.mock.calls[0][0]).toBe(
      horizontalPosition + xOffset
    );
    expect(ThenableRegionClassMock.mock.calls[0][1]).toBe(
      verticalPosition + yOffset
    );
    expect(ThenableRegionClassMock.mock.calls[0][2]).toBe(width);
    expect(ThenableRegionClassMock.mock.calls[0][3]).toBe(height);
  });

  it("should convert element to region with base region", () => {
    //GIVEN
    const searchText = "foo bar";
    const horizontalPosition = 10;
    const verticalPosition = 42;
    const width = 9;
    const height = 15;

    const leftOffset = 7;
    const topOffset = 13;
    const baseRegionMock = mockPartial<ThenableRegion>({
      _left: leftOffset,
      _top: topOffset,
    });

    const altoElement = {
      attributes: {
        getNamedItem: mockGetNamedItem(
          horizontalPosition,
          verticalPosition,
          width,
          height
        ),
      },
    };

    //WHEN
    convertAltoElementToRegion(altoElement, searchText, baseRegionMock);

    //THEN
    expect(ThenableRegionClassMock.mock.calls[0][0]).toBe(
      horizontalPosition + leftOffset
    );
    expect(ThenableRegionClassMock.mock.calls[0][1]).toBe(
      verticalPosition + topOffset
    );
    expect(ThenableRegionClassMock.mock.calls[0][2]).toBe(width);
    expect(ThenableRegionClassMock.mock.calls[0][3]).toBe(height);
  });

  it("should convert element to region with base region and offset", () => {
    //GIVEN
    const searchText = "foo bar";
    const horizontalPosition = 10;
    const verticalPosition = 42;
    const width = 9;
    const height = 15;

    const xOffset = 3;
    const yOffset = 17;

    const leftOffset = 7;
    const topOffset = 13;
    const baseRegionMock = mockPartial<ThenableRegion>({
      _left: leftOffset,
      _top: topOffset,
    });

    const getNamedItemMock = mockGetNamedItem(
      horizontalPosition,
      verticalPosition,
      width,
      height
    );
    const altoElement = {
      attributes: {
        getNamedItem: getNamedItemMock,
      },
    };

    //WHEN
    convertAltoElementToRegion(
      altoElement,
      searchText,
      baseRegionMock,
      xOffset,
      yOffset
    );

    //THEN
    expect(ThenableRegionClassMock.mock.calls[0][0]).toBe(
      horizontalPosition + leftOffset + xOffset
    );
    expect(ThenableRegionClassMock.mock.calls[0][1]).toBe(
      verticalPosition + topOffset + yOffset
    );
    expect(ThenableRegionClassMock.mock.calls[0][2]).toBe(width);
    expect(ThenableRegionClassMock.mock.calls[0][3]).toBe(height);
  });
});
