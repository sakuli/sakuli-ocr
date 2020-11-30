(async () => {
  const testCase = new TestCase("getRegionByText");
  const url = "https://sakuli.io/e2e-pages/fryed-egg/license.html";
  const screen = new Region();
  try {
    await _navigateTo(url);
    await testCase.endOfStep("Navigate to sakuli website");
    await _wait(1000)
    await _getRegionByText("License").highlight(1)
    await _getRegionByText("Software", new Region(1290, 300, 70,30)).highlight(1)
    await _getRegionByText("Originally posted on CodePen").highlight(1)
    await _wait(3000)
    // await _getRegionByText("Main Use-Cases").highlight(1);
  } catch (e) {
    await testCase.handleException(e);
  } finally {
    await testCase.saveResult();
  }
})();
