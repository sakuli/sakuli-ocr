(async () => {
  const testCase = new TestCase("getRegionByText");
  const url = "https://sakuli.io";
  const screen = new Region();
  try {
    await _navigateTo(url);
    await testCase.endOfStep("Navigate to sakuli website");
    await _getRegionByText("EXPLORE").click();
    await _getRegionByText("Main Use-Cases").highlight(1);
  } catch (e) {
    await testCase.handleException(e);
  } finally {
    await testCase.saveResult();
  }
})();
