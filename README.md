# BuyCheapThings: A Modern E-Commerce Web Application

Welcome to **BuyCheapThings**—a sleek, full-featured e-commerce platform built with Next.js. This application integrates cutting-edge libraries, frameworks, and best practices to deliver a production-grade shopping experience. Below, you’ll find everything you need to know about the project’s architecture, features, and how to get it up and running locally.

---

## Table of Contents

1. [Overview](#overview)
2. [Key Features](#key-features)
3. [Tech Stack](#tech-stack)
4. [Live Demo](#live-demo)
5. [Screenshots](#screenshots)
6. [Project Structure](#project-structure)
7. [Getting Started](#getting-started)
8. [Usage](#usage)
9. [License](#license)
10. [Contact](#contact)

---

## Overview

**BuyCheapThings** is a comprehensive e-commerce application that offers a smooth shopping experience, complete with a robust admin dashboard, secure payment options, real-time search, user authentication, and more. This project follows modern development best practices, making it a great addition to any developer’s portfolio.

---

## Key Features

- **Modern UI/UX**  
  Built with Tailwind CSS and shadcn for a polished, responsive, and accessible design.

- **Advanced Search**  
  Integrated with Algolia for powerful, lightning-fast search capabilities.

- **Secure Payment**  
  Payment processing via Stripe Elements ensures a reliable and safe checkout experience.

- **Authentication & Authorization**  
  User account creation and management powered by Next Auth V5, supporting email/password login, OAuth2, and optional 2FA.

- **Scalable Data & State Management**

  - Drizzle ORM with NeonDB Postgres ensures efficient and type-safe database queries.
  - zustand for lightweight yet powerful state management on the client side.

- **Robust Admin Dashboard**  
  Manage products, orders, analytics, and more with an intuitive interface and enhanced functionalities like text editing and image uploading.

- **Email Notifications**  
  Transactional emails handled by Resend for essential communications (receipts, account confirmations, etc.).

- **Animations**  
  Smooth transitions and dynamic effects brought to life with Framer Motion.

---

## Tech Stack

| **Technology**    | **Description**                                                    |
| ----------------- | ------------------------------------------------------------------ |
| Next.js 14.2      | Framework for React applications with server-side rendering        |
| Stripe Elements   | Secure and intuitive payment handling                              |
| Tailwind CSS      | Utility-first CSS framework for rapid UI development               |
| shadcn            | Pre-designed and customizable UI components                        |
| Next Auth V5      | Comprehensive user authentication (OAuth2, Email, 2FA, etc.)       |
| Drizzle ORM       | Type-safe and high-performance database operations                 |
| Algolia Search    | Powerful search functionality with instant feedback                |
| Framer Motion     | High-performance animations and transitions                        |
| zustand           | Fast and scalable state management for React                       |
| Resend            | Easy and reliable transactional email service                      |
| React-Hook-Form   | Simplified form handling and validation in React                   |
| Postgres + NeonDB | Serverless PostgreSQL for scalable and cost-effective data storage |

---

## Live Demo

Check out the live application here: [BuyCheapThings Demo](https://www.buycheapthings.live)

---

## Screenshots

Below are a few screenshots showcasing the user interface and features:

1. **Home Page Screenshot**

- ![Image](https://github.com/user-attachments/assets/3e6b6129-d6bf-42db-9502-5266f7327144)

2. **Product Description/Details Screenshot**

- ![Image](https://github.com/user-attachments/assets/83308196-7823-4891-9980-cb6fd053fdfe)

3. **Cart Drawer Screenshot**

- <img width="960" alt="Image" src="https://github.com/user-attachments/assets/59db09f5-2825-4749-b1f8-1e845fcb20ab" />

4. **Checkout Page Screenshot**

- <img width="949" alt="Image" src="https://github.com/user-attachments/assets/be64b60a-f6db-444b-968b-b9d0fb27e36d" />

---

## Project Structure

Below is a high-level overview of the main directories and files in this project:

- **app/**  
  Houses all Next.js routes and server-side rendering logic. This directory defines the primary structure of your pages, API endpoints, and overall application flow.

- **components/**  
  Contains reusable UI elements such as layouts, forms, and widgets. By centralizing these components, you maintain consistent design and streamline development across the application.

- **lib/**  
  A collection of helper functions, server-side actions, and utilities for data fetching, authentication, email services, and more. Within this directory, you’ll find:

- **server/**: Functions for core operations like creating orders, adding reviews, deleting products, handling email registration/sign-in, authentication flow, database connection and database schema.

- **types/**: Shared type definitions for improved type safety and maintainability throughout the application.

## Getting Started

Follow these steps to set up the project locally:

1. **Clone the Repository**

   ```bash
   git clone https://github.com/Johnadibe/buycheapthings.git
   ```

2. **Install Dependencies**
   cd buycheapthings
   npm install

3. **Set Up Environment Variables**
   Create a .env file in the root directory and add your configuration details:

```
 POSTGRES_URL=...
 GOOGLE_CLIENT_ID=...
 GOOGLE_CLIENT_SECRET=...
 GITHUB_ID=...
 GITHUB_SECRET=...
 AUTH_SECRET=...
 RESEND_API_KEY=...
 UPLOADTHING_SECRET=''
 UPLOADTHING_APP_ID=''
 UPLOADTHING_TOKEN=''
 NEXT_PUBLIC_ALGOLIA_ID=...
 ALGOLIA_ADMIN=...
 NEXT_PUBLIC_ALGOLIA_SEARCH=...
 NEXT_PUBLIC_PUBLISH_KEY=...
 STRIPE_SECRET=...
 STRIPE_WEBHOOK_SECRET=...
```

4. **Run Database Migrations (optional)**

5. **Start the Development Server**

- npm run dev

## Usage

1. **User Experience**

- Access the homepage to browse products, add items to the cart, and proceed to checkout via Stripe.

2. **Admin Dashboard**

- Admin privileges are determined by setting a user’s role in Drizzle Kit Studio (or via your database tools).
- By default, newly registered users have the user role.
- Only users with an admin role will see the extra navigation and pages for analytics, creating products, and overall product management.

3. **Authentication**

- Sign up using email/password or available OAuth providers.
- Enable 2FA and password reset flows if configured.

4. **Search Functionality**

- Type in the search bar to quickly find products with Algolia’s instant search.

## License

This project is not currently open-source. However, for demonstration purposes only, here is a reference to the MIT License: [MIT License](LICENSE).

## Contact

- Project Maintainer: John Adibe
- Email: johnadibe123@gmail.com

If you have any questions, suggestions, or issues, please feel free to open an issue or submit a pull request.

Thank you for checking out BuyCheapThings! If you find this project helpful, consider giving it a star on GitHub and sharing your feedback. Enjoy building, learning, and shopping!
