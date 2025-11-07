# Vibe Commerce Mock E‑Com Cart

Full-stack shopping cart application rebuilt in **React + Node/Express + MongoDB** to satisfy every requirement in the Vibe Commerce internship brief.

> 🎯 **Goal:** Demonstrate full-stack proficiency by delivering a responsive storefront with cart management, checkout receipt, persistence, and bonus UX enhancements.

---

## 📚 Table of Contents

1. [Project Summary](#project-summary)
2. [Tech Stack](#tech-stack)
3. [Screenshots](#screenshots)
4. [Repository Structure](#repository-structure)
5. [Getting Started](#getting-started)
   - [Backend](#backend)
   - [Frontend](#frontend)
6. [Environment Variables](#environment-variables)
7. [How It Meets The Assignment](#how-it-meets-the-assignment)
8. [API Overview](#api-overview)
9. [UX Walkthrough](#ux-walkthrough)
10. [Testing & Validation](#testing--validation)
11. [Troubleshooting](#troubleshooting)
12. [Deliverables Checklist](#deliverables-checklist)

---

## Project Summary

- Responsive storefront showcasing mock electronics catalog
- Authenticated cart management with JWT session
- Checkout flow that calculates subtotal, discount, delivery fee, and final total
- Receipt modal + optional order confirmation email via Nodemailer
- Persistent MongoDB storage for users, cart, and orders

## Tech Stack

| Area      | Technology |
|-----------|------------|
| Frontend  | React 19 (Vite), Tailwind utility classes, Context API |
| Backend   | Node.js 20, Express.js, Mongoose |
| Database  | MongoDB Atlas/local |
| Auth      | JWT + bcryptjs |
| Emails    | Nodemailer (optional) |

---

## Screenshots

> 📁 All captures live in the `screenshots/` folder at the project root.

| Screen | Preview |
|--------|---------|
| Home Hero | ![Home Hero](screenshots/Screenshot%202025-11-07%20105249.png) |
| Product Grid | ![Product Grid](screenshots/Screenshot%202025-11-07%20142742.png) |
| Sign Up | ![Sign Up](screenshots/Screenshot%202025-11-07%20152353.png) |
| Login | ![Login](screenshots/Screenshot%202025-11-07%20152409.png) |
| Verification Failed | ![Verification Failed](screenshots/Screenshot%202025-11-07%20152424.png) |
| Cart Summary | ![Cart Summary](screenshots/Screenshot%202025-11-07%20152445.png) |
| Checkout Form | ![Checkout Form](screenshots/Screenshot%202025-11-07%20152507.png) |
| Hero Variant | ![Hero Variant](screenshots/Screenshot%202025-11-07%20152535.png) |

---

## Repository Structure

```
EcommNode/
├── backend-node/             # Node/Express backend
│   ├── server.js             # App entry (port 8080 by default)
│   ├── controllers/          # Route handlers (auth, cart, checkout, etc.)
│   ├── models/               # Mongoose schemas (User, Product)
│   ├── routes/api.js         # REST API wiring
│   ├── middleware/auth.js    # JWT guard
│   └── utils/                # Email + token helpers
│
└── frontend/                 # React application
    ├── src/
    │   ├── pages/            # Screens (Home, Cart, SimpleCheckout…)
    │   ├── components/       # UI components (Navbar, ProductCard…)
    │   ├── context/          # Auth & Cart providers
    │   └── services/         # Axios API wrappers
    └── public/
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 18.x
- MongoDB instance (Atlas or local)
- npm (or yarn/pnpm)

### Backend

```bash
cd backend-node
npm install
cp .env.example .env   # if provided
# or create .env manually (see below)
npm start
# Server runs on http://localhost:8080
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# Vite serves at http://localhost:5173 (or the port shown in console)
```

Access the UI at `http://localhost:5173` and the API at `http://localhost:8080`.

---

## Environment Variables

Create `backend-node/.env` with:

```env
PORT=8080
MONGODB_URI=mongodb://localhost:27017/ecomm
JWT_SECRET=replace-with-strong-secret

# Optional: email notifications
EMAIL_SERVICE=gmail
EMAIL_USER=you@example.com
EMAIL_PASS=generated-app-password
```

> Without email credentials the checkout still succeeds; the app logs a warning and skips the email send.

The frontend uses Vite defaults—no `.env` required unless you move the API URL (see `frontend/src/lib/api.js`).

---

## How It Meets The Assignment

### Backend Requirements

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| `GET /api/products` returns 5–10 items | ✅ | `productController.getAllProducts()` seeds & returns catalog |
| `POST /api/cart` add `{productId, qty}` | ✅ | `cartController.addToCart()` |
| `DELETE /api/cart/:id` remove item | ✅ | `cartController.removeFromCart()` |
| `GET /api/cart` returns cart + totals | ✅ | `cartController.getCart()` |
| `POST /api/checkout` → `{ cartItems }` receipt | ✅ | `checkoutController.checkout()` returns subtotal, discount, delivery fee, total, timestamp |

### Frontend Requirements

- ✅ Responsive hero with featured product + product grid (`Home.jsx` + `ProductCard`)
- ✅ Cart page with quantity adjust & removal (`Cart.jsx`)
- ✅ Checkout form capturing name/email + receipt modal (`SimpleCheckout.jsx`, `ReceiptModal.jsx`)
- ✅ State management via Context API (Auth & Cart)
- ✅ Bonus: Persistent MongoDB users/orders, error states, auto-filled customer info, email notification hook

---

## API Overview

All protected endpoints expect a JWT in the `token` header.

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Products
- `GET /api/products`
- `GET /api/products/:id`
- `GET /api/products/search?name=query`

### Cart
- `GET /api/cart`
- `POST /api/cart` (`{ productId, qty }`)
- `PUT /api/cart/items/:id` (`{ quantity }`)
- `DELETE /api/cart/:id`
- `DELETE /api/cart` (clear all)

### Checkout
- `POST /api/checkout`
  - returns:
    ```json
    {
      "subtotal": 598,
      "discountRate": 0.2,
      "discount": 119.6,
      "deliveryFee": 15,
      "total": 493.4,
      "timestamp": "2024-11-07T10:30:00.000Z",
      "order_id": "...",
      "items": 2
    }
    ```

---

## UX Walkthrough

1. **Browse Products:** Home hero mirrors the assignment inspiration with pastel theme. Product grid displays add-to-cart buttons, star ratings, and price.
2. **Authentication:** Sign-up & login pages take the user through JWT authentication. Navbar greets the user (`Hi, <name>`).
3. **Cart Management:** Cart consolidates duplicate items, calculates subtotal, 20% discount, $15 delivery fee, and final total; controls allow quantity updates or removal.
4. **Checkout:** Customer information auto-fills from profile. Receipt modal confirms totals and order ID. Optional email confirmation fires if SMTP credentials exist.

---

## Testing & Validation

### Quick Manual Checks

```bash
# 1. Fetch products
curl http://localhost:8080/api/products

# 2. Register user
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"first_name":"John","last_name":"Doe","email":"john@example.com","password":"password123","phone":"+1234567890"}'

# 3. Login and capture token
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# 4. Add to cart (replace TOKEN and PRODUCT_ID)
curl -X POST http://localhost:8080/api/cart \
  -H "Content-Type: application/json" \
  -H "token: TOKEN" \
  -d '{"productId":"PRODUCT_ID","qty":2}'

# 5. Checkout
curl -X POST http://localhost:8080/api/checkout \
  -H "Content-Type: application/json" \
  -H "token: TOKEN" \
  -d '{"cartItems":[]}'
```

### Automated Scripts
- `npm run lint` inside `frontend/` to ensure React code quality.
- Backend controllers covered through integration testing in manual steps above (can be extended with Jest/Supertest if desired).

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| API returns 401 | Ensure `token` header is present (JWT from login) |
| `Failed to process checkout` | Confirm MongoDB connection and that cart has items |
| Email errors in logs | Provide valid `EMAIL_USER`/`EMAIL_PASS` or remove them; checkout still completes |
| Images not showing in README | Verify screenshots exist in `docs/screenshots/` with the filenames listed above |

---

## Deliverables Checklist

- [x] `/backend-node` and `/frontend` folders with full source
- [x] README with setup steps, screenshots, explainer (this file)
- [x] Bonus features implemented (auth, MongoDB persistence, email)
- [ ] 1–2 minute demo video (record + link here once uploaded)


---



