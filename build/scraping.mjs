import { chromium } from 'playwright';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set } from 'firebase/database';


// Firebase configuration (replace with your own config)
const firebaseConfig = {
    apiKey: "AIzaSyDiEfJb9DOKfqXfy_Y9xZhQmZ0TXbNO1ro",
    authDomain: "ucsc-event-planner-408319.firebaseapp.com",
    databaseURL: "https://ucsc-event-planner-408319-default-rtdb.firebaseio.com",
    projectId: "ucsc-event-planner-408319",
    storageBucket: "ucsc-event-planner-408319.appspot.com",
    messagingSenderId: "648866811",
    appId: "1:648866811:web:5ed56e5e1de181b184f95e",
    measurementId: "G-XSLP60WBV9"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);
// Global object to store scraped menus
function createFirebaseKey(diningHallName) {
    return diningHallName.replace(/[.#$/[\]]/g, '_');
}
let scrapedMenus = {};
async function scrapePage(url, diningHallName) {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    // Navigate to a website
    await page.goto(url);
    
    // Click the link with the specified text
    await page.click(`a:has-text("${diningHallName}")`);
                                                                                      
    const recipes = await page.evaluate(() => {
        const recipesData = [];
        let currentCategory = null;
                                                                                      
        const elements = document.querySelectorAll('.shortmenurecipes, .shortmenumeals');
        for (const element of elements) {
            const text = element.textContent.trim();

            if (element.classList.contains('shortmenumeals')) {
                // If it's a category, update the current category
                currentCategory = text;
            } else if (currentCategory) {
                // If it's a recipe and there's a current category, add it to the list
                recipesData.push({ category: currentCategory, recipe: text });
            }
        }

        return recipesData;
    });

    // Log the scraped text
    // console.log(`Scraped Recipe for ${diningHallName}:`, recipes);

    // Store the scraped menus in the global object
    const encodedDiningHallName = encodeURIComponent(diningHallName);
    const firebaseKey = createFirebaseKey(encodedDiningHallName);
    scrapedMenus[firebaseKey] = recipes;

    // Close the browser window
    await browser.close();
}

(async () => {
    const urlsAndDiningHalls = [
        { url: 'https://nutrition.sa.ucsc.edu/', diningHall: 'College Nine/John R. Lewis Dining Hall' },
        { url: 'https://nutrition.sa.ucsc.edu/', diningHall: 'Crown/Merrill Dining Hall' },
        { url: 'https://nutrition.sa.ucsc.edu/', diningHall: 'Cowell/Stevenson Dining Hall' },
        { url: 'https://nutrition.sa.ucsc.edu/', diningHall: 'Porter/Kresge Dining Hall' },
        { url: 'https://nutrition.sa.ucsc.edu/', diningHall: 'Rachel Carson/Oakes Dining Hall' },
        // Add more objects as needed
    ];

    // Run the scraping functions in parallel
    const scrapingPromises = urlsAndDiningHalls.map(({ url, diningHall }) => scrapePage(url, diningHall));
    await Promise.all(scrapingPromises);
    console.log('Scraped Menus:', scrapedMenus);
    const dbRef = ref(database, 'scrapedMenus');
    await set(dbRef, scrapedMenus);
    // Log the global object containing all scraped menus
})();
