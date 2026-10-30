# Overview

Casa Talavera Online is a web app for browsing hand-painted ceramic products inspired by Talavera pottery from Puebla, Mexico. Visitors can search and filter products, view product details, add pieces to a shopping bag, change quantities, and apply discount codes.

To start the local test server, open a terminal in this project folder and run:

```sh
npm install
npm start
```

Then open **http://localhost:3000** in a web browser to see the shop. The start command compiles the TypeScript and launches the Express server. Press `Ctrl+C` in the terminal to stop it.

My purpose for building this software is to grow my skills as a software engineer by learning how a server-side framework handles requests and uses data to generate web pages. I also want to learn how browser interactions and saved cart data can make an online shop useful to customers and a small business.

[Software Demo Video](https://youtu.be/_krr-XDNRwM)

# Web Pages

- **Shop (`/`)** — The Express server passes product and featured-product data to an EJS template, which generates the catalog. Visitors can search by product name, filter by category, browse featured pieces with the carousel, and add products to their bag. The contact form validates the required fields and displays a confirmation message.
- **Shopping bag (`/cart`)** — Express renders the cart page. TypeScript reads saved cart items from browser local storage and displays products with quantity controls. Subtotal, discount, estimated shipping, and total update when the cart changes. The cart and selected discount code persist after a page refresh.
- **Product details (`/products/:id`)** — Selecting a product name opens a page rendered with that product's server-side data, including its category, description, price, and image placeholder. Visitors can add it to their bag or return to the shop. An unknown product ID displays a not-found page.

The header links to shop sections and the shopping bag. Product names link from the catalog to their detail pages. The `/api/products` route returns the catalog as JSON. The three rendered pages satisfy the assignment's additional-page stretch challenge.

# Development Environment

I used a terminal, and a local Node.js server to develop and run the app. The `npm` package manager installs the project libraries and runs the build and start commands.

The app is written with JavaScript and TypeScript. Node.js runs the server, Express handles web requests, EJS renders HTML templates with product data, and the TypeScript compiler builds the browser code in `src/shop.ts` into `public/js/shop.js`. HTML and CSS define the page structure and layout. Browser local storage preserves the cart and discount code.

# Useful Websites

- [Node.js Learn](https://nodejs.org/learn)
- [Express installation and getting started](https://expressjs.com/en/starter/installing/)
- [EJS documentation](https://ejs.co/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)

# Future Work

- Connect the contact form to a service that can deliver and store messages.
- Add a database for products, inventory, and customer carts.
- Connect checkout to a payment provider and add real product photography.
