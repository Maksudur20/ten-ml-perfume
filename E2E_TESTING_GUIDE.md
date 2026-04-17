# End-to-End Testing Guide

This document provides comprehensive testing guidelines for all features of the Ten ML Perfume e-commerce application.

## Table of Contents
1. [Environment Setup](#environment-setup)
2. [User Registration & Authentication](#user-registration--authentication)
3. [Product Management](#product-management)
4. [Shopping Cart & Checkout](#shopping-cart--checkout)
5. [Order Management](#order-management)
6. [Invoice Generation](#invoice-generation)
7. [User Profile](#user-profile)
8. [Admin Features](#admin-features)
9. [Banner Management](#banner-management)
10. [Edge Cases & Error Handling](#edge-cases--error-handling)

---

## Environment Setup

### Prerequisites
- Node.js 18+ installed
- MongoDB running locally or connection string configured
- Environment variables properly configured (.env.local)

### Setup Steps
```bash
# Install dependencies
npm install

# Setup MongoDB
# Ensure MongoDB is running on localhost:27017 or update MONGODB_URI in .env.local

# Start development server
npm run dev

# Application will be available at http://localhost:3000
```

---

## User Registration & Authentication

### Test Case 1.1: User Registration with Valid Data
**Steps:**
1. Navigate to `/register`
2. Fill in form with:
   - Name: "Test User"
   - Email: "testuser@example.com"
   - Password: "SecurePass123"
   - Confirm Password: "SecurePass123"
3. Click "Register"

**Expected Result:**
- User is created in database
- User is redirected to login page
- Success message is displayed
- User can login with provided credentials

### Test Case 1.2: Registration with Existing Email
**Steps:**
1. Register a user with email "existing@example.com"
2. Try to register again with the same email

**Expected Result:**
- Error message: "Email already registered"
- User is not created

### Test Case 1.3: Registration with Invalid Email Format
**Steps:**
1. Navigate to `/register`
2. Enter invalid email format: "notanemail"
3. Attempt to submit

**Expected Result:**
- Form validation error displayed
- Registration is prevented

### Test Case 1.4: Password Validation
**Steps:**
1. Try various password combinations:
   - Short password (< 6 characters)
   - Mismatched password and confirm password
   - Valid password

**Expected Result:**
- Short passwords and mismatches show error
- Valid passwords are accepted

### Test Case 1.5: User Login
**Steps:**
1. Navigate to `/login`
2. Enter valid credentials
3. Click "Login"

**Expected Result:**
- User is authenticated
- Auth token is stored in localStorage
- User is redirected to home page
- User info is available in AuthContext

### Test Case 1.6: Login with Invalid Credentials
**Steps:**
1. Navigate to `/login`
2. Enter invalid email or password
3. Click "Login"

**Expected Result:**
- Error message displayed
- User is not logged in
- No token is stored

---

## Product Management

### Test Case 2.1: View Products List
**Steps:**
1. Navigate to `/products` or `/shop`
2. View product listing

**Expected Result:**
- All products are displayed with:
  - Product image
  - Product name
  - Brand information
  - Available sizes
  - Price
  - Add to cart button

### Test Case 2.2: Filter Products by Brand
**Steps:**
1. Click on brand filter (if available)
2. Select a specific brand

**Expected Result:**
- Products are filtered to show only selected brand
- Filter is reflected in URL/UI

### Test Case 2.3: View Product Details
**Steps:**
1. Click on any product
2. View product detail page

**Expected Result:**
- Full product information is displayed
- Size selector is available
- Quantity selector is available
- Add to cart button works

### Test Case 2.4: Add Product to Cart
**Steps:**
1. Navigate to a product
2. Select size from dropdown
3. Set quantity to 2
4. Click "Add to Cart"

**Expected Result:**
- Product is added to cart
- Cart count in header is updated
- Success notification is shown
- Cart in localStorage is updated

---

## Shopping Cart & Checkout

### Test Case 3.1: View Shopping Cart
**Steps:**
1. Add items to cart
2. Click cart icon in header
3. Navigate to cart page

**Expected Result:**
- All items in cart are displayed
- Each item shows:
  - Product name
  - Selected size
  - Quantity
  - Unit price
  - Subtotal
- Quantity can be modified
- Items can be removed
- Cart total is calculated correctly

### Test Case 3.2: Modify Cart Items
**Steps:**
1. In cart page, change quantity of an item
2. Remove an item from cart

**Expected Result:**
- Quantity updates cart total
- Item is removed from cart
- Cart total recalculates
- Changes persist in localStorage

### Test Case 3.3: Checkout Process
**Steps:**
1. Add items to cart
2. Click "Checkout"
3. Fill in delivery information:
   - Full Name: "John Doe"
   - Email: "john@example.com"
   - Phone: "01700123456"
   - Address: "123 Main Street"
   - City: "Dhaka"
4. Review order summary
5. Click "Place Order"

**Expected Result:**
- Order is created successfully
- Order is saved to database
- Tracking code is generated
- Order confirmation page is displayed with:
  - Tracking code
  - Order details
  - Total amount
  - Success message

### Test Case 3.4: Delivery Charge Calculation
**Steps:**
1. Add items to cart
2. In checkout form, enter different cities:
   - City: "Dhaka" → Expected charge: ৳70
   - City: "Chattogram" → Expected charge: ৳120
   - City: "Sylhet" → Expected charge: ৳120

**Expected Result:**
- Delivery charge updates based on city
- Total amount is recalculated correctly

### Test Case 3.5: Empty Cart Checkout
**Steps:**
1. Clear cart
2. Try to access checkout page

**Expected Result:**
- "Cart is empty" message is displayed
- "Continue Shopping" button is shown
- User is redirected or prevented from proceeding

---

## Order Management

### Test Case 4.1: View Order by Tracking Code
**Steps:**
1. Navigate to `/track`
2. Enter tracking code from order confirmation
3. Click "Search"

**Expected Result:**
- Order details are displayed
- Shows customer info, items, total, and status

### Test Case 4.2: View Order by Email
**Steps:**
1. Navigate to `/track`
2. Enter email address used during checkout
3. Click "Search"

**Expected Result:**
- All orders for that email are displayed
- Each order shows summary information

### Test Case 4.3: Create Multiple Orders
**Steps:**
1. Place 3 different orders with different tracking codes
2. Verify each order is saved to database

**Expected Result:**
- All orders are created with unique tracking codes
- Orders are retrievable by their codes
- Order data matches what was submitted

### Test Case 4.4: Order Status Updates
**Steps:**
1. Create an order (status: pending)
2. Access admin panel
3. Update order status to "confirmed"
4. Update to "shipped"
5. Update to "delivered"

**Expected Result:**
- Status changes are saved to database
- Changes are reflected when order is viewed
- Order history shows all status changes

---

## Invoice Generation

### Test Case 5.1: Download Invoice PDF
**Steps:**
1. Create an order
2. Copy tracking code
3. Navigate to user profile
4. Find the order in order history
5. Click "Download Invoice"

**Expected Result:**
- PDF file is generated and downloaded
- PDF contains:
  - Invoice number
  - Tracking code
  - Order date
  - Customer details
  - Item list with quantities and prices
  - Subtotal, delivery charge, and total
  - Company information

### Test Case 5.2: Invoice Format Verification
**Steps:**
1. Download an invoice
2. Open it in a PDF viewer
3. Verify layout and content

**Expected Result:**
- Professional invoice layout
- All required information is present
- Currency format (৳) is correct
- Numbers are properly formatted

### Test Case 5.3: Multiple Invoice Downloads
**Steps:**
1. Create 2 different orders
2. Download invoices for both

**Expected Result:**
- Both invoices download successfully
- Each has correct data
- File names are unique based on tracking codes

---

## User Profile

### Test Case 6.1: Access User Profile
**Steps:**
1. Login with valid credentials
2. Click on profile link or navigate to `/profile`

**Expected Result:**
- Profile page loads
- User name and email are displayed
- Member since date is shown
- My Orders section is available

### Test Case 6.2: View Order History
**Steps:**
1. Login as a user with multiple orders
2. Navigate to profile
3. View "My Orders" tab

**Expected Result:**
- All user's orders are listed
- Each order shows:
  - Tracking code
  - Order date
  - Status badge with appropriate color
  - Items count
  - Total amount
  - Download Invoice button

### Test Case 6.3: Download Invoice from Profile
**Steps:**
1. In profile, view order history
2. Click "Download Invoice" for an order

**Expected Result:**
- Invoice PDF is downloaded
- File name includes tracking code

### Test Case 6.4: Profile Information Display
**Steps:**
1. Navigate to Profile Info tab
2. Verify displayed information

**Expected Result:**
- Name field is displayed (read-only)
- Email field is displayed (read-only)
- Member since date is correct
- "Change Password" button is available

### Test Case 6.5: Logout
**Steps:**
1. From profile page, click "Logout"

**Expected Result:**
- User is logged out
- Auth token is removed
- User is redirected to home page
- Profile page is inaccessible without login

---

## Admin Features

### Test Case 7.1: Admin User Management Access
**Steps:**
1. Login with authenticated account
2. Navigate to `/admin/users`

**Expected Result:**
- Admin user management page loads
- Shows list of all registered users
- Each user shows: name, email, join date, order count

### Test Case 7.2: Search Users
**Steps:**
1. In user management page
2. Type user name or email in search box

**Expected Result:**
- User list is filtered in real-time
- Only matching users are displayed

### Test Case 7.3: View User Details
**Steps:**
1. In user management page
2. Click "View" button for a user

**Expected Result:**
- User detail page opens (if implemented)
- Shows user profile and order history

### Test Case 7.4: Delete User
**Steps:**
1. In user management page
2. Click "Delete" button for a user
3. Confirm deletion

**Expected Result:**
- Confirmation dialog appears
- User is deleted from database
- User is removed from list
- Related orders are preserved (not deleted)

### Test Case 7.5: Admin Order Management
**Steps:**
1. Navigate to orders management (if implemented)
2. View all orders
3. Update order status

**Expected Result:**
- All orders are listed
- Orders can be updated
- Changes are saved to database

---

## Banner Management

### Test Case 8.1: Create Banner
**Steps:**
1. Login as admin
2. Navigate to banner management
3. Click "Create Banner"
4. Fill in:
   - Image URL: (valid image URL)
   - Title: "Summer Sale"
   - Description: "50% off all perfumes"
   - Link: "/products"
5. Click "Create"

**Expected Result:**
- Banner is created in database
- Banner is displayed in admin list
- Banner appears on home page carousel (if enabled)

### Test Case 8.2: Edit Banner
**Steps:**
1. In banner management
2. Click "Edit" on a banner
3. Modify title and description
4. Save changes

**Expected Result:**
- Changes are saved to database
- Banner on home page is updated

### Test Case 8.3: Delete Banner
**Steps:**
1. In banner management
2. Click "Delete" on a banner
3. Confirm deletion

**Expected Result:**
- Banner is removed from database
- Banner disappears from carousel

### Test Case 8.4: Banner Carousel Display
**Steps:**
1. Navigate to home page
2. View banner carousel

**Expected Result:**
- All active banners are displayed in carousel
- Navigation arrows work
- Auto-rotation works (if enabled)
- Banners are clickable and link correctly

---

## Edge Cases & Error Handling

### Test Case 9.1: Database Connection Failure
**Steps:**
1. Stop MongoDB service
2. Try to perform any database operation
3. Restart MongoDB

**Expected Result:**
- User-friendly error message
- Application doesn't crash
- Operation fails gracefully
- System recovers when database is back online

### Test Case 9.2: Invalid Token Handling
**Steps:**
1. Manually modify auth token in localStorage
2. Try to access protected routes
3. Try API calls with invalid token

**Expected Result:**
- Invalid token is rejected
- User is redirected to login
- Clear error message is displayed

### Test Case 9.3: Session Timeout
**Steps:**
1. Login to account
2. Wait for token expiration (if time-based)
3. Try to access protected route

**Expected Result:**
- User is required to login again
- Appropriate message is shown

### Test Case 9.4: Concurrent Requests
**Steps:**
1. Add multiple items to cart quickly
2. Submit order while still adding items
3. Modify cart while checkout is processing

**Expected Result:**
- All requests are handled properly
- No data corruption
- Final state is consistent

### Test Case 9.5: Large Order Processing
**Steps:**
1. Add 50+ items to cart with high quantities
2. Process checkout

**Expected Result:**
- System handles large orders
- All items are saved correctly
- Performance is acceptable
- No timeout errors

### Test Case 9.6: Special Characters in Forms
**Steps:**
1. Enter special characters in form fields:
   - Name: "O'Brien's & Co."
   - Address: "123 Main St., Apt #5"
   - Email: "user+tag@example.com"

**Expected Result:**
- Special characters are handled correctly
- No XSS or injection vulnerabilities
- Data is saved and displayed correctly

---

## API Testing

### Test Case 10.1: POST /api/orders
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Test User",
    "customerEmail": "test@example.com",
    "customerPhone": "01700123456",
    "customerAddress": "123 Main St",
    "customerCity": "Dhaka",
    "items": [{"id": "1", "name": "Perfume", "price": 500, "size": "100ml", "quantity": 1}],
    "subtotal": 500,
    "discount": 0,
    "deliveryCharge": 70,
    "total": 570
  }'
```

**Expected Response:**
```json
{
  "message": "Order created successfully",
  "order": { ... },
  "trackingCode": "ABC123"
}
```

### Test Case 10.2: GET /api/orders?trackingCode=ABC123
```bash
curl http://localhost:3000/api/orders?trackingCode=ABC123
```

**Expected Response:**
- Order details matching the tracking code

### Test Case 10.3: GET /api/orders?email=test@example.com
```bash
curl http://localhost:3000/api/orders?email=test@example.com
```

**Expected Response:**
- All orders for the specified email

---

## Performance Testing

### Test Case 11.1: Page Load Time
- Home page: < 2 seconds
- Product list: < 2 seconds
- Product detail: < 1.5 seconds
- Checkout: < 1.5 seconds

### Test Case 11.2: API Response Time
- /api/orders: < 500ms
- /api/products: < 500ms
- /api/banners: < 300ms
- /api/auth/login: < 500ms

### Test Case 11.3: Database Query Performance
- User lookup by email: < 100ms
- Order search by tracking code: < 100ms
- Banner list retrieval: < 100ms

---

## Security Testing

### Test Case 12.1: SQL Injection Prevention
- Attempt SQL injection in search fields
- Verify queries are parameterized
- No database errors should be exposed

### Test Case 12.2: XSS Prevention
- Enter HTML/JavaScript in form fields
- Verify content is escaped in display
- No script execution should occur

### Test Case 12.3: CSRF Protection
- Verify CSRF tokens are implemented
- Test form submissions

### Test Case 12.4: Authentication Security
- Passwords are hashed before storage
- Passwords are never logged or displayed
- Token expiration works correctly

---

## Browser Compatibility Testing

Test the application in:
- Chrome (latest version)
- Firefox (latest version)
- Safari (latest version)
- Edge (latest version)
- Mobile browsers (Chrome/Safari on iOS/Android)

**Verify:**
- Responsive design works on all screen sizes
- All features function correctly
- No console errors
- Images load properly
- Forms are usable on mobile

---

## Test Execution Checklist

- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] All end-to-end tests pass
- [ ] No console errors or warnings
- [ ] No database errors
- [ ] All API endpoints respond correctly
- [ ] Authentication/Authorization working
- [ ] Database backups tested
- [ ] Performance metrics acceptable
- [ ] Security vulnerabilities addressed
- [ ] Cross-browser compatibility verified
- [ ] Mobile responsiveness confirmed
- [ ] All features documented

---

## Reporting Issues

When reporting test failures, include:
1. Test case number and name
2. Steps to reproduce
3. Expected result
4. Actual result
5. Screenshots/videos if applicable
6. Browser and OS information
7. Console errors (if any)
8. Database logs (if relevant)
9. Network requests (if API-related)

---

## Sign-Off

- Test Date: __________
- Tester Name: __________
- Overall Status: ☐ PASS ☐ FAIL
- Critical Issues: __________
- Notes: __________
