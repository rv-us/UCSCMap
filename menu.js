import puppeteer from "puppeteer";

const getQuotes = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  const page = await browser.newPage();
  
  page.on('console', consoleObj => {
    if (consoleObj.type() === 'log') {
        console.log(consoleObj.text());
    }
  });
  await page.goto("https://nutrition.sa.ucsc.edu/shortmenu.aspx?sName=UC+Santa+Cruz+Dining&locationNum=05&locationName=Cowell%2fStevenson+Dining+Hall&naFlag=1", {
    waitUntil: "domcontentloaded",
  });
  await page.waitForSelector('.shortmenurecipes');
  const quotes = await page.evaluate(() => {
    const quoteElements = document.querySelectorAll(".shortmenurecipes");
    console.log(quoteElements.length);
    const quotesArray = [];

    quoteElements.forEach(quoteElement => {
      const text = quoteElement.querySelector('a').innerText;
      if (text !== null) {
        // Text is not null, do something with it
        console.log("Data grabbed successfully:", text);
      } else {
        // Text is null, handle the case where data could not be grabbed
        console.log("Data could not be grabbed.");
      }
      quotesArray.push({text});
    });

    return quotesArray;
  });

  // Display the quotes
  console.log(quotes);

  // Close the browser
  await browser.close();
};

// Start the scraping
getQuotes();
