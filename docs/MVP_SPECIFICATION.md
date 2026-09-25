# Jan Sathi MVP Specification

## 1. Product Goal

Jan Sathi ek limited-area marketplace app hoga jahan users nearby grocery products aur one core local service discover, order, pay, and track kar saken.

### MVP launch scope

- Platform: one cross-platform mobile app for iPhone and Android.
- Launch area: one selected city, district, or service zone.
- Core vertical: grocery ordering plus one local service category.
- Users: customers, vendors/providers, delivery partners, and admins.
- Expansion later: more categories, vendors, cities, delivery partners, and SaaS support workflows.

The first release must prove repeat usage, successful fulfillment, payment completion, and support demand before adding marketplace complexity.

### Existing app preservation

This MVP is a launch and rollout strategy, not a request to delete the existing Jan Sathi features. Existing screens and modules such as SOS, health, schemes, community, jobs, expenses, assistant, payments, and other current utilities should remain available unless a specific product decision says otherwise. The limited-area MVP should be enabled through configuration, feature flags, category availability, and zone rules so the app can later support a larger launch without a rewrite.

## 2. Recommended Technology

### Mobile app

- React Native with Expo for one iOS and Android codebase.
- TypeScript for new modules.
- React Navigation for screen navigation.
- TanStack Query for API cache and request states.
- SecureStore or Keychain/Keystore-backed storage for session tokens.

### Backend

- Existing Node.js and Express API can remain the MVP backend.
- MongoDB is suitable for the current document models.
- Firebase is an alternative when managed authentication, push notifications, and analytics are the priority.
- Supabase is an alternative when PostgreSQL, row-level security, and SQL reporting are the priority.
- Do not run Firebase and Supabase together for the same responsibility in v1.

### Payments

- Razorpay for India: hosted checkout, UPI, cards, net banking, refunds, and webhooks.
- Never mark an order paid from a client callback alone.
- Verify payment signatures on the backend and reconcile webhook events idempotently.

### Notifications and support

- Firebase Cloud Messaging for push notifications.
- MSG91 for OTP only after KYC, balance, sender/channel approval, and production testing.
- Help/SaaS support can start with an in-app ticket system and email notifications.

## 3. User App Screens

### 3.1 Splash

**Purpose:** Load app configuration and restore the session.

**UI/actions:**

- App logo and loading state.
- No destructive action.
- Automatically moves to Login or Home after session check.

**Data:** app version, maintenance status, authenticated session.

### 3.2 Login and Sign Up

**Purpose:** Create and access an account securely.

**Buttons/actions:**

- `Continue with phone`: open MSG91 OTP flow.
- `Continue with email`: email/password login if enabled.
- `Create account`: collect name and phone/email.
- `Resend OTP`: rate-limited resend.
- `Logout`: revoke/expire the current session.

**Data:** name, phone, email, verified status, role, city/zone, created time.

### 3.3 Home

**Purpose:** Show useful nearby actions quickly.

**Buttons/actions:**

- Search: open Search.
- Category tiles: open Categories filtered to the selected category.
- Nearby: use saved location and zone availability.
- Offers: open active offers.
- Orders: open Order Tracking/Order History.
- Help: open Help and Support.

**Data:** categories, featured products/services, active offers, zone, notification count.

### 3.4 Categories

**Purpose:** Organize the limited MVP catalog.

**Buttons/actions:**

- Grocery: open product listing.
- Core service: open service listing.
- Category filter/sort.
- Back to Home.

**Data:** category id, name, icon, enabled status, display order.

### 3.5 Search

**Purpose:** Find products and services.

**Buttons/actions:**

- Search input and clear.
- Filter by category, price, availability, distance, and rating.
- Sort by relevance, price, or distance.
- Result card: open details.

**Data:** query, filters, result ids, pagination metadata.

### 3.6 Product or Service Details

**Purpose:** Let users make an informed purchase or booking.

**Buttons/actions:**

- Image gallery.
- Add to Cart for products.
- Book Now for services.
- Quantity stepper.
- Select service date/time where relevant.
- Save/favorite.
- Contact support, not direct unverified personal contact by default.

**Data:** title, photos, description, price, unit, availability, provider, zone, cancellation policy.

### 3.7 Cart

**Purpose:** Review products before checkout.

**Buttons/actions:**

- Increase/decrease quantity.
- Remove item.
- Apply coupon.
- Continue Shopping.
- Proceed to Checkout.

**Data:** cart owner, items, unit prices captured at checkout, quantities, subtotal, discount, delivery fee, total.

### 3.8 Checkout and Payment

**Purpose:** Confirm fulfillment details and payment.

**Buttons/actions:**

- Select/add address.
- Select delivery or service time.
- Select payment method.
- Pay and Confirm Order.
- Cancel before payment confirmation.

**Data:** immutable order total, address snapshot, fulfillment slot, payment order id, payment status.

### 3.9 Order Tracking

**Purpose:** Show order state and next action.

**Statuses:**

`Pending -> Confirmed -> Processing -> Ready/Assigned -> Out for Delivery -> Delivered`

For cancellations/refunds:

`Cancelled`, `Refund Pending`, `Refunded`, or `Failed`.

**Buttons/actions:**

- View order details.
- Contact Help.
- Cancel when policy allows.
- Request refund when eligible.
- Reorder after delivery.

**Data:** order status history, timestamps, provider/delivery assignment, payment/refund status, customer notifications.

