(async () => {
  const testCase = new TestCase("Fry a typed egg");
  const url = "https://sakuli.io/e2e-pages/sandbox/";
  try {
    await _navigateTo(url);
    await testCase.endOfStep("Navigate to sakuli sandbox website");

    await _wait(1000);
    const region = await new Region(0, 100, 650, 200);
    const textOnScreen = await _getTextFromRegion(region);
    const searchString = /Every html element in one place\. Just waiting to be styled\./;

    Logger.logDebug(`Text on screen: \n ${textOnScreen}\n`);

    await _assert(
      Promise.resolve(!!textOnScreen.match(searchString)),
      `Could not find searched text on screen: "${searchString}"`
    );
  } catch (e) {
    await testCase.handleException(e);
  } finally {
    await testCase.saveResult();
  }
})();
