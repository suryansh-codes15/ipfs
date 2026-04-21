The Architecture of
Financial Freedomconst puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 800, height: 1131, deviceScaleFactor: 2 });
    await page.goto('file:///' + __dirname.replace(/\\/g, '/') + '/bg.html');
    await page.screenshot({ path: 'bg.png' });
    await browser.close();
})();
