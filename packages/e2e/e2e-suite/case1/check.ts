(async () => {
  const testCase = new TestCase("Fry a typed egg");
  const url = "https://sakuli.io/e2e-pages/sandbox/";
  const env = new Environment();
  const screen = new Region();
  try {
    await _navigateTo(url);
    await testCase.endOfStep("Navigate to sakuli website");

    await env.setSimilarity(0.8);
    const region = await screen.find("assets/needle.png");
    await region.highlight(1);
    await _assertEqual(
      await _getTextFromRegion(region),
      "Every html element in one place. Just waiting to be styled.\n\f"
    );
  } catch (e) {
    await testCase.handleException(e);
  } finally {
    await testCase.saveResult();
  }
})();