### 3.10 Profile

**Purpose:** Manage account and preferences.

**Buttons/actions:**

- Edit name and contact details.
- Manage saved addresses.
- View order history.
- Manage notification preferences.
- Change password/reset access.
- Logout.

**Data:** user profile, addresses, preferences, device tokens, consent records.

### 3.11 Help and SaaS Support

**Purpose:** Resolve customer issues without manual database work.

**Buttons/actions:**

- FAQs.
- Create support ticket.
- Chat or email support.
- Report missing/damaged item.
- Cancellation/refund request.
- View ticket status and replies.

**Data:** ticket, category, messages, attachments, order reference, assignee, SLA, resolution.

## 4. Backend Modules and Data

### Core collections/tables

- `users`: identity, verified contacts, role, zone, status, timestamps.
- `addresses`: user-owned addresses with latitude/longitude and service zone.
- `categories`: category metadata and availability.
- `products`: vendor, category, title, photos, price, stock, zone, status.
- `services`: provider, category, price/rate, availability, zone, status.
- `carts`: active cart per user and zone.
- `orders`: user, items snapshot, address snapshot, totals, status, zone, timestamps.
- `order_items`: product/service snapshot, quantity, price, provider.
- `payments`: provider order id, payment id, signature, amount, status, refund fields, webhook events.
- `providers`: vendor/service provider profile, verification, zone, payout status.
- `delivery_assignments`: partner, order, status, location events, timestamps.
- `notifications`: user, type, title, body, read status, deep link.
- `support_tickets`: user, order, messages, status, priority, assignee.
- `offers`: coupon/offer rules, limits, validity, zone, status.
- `audit_logs`: admin action, actor, target, before/after summary, timestamp.

### Backend flow

1. Authenticate user and derive `userId` from the verified server session.
2. Check user zone and product/service availability.
3. Create a server-calculated cart/order total.
4. Create a Razorpay order from the backend.
5. Confirm payment using signature verification and webhook reconciliation.
6. Move order to `Confirmed` only after verified payment or explicitly allowed cash-on-delivery status.
7. Notify vendor/provider and customer.
8. Update fulfillment statuses through authorized admin/provider/delivery actions.
9. Record every payment, refund, and admin mutation in an audit log.

## 5. Admin Panel

### Dashboard

- Orders today, revenue, failed payments, pending support tickets, active users, delivery SLA.
- Filter by zone, date, category, and status.

### Users

- Search and view profile.
- Verify, suspend, or reactivate user.
- View orders and support history.
- Never display passwords, OTPs, or full payment secrets.

### Products and Services

- Create/edit/archive listing.
- Manage photos, prices, stock, availability, zone, provider, and cancellation policy.
- Bulk enable/disable by zone.

### Providers and Delivery Partners

- Approve/reject onboarding.
- Assign zone and category.
- Set active/inactive status.
- View fulfillment performance.

### Orders

- Search by order id, phone, or status.
- View item, address, payment, and timeline.
- Confirm, process, assign, dispatch, deliver, cancel, or escalate.
- All status changes require an audit entry.

### Payments

- View payment status and provider ids.
- Reconcile webhook failures.
- Start eligible refunds.
- Never edit payment success manually without an audit reason.

### Support, Offers, and Reports

- Assign tickets and respond.
- Configure FAQs, coupons, and limited-area offers.
- Export operational reports without exposing secrets.

## 6. Security Requirements

- Use short-lived access tokens and refresh-token rotation, or a secure managed auth session.
- Store tokens in platform secure storage, not plain localStorage in a mobile production build.
- Protect admin and provider routes with role-based middleware.
- Derive ownership from the authenticated session, never from a client-supplied `userId`.
- Validate all request bodies, quantities, prices, status transitions, and zone access on the backend.
- Rate-limit OTP, login, payment, refund, and support endpoints.
- Do not log OTPs, AuthKeys, payment secrets, or full personal data.
- Keep MSG91 AuthKey and Razorpay secret only in backend environment variables.
- Use HTTPS in production and restrict CORS to known app/web origins.
- Add idempotency keys for order creation, payment confirmation, and webhooks.
- Maintain audit logs for admin, payment, refund, and user-status actions.
- Define data retention and deletion rules for personal data and support attachments.

## 7. MVP Acceptance Criteria

- A user in the launch zone can sign up/login, browse the core category, add an item/service, checkout, pay, and see order status.
- A provider/admin can confirm and update the order through the panel.
- A failed payment does not create a paid order.
- A duplicate payment webhook does not duplicate the order or payment record.
- A user cannot access another user's order, address, ticket, or payment.
- A support ticket can be created and resolved without database access.
- Admin actions are permission-checked and auditable.
- App works on both iPhone and Android from the same mobile codebase.

## 8. Delivery Plan

### Phase 1: Foundation

Keep the existing app modules intact while hardening authentication/session recovery. Add one launch zone, grocery catalog, product detail, cart, address, Razorpay test payments, order model, and basic admin order view.

### Phase 2: Fulfillment

Provider/admin status workflow, delivery assignment, push notifications, cancellation/refund handling, and support tickets.

### Phase 3: Validation

Launch with a small invited user group, measure activation, completed checkout, repeat orders, delivery time, payment failures, cancellations, and support volume.

### Phase 4: Expansion

Add the next service category, more zones, vendors, delivery partners, offers, analytics, and richer SaaS support only after the MVP metrics justify it.
