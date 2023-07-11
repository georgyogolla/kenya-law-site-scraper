# kenya-law-site-scraper 
A very basic way to scrap some few pages of a website using node-fetch , cheerio and fetch-cookie. 
You can clone the project using : 
 - git clone https://github.com/georgyogolla/kenya-law-site-scraper.git && cd kenya-law-site-scraper
Install the packages using :
 - npm install
Sample site used here is http://kenyalaw.org/caselaw/cases/advanced_search_courts?court=190000
Date range used in the form is :
 - Enter the date range 2022-01-01 to 2022-01-31 and submit the form to search
 - The code only searches the first 5 pages of the returned results from date range search
