// import required libraries
import fs from 'fs'; // File system operations
import nodeFetch from 'node-fetch'; // HTTP requests
import * as cheerio from 'cheerio'; // HTML parsing
import moment from 'moment'; // Date formatting
import {
  default as FormData
} from "form-data";
import fetchCookie from 'fetch-cookie';



const fetch = fetchCookie(nodeFetch);

// Save HTML Pages
function saveHTMLPages(content, fileName) {
  // Save pages to disk
  fs.writeFile(fileName, content, (error) => {
    if (error) {
      console.error(`Error while saving ${fileName}`, error)
    } else {
      console.log(`Successfully saved ${fileName}`);
    }
  });
};

// Save metadata to a file
function saveMetadataToFile(metadata) {
  const fileName = 'case_metadata.json';
  fs.writeFile(fileName, JSON.stringify(metadata, null, 2), (err) => {
    if (err) {
      console.error(`Error saving ${fileName}:`, err);
    } else {
      console.log(`Saved ${fileName}`);
    }
  });
}

// Handle response and errors in fetch
const checkStatusAndParse = (response) => {
  if (!response.ok) throw new Error(`Status Code Error: ${response.status}`);
  return response.text();
}

// Extract metadata from HTML using Cheerio
function extractMetadata(html) {
  const $ = cheerio.load(html);

  const metadata = [];
  $('div.post').each((index, element) => {
    // Extracting metadata fields from HTML elements
    const caseTitle = $(element).find('h2').text().trim();
    const caseNumber = $(element).find('.case-number').text().trim().replace('Case Number:', '').trim();
    const dateDelivered = $(element).find('.date-delivered').text().trim().replace('Date Delivered:', '').trim();
    const judge = $(element).find('.bg:contains("Judge:")').text().trim().replace('Judge:', '').trim();
    const court = $(element).find('.bg:contains("Court:")').text().trim().replace('Court:', '').trim();
    const parties = $(element).find('.bg:contains("Parties:")').text().trim().replace('Parties:', '').trim();
    const advocates = $(element).find('.bg:contains("Advocates:")').text().trim().replace('Advocates:', '').trim();
    const citation = $(element).find('p:contains("Citation:")').text().trim().replace('Citation:', '').trim();

    // Formatting the date using moment.js
    const formattedDate = moment(dateDelivered, 'D MMMM YYYY').format('YYYY-MM-DD');


    // Creating an object with the extracted metadata
    const caseMetadata = {
      caseTitle,
      caseNumber,
      dateDelivered: formattedDate,
      judge,
      court,
      parties,
      advocates,
      citation
    };

    metadata.push(caseMetadata);

  });

  return metadata;
}

// Fetch HTML Pages
async function fetchFivePages() {

  // URL's for the required pages
  const baseURL = 'http://kenyalaw.org/caselaw/cases/advanced_search/';
  const pageTwoURL = 'http://kenyalaw.org/caselaw/cases/advanced_search/page/10/';
  const pageThreeURL = 'http://kenyalaw.org/caselaw/cases/advanced_search/page/20/';
  const pageFourURL = 'http://kenyalaw.org/caselaw/cases/advanced_search/page/30/';
  const pageFiveURL = 'http://kenyalaw.org/caselaw/cases/advanced_search/page/40/';

  // Making an HTTP request to fetch the HTML content
  const headers = {
    "Cache-Control": "no-cache",
    "Origin": "http://kenyalaw.org",
    "Pragma": "no-cache",
    "Referer": "http://kenyalaw.org/caselaw/cases/advanced_search_courts?court=190000",
    "Upgrade-Insecure-Requests": "1",
    "Accept-Encoding": "gzip, deflate, br"
  };

  const formData = new FormData();
  formData.append("content", "");
  formData.append("subject", "");
  formData.append("case_number", "");
  formData.append("parties", "");
  formData.append("court[]", "190000");
  formData.append("date_from", "01 Jan 2022");
  formData.append("date_to", "31 Jan 2022");
  formData.append("submit", "Search");

  // Make Request for First Page
  try {
    const firsPageRequest = await fetch(baseURL, {
      method: "POST",
      body: formData,
      headers: headers
    })
    // Return html for the first page
    const firstPageHtml = await checkStatusAndParse(firsPageRequest);

    // Save first page html to disk
    saveHTMLPages(firstPageHtml, 'page-1.html');


    // Make Request for Second Page
    const secondPageRequest = await fetch(pageTwoURL, {
      method: "GET",
      credentials: "include",
      headers: {
        "Cache-Control": "no-cache",
        "pragma": "no-cache",
        "Host": "kenyalaw.org",
        "Referer": "http://kenyalaw.org/caselaw/cases/advanced_search/",
        "Upgrade-Insecure-Requests": "1",
        "Accept-Encoding": "gzip, deflate"
      }
    })
    // Return html for second page
    const secondPageHtml = await checkStatusAndParse(secondPageRequest);
    // Save second page html to disk
    saveHTMLPages(secondPageHtml, 'page-2.html');

    // Make Request for Third Page
    const thirdPageRequest = await fetch(pageThreeURL, {
      method: "GET",
      credentials: "include",
      headers: {
        "Cache-Control": "no-cache",
        "pragma": "no-cache",
        "Host": "kenyalaw.org",
        "Referer": "http://kenyalaw.org/caselaw/cases/advanced_search/page/10/",
        "Upgrade-Insecure-Requests": "1",
        "Accept-Encoding": "gzip, deflate"
      }
    })
    // Return html for third pge
    const thirdPageHtml = await checkStatusAndParse(thirdPageRequest);
    // Save Third Page Html to disk
    saveHTMLPages(thirdPageHtml, 'page-3.html');


    // Make Request for Fourth Page
    const fourthPageRequest = await fetch(pageFourURL, {
      method: "GET",
      credentials: "include",
      headers: {
        "Cache-Control": "no-cache",
        "pragma": "no-cache",
        "Host": "kenyalaw.org",
        "Referer": "http://kenyalaw.org/caselaw/cases/advanced_search/page/20/",
        "Upgrade-Insecure-Requests": "1",
        "Accept-Encoding": "gzip, deflate"
      }
    })
    // Return html for fourth page
    const fourthPageHtml = await checkStatusAndParse(fourthPageRequest);
    // Save Fourth Page Html to disk
    saveHTMLPages(fourthPageHtml, 'page-4.html');



    // Make Request for the Fifth Page
    const fifthPageRequest = await fetch(pageFiveURL, {
      method: "GET",
      credentials: "include",
      headers: {
        "Cache-Control": "no-cache",
        "pragma": "no-cache",
        "Host": "kenyalaw.org",
        "Referer": "http://kenyalaw.org/caselaw/cases/advanced_search/page/30/",
        "Upgrade-Insecure-Requests": "1",
        "Accept-Encoding": "gzip, deflate"
      }
    })
    // Return html for fifth page
    const fifthPageHtml = await checkStatusAndParse(fifthPageRequest);
    // Save fifth page html to page
    saveHTMLPages(fifthPageHtml, 'page-5.html');

    // save all the html results in a variable to use it with cheerio
    const htmlContent = [firstPageHtml, secondPageHtml, thirdPageHtml, fourthPageHtml, fifthPageHtml];


    // Array to save all the 50 metadata
    const allMetadata = [];

    htmlContent.forEach((html) => {
      const pageMetadata = extractMetadata(html);
      allMetadata.push(...pageMetadata);
    })
    // save all the 50 records
    saveMetadataToFile(allMetadata);
  } catch (error) {
    console.error('Error while saving pages: ', error);
  }
}
fetchFivePages();