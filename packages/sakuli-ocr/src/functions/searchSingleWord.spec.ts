import { mockAltoXml } from "./__mocks__/mockAltoXml";
import { searchSingleWord } from "./searchSingleWord";

describe("search single word", () => {
  it("should find a single word in text", () => {
    //GIVEN
    const searchText = "foo";
    const expectedStringId = "string_4";
    const altoXml = mockAltoXml(`
            <ComposedBlock ID="cblock_0" >
                <TextBlock ID="block_0">
                    <TextLine ID="block_0" HPOS="39" VPOS="5" WIDTH="400" HEIGHT="16">
                        <String ID="string_0" CONTENT="meta"/>
                        <String ID="string_1" CONTENT="syntactic"/>
                        <String ID="string_2" CONTENT="variables"/>
                        <String ID="string_3" CONTENT="are"/>
                        <String ID="${expectedStringId}" CONTENT="foo"/>
                        <String ID="string_5" CONTENT="bar"/>
                    </TextLine>
                </TextBlock>
            </ComposedBlock>
        `);

    //WHEN
    const stringWithText = searchSingleWord(searchText, altoXml);

    //THEN
    expect(stringWithText.attributes.getNamedItem("ID").value).toEqual(
      expectedStringId
    );
  });

  it("should throw if word cannot be found in text", () => {
    //GIVEN
    const searchText = "foo";
    const altoXml = mockAltoXml(`
            <ComposedBlock ID="cblock_0" >
                <TextBlock ID="block_0">
                    <TextLine ID="block_0" HPOS="39" VPOS="5" WIDTH="400" HEIGHT="16">
                        <String ID="string_0" CONTENT="meta"/>
                        <String ID="string_1" CONTENT="syntactic"/>
                        <String ID="string_2" CONTENT="variables"/>
                        <String ID="string_3" CONTENT="are"/>
                        <String ID="string_5" CONTENT="bar"/>
                    </TextLine>
                </TextBlock>
            </ComposedBlock>
        `);

    //WHEN
    const searchTextCall = () => searchSingleWord(searchText, altoXml);

    //THEN
    expect(searchTextCall).toThrowError(
      `Search text "${searchText}" could not be found on screen.`
    );
  });
});
