const puppeteer = require('puppeteer');

/**
 * To have Puppeteer fetch a Firefox binary for you, first run:
 *
 *  PUPPETEER_PRODUCT=firefox npm install
 *
 * To get additional logging about which browser binary is executed,
 * run this example as:
 *
 *   DEBUG=puppeteer:launcher NODE_PATH=../ node examples/cross-browser.js
 *
 * You can set a custom binary with the `executablePath` launcher option.
 *
 *
 */

const myfirefoxOptions = {
  product: 'firefox',
  extraPrefsFirefox: {
    // Enable additional Firefox logging from its protocol implementation
    // 'remote.log.level': 'Trace',
  },
  // Make browser logs visible
  dumpio: false,
};

(async () => {
  const browser = await puppeteer.launch(myfirefoxOptions);

  const page = await browser.newPage();
  console.log(await browser.version());

  await page.goto('https://news.ycombinator.com/');

  // Extract articles from the page.
  const resultsSelector = '.titleline > a';
  const links = await page.evaluate(resultsSelector => {
    const anchors = Array.from(document.querySelectorAll(resultsSelector));
    return anchors.map(anchor => {
      // const title = anchor.textContent.trim();
      return `${title} - ${anchor.href}`;
    });
  }, resultsSelector);
  console.log(links.join('\n'));

  await browser.close();
})();

const prettier = require('prettier');

const cleanupBlockComment = value => {
  return value
    .trim()
    .split('\n')
    .map(value => {
      value = value.trim();
      if (value.startsWith('*')) {
        value = value.slice(1);
        if (value.startsWith(' ')) {
          value = value.slice(1);
        }
      }
      return value.trimEnd();
    })
    .join('\n').trim();
    // .trim();
};

const format = (value, offset, prettierOptions) => {
  return prettier
    .format(value, {
      ...prettierOptions,
      // This is the print width minus 3 (the length of ` * `) and the offset.
      printWidth: prettierOptions.printWidth - (offset + 3),
    })
    .trim();
};

const buildBlockComment = (value, offset) => {
  const spaces = ' '.repeat(offset);
  const lines = value.split('\n').map(line => {
    return ` * ${line}`;
  });
  lines.unshift('/**');
  lines.push(' */');
  lines.forEach((line, i) => {
    lines[i] = `${spaces}${line}`;
  });
  return lines.join('\n');
};
