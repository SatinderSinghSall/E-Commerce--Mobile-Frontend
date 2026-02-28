# 🛍️ E-Commerce Mobile App – Frontend (Client)

A **modern, scalable, and production-ready mobile e-commerce application frontend** built using **Expo, React Native, Expo Router, NativeWind (Tailwind CSS)**, and **TypeScript**.  
This app supports **authentication, product browsing, cart & wishlist management, checkout flow, and admin features**, designed with a clean and professional UI.

---

## ✨ Features Overview

### 👤 Authentication

- Secure authentication using **Clerk (Expo)**
- Sign In / Sign Up flows
- Guest vs Authenticated user handling
- Secure token storage

### 🛒 Shopping Experience

- Product listing & categories
- Product detail pages
- Add to cart
- Wishlist / Favorites
- Quantity management
- Empty cart & empty wishlist states

### 📦 Orders & Checkout

- Checkout screen
- Address management
- Order history
- Order details view

### 🧑‍💼 Admin Panel (Frontend)

- Admin dashboard
- Add / Edit products
- Manage orders
- Dedicated admin routes

### 🎨 UI / UX

- Clean, modern, professional design
- Fully responsive layouts
- Tailwind-style utility classes via **NativeWind**
- Loading overlays & empty states
- Reusable UI components

---

## 🧱 Tech Stack

### Core

- **Expo SDK 54**
- **React Native 0.81**
- **React 19**
- **TypeScript**

### Navigation

- **Expo Router (File-based routing)**
- React Navigation (Tabs & Stacks)

### Styling

- **NativeWind**
- Tailwind CSS utilities
- Global styles support

### State Management

- React Context API
  - Cart Context
  - Wishlist Context

### Authentication

- **@clerk/clerk-expo**

### Media & Utilities

- Expo Image
- Expo Image Picker
- Expo Secure Store
- Expo Haptics
- Toast notifications

---

## 📂 Project Structure

```txt
client/
├── app/                     # App routes (Expo Router)
│   ├── (auth)/               # Authentication routes
│   ├── (tabs)/               # Bottom tab navigation
│   ├── admin/                # Admin dashboard & screens
│   ├── product/              # Product detail pages
│   ├── orders/               # Order listing & details
│   ├── components/           # Shared UI components
│   ├── checkout.tsx
│   ├── shop.tsx
│   └── _layout.tsx
│
├── assets/                   # Images, constants & static assets
│   ├── images/
│   ├── products-images/
│   ├── constants/
│   └── scripts/
│
├── context/                  # Global state (Cart, Wishlist)
│
├── global.css                # Tailwind / NativeWind styles
├── tailwind.config.js
├── app.json
├── babel.config.js
├── metro.config.js
├── tsconfig.json
└── package.json
```

````

---

## 🧭 Routing Architecture (Expo Router)

This app uses **file-based routing** powered by **Expo Router**.

### Route Groups

- `(auth)` → Authentication flow (Sign In / Sign Up)
- `(tabs)` → Main app tabs
- `admin/` → Admin-only routes
- `product/[id].tsx` → Dynamic product detail pages
- `orders/[id].tsx` → Dynamic order detail pages

### Example

```ts
app/
 ├── (tabs)/
 │   ├── index.tsx      // Home
 │   ├── cart.tsx
 │   ├── favorites.tsx
 │   └── profile.tsx
 ├── product/
 │   └── [id].tsx       // Product Details
```

---

## 🧩 Reusable Components

Located in `app/components/`

- `ProductCard`
- `CartItem`
- `CategoryItem`
- `Header`
- `Sidebar`
- `LoadingOverlay`
- `EmptyCart`
- `EmptyWishlist`
- `LogoutModal`
- `GuestProfile`

Each component is:

- Fully typed
- Reusable
- Styled using NativeWind

---

## 🛠️ State Management

### Cart Context

- Add / remove products
- Update quantities
- Persist cart state

### Wishlist Context

- Add / remove favorites
- Sync UI state globally

Located in:

```txt
context/
├── CartContext.tsx
└── WishlistContext.tsx
```

---

## 🎨 Styling System

- **NativeWind** (Tailwind for React Native)
- Utility-first styling
- Consistent spacing, typography & colors
- Global styles via `global.css`

Example:

```tsx
<View className="bg-white p-4 rounded-xl shadow-sm">
```

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone <your-repo-url>
cd client
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Start the Development Server

```bash
npm start
```

### Platform Specific

```bash
npm run android
npm run ios
npm run web
```

---

## 🔐 Environment Variables

Make sure to configure **Clerk keys** and backend API URLs.

Example:

```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key_here
EXPO_PUBLIC_API_URL=http://localhost:5000
```

---

## 🧪 Scripts

| Script            | Description                    |
| ----------------- | ------------------------------ |
| `npm start`       | Start Expo dev server          |
| `npm run android` | Run on Android emulator/device |
| `npm run ios`     | Run on iOS simulator           |
| `npm run web`     | Run on Web                     |
| `npm run lint`    | Lint the project               |

---

## 📦 Production Ready

- Modular architecture
- Clean separation of concerns
- Fully typed with TypeScript
- Scalable routing structure
- Admin-ready UI

---

## 🧑‍💻 Author

**Satinder Singh**
Full-Stack Mobile App Developer

---

## 📄 License

This project is licensed under the **MIT License**.

---

## ⭐️ Support

If you like this project, consider giving it a ⭐️
Feedback and contributions are always welcome!
````
