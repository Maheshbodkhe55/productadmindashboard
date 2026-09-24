# Product Admin Dashboard

A responsive Product Admin Dashboard built with Next.js App Router, React, TypeScript, Tailwind CSS and Axios using DummyJSON.

## Demo Login

- Username: `emilys`
- Password: `emilyspass`

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Features

- Login/logout with protected routes
- Axios API layer with auth interceptor
- Product search and category filtering
- Combined search + category filtering
- Sorting by title, price and rating
- URL-synchronized filters and pagination
- Debounced search with AbortController
- Responsive desktop table and mobile cards
- Product details and reviews
- Add, edit and delete product
- localStorage overlay for DummyJSON simulated CRUD
- Loading, empty and error states

## CRUD persistence

DummyJSON simulates mutations and does not persist them server-side. Successful mutations are therefore mirrored in `localStorage`. Created products, edits and deletions are merged with API results before rendering.

## Search + category

When both are selected, the category dataset is loaded and title/description matching is performed client-side. Pagination is then calculated from the filtered result.

## Race-condition handling

Each search request receives its own AbortController. Starting a newer request aborts the previous request, preventing stale responses from replacing current search results.

## Architecture

`src/services` contains API calls, `src/context` handles authentication, `src/lib/storage.ts` handles the local persistence overlay, and UI components are separated from page routing.

## Build

```bash
npm run build
```
