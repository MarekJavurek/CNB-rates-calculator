# CNB rates calculator

- project is using corepack
- for more, see commands in package.json

# ENV vars

- api/cnb-rates.ts needs ENV variable CNB_API_URL (CNB server)
- react app needs ENV variable FE_CNB_API_URL (API proxy URL)

# Nice to have (TODOs)

- new CNB data arrives at 2.30 p.m., we can calculate staleTime.
- YUP/ZOD form validations
- we have no tests for proxy API (serverless function)
- some more fancy table
- focus more on mobile UX

# Task Assignment

Create a simple React app (don't use NextJS please), which:

1. When it starts, retrieve the latest currency exchange rates from the Czech National Bank.

API URL: https://www.cnb.cz/en/financial-markets/foreign-exchange-market/central-bank-exchange-rate-fixing/central-bank-exchange-rate-fixing/daily.txt

Documentation: https://www.cnb.cz/en/faq/Format-of-the-foreign-exchange-market-rates/

2. Parses the downloaded data and clearly displays a list to the user in the UI.

3. Add a simple form, into which the customer can enter an amount in CZK and select a currency, and after submitting (clicking a button or in real-time) sees the amount entered in CZK converted into the selected currency.

4. Commit your code throughout your work and upload the resulting codebase into a Github repo.

5. Deploy the app so it can be viewed online (it doesn’t matter where - e.q. Vercel, Netflify, etc.).
  
6. Add automated tests which might be appropriate to ensure that your solution is working correctly.

7. Tech stack: React (+ Hooks), TypeScript, Styled Components, React Query.

Overall: Keep the code simple and the UI nice and easy to use for the user.
