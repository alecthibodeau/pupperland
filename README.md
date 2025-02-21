# Pupperland

## Run this site locally
In your local machine's command line interface (CLI) enter the following commands to clone and then serve the application:

1. `git clone https://github.com/alecthibodeau/pupperland.git`
2. `cd pupperland`
3. `npm install`
4. `npm run dev`

- Note the port number (likely `5173`) in your CLI's address
- In your browser navigate to `http://localhost:5173/pupperland` &mdash; or to the equivalent port number

## What is Pupperland?
Pupperland is a site that simulates browsing a directory of shelter dogs (puppers!) that are available to bring home. The user is able to search thousands of dogs based on preferences like breed, age, number of dogs searched and zip code. The user can then select their favorite dogs and request a match. The matching process results in a single dog selected for the user.

## Where is Pupperland?
[pupperland.com](https://pupperland.com) redirects to [alect.me/pupperland](https://alect.me/pupperland)

**Caveat**: If you're viewing Pupperland on a mobile device you'll need to set your browser to allow [HttpOnly](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#httponly) cookies. On an iPhone, for example,  go to `Settings > Apps > Safari` and then uncheck the "Prevent Cross-Website Tracking" checkbox. Otherwise you won't be fully authenticated, which means search functionality won't work. And logout won't work either &mdash; at least not without reloading.

## How to use Pupperland
Follow these steps:
1. Log in with a name and email address
2. Configure any of the search preferences and then click the `Search Dogs` button
3. From the list of resulting dog cards click at least two cards to enable the `Match` button at lower-right
4. Click the `Match` button
5. See the resulting matched dog
6. Search again as many times as you wish

## Features

### Current features

#### Code standards
- Strictly-typed variables with TypeScript
- Separation of concerns &mdash; with API request functions for `dogs` and `locations` stored in dedicated helper files
- Componentization &mdash; with associated TSX, interface and style sheet files
- Accessibility:
  - Color contrast values at [WCAG Level AA](https://www.w3.org/WAI/WCAG2AA-Conformance) or greater
  - Semantic HTML tags
  - Responsive web design (mobile-first)

#### Authentication
- Login validation with messaging for the user:
  - Name is required
  - Email is required
  - Email input's value must be formatted as a valid email address
- The user can log out at any time
- If the user's authentication token has expired after the allotted hour then clicking `Search Dogs` will redirect the user to the login interface

#### User Interface: Search
- Age range validation with messaging for the user:
  - Minimum age must be less than or equal to maximum age
  - The `Search Dogs` button is disabled if age range is invalid
- Search size input's value is automatically formatted to&hellip;
  - Be only digits
  - Be limited to a range of `1` to `10,000` dogs
- Search size validation with messaging for the user:
  - Message appears if the user enters any character that's not a digit
- Zip code input's value is automatically formatted to&hellip;
  - Be only digits
  - Be no more than five digits
- Zip code validation with messaging for the user:
  - Message appears if the user enters any character that's not a digit
  - Message appears if the user tries to add a zip code containing less than five digits by clicking the `Add` button
- A loader appears during the search after the user clicks `Search Dogs`
- Messaging appears for the user if the search result is empty

#### User Interface: Result of Search
- The number of total dogs found in the search is displayed at top
- The user can click the `New Search` button at any time
- Dogs cards are displayed alphabetically by breed
- The user can reverse the order of the dog cards by clicking the `Sort` button
- Pagination of total dog cards: navigation elements are located both above and below the group of dog cards
- The user can click any dog card to select it as a favorite
- The favorites count is displayed at top
- The user can clear all favorites by clicking the `Clear` button
- The `Match` button is&hellip;
  - A floating access button (FAB) for ease of use
  - Disabled if the count of favorite dogs is less than two

#### User Interface: Result of Matched Dog
- This final step displays information for the matched dog: name, breed, city, state and age
- The matched dog's photo is displayed at actual size within the limits of the viewport's width
- The photo displays as large as possible when accounting for the variation in image dimensions across the database of dogs

#### Styling
- Original color palette with custom variables
- Google Fonts: [Open Sans](https://fonts.google.com/specimen/Open+Sans) (sans-serif) and [Fredoka](https://fonts.google.com/specimen/Fredoka) (serif)
- Multiple approaches to icon generation:
  - SVGs
  - HTML entities
  - CSS shapes
- Custom favicon

### Possible future features
- Additional use of dog location data, either during the search process or for the resulting matched dog
- Option for the user to save their name in the browser with [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- Redirect the user back to the login interface if their authentication token expires
- Format the search size input to include a comma for numbers larger than 999

## Technologies

Pupperland is built with:
- [React](https://react.dev)
- [React Router](https://reactrouter.com)
- [TypeScript](https://www.typescriptlang.org)
- [Vite](https://vite.dev)
- [Cascading Style Sheets (CSS)](https://developer.mozilla.org/en-US/docs/Web/CSS)

Software and content Copyright (C) Alec Thibodeau. Copyright year is by commit date.