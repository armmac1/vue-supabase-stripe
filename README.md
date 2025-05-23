# Vue Supabase Stripe Integration

## Project Overview

Minimal Vue application that integrates with Supabase and Stripe. It allows users to sign up, log in, buy a subscription, and access members-only areas. Uses Stripe's Checkout & Products, uses Supabase edge function to create checkout session and handle subscription webhook events. Due to it being bare bones, it can be used as a starting point for subscription based applications.

## Project Setup

### Stripe

- Create a new project in Stripe
- Create a new subscription product
- Set prices for the product 

:warning: **Warning:** Edit prices and make sure you add `Lookup Key`. It can be found in Price Settings. Once lookup keys are set, update `src/utils/constants.ts` with the lookup keys and other details.

- Setup webhook:
  - Add Endpoint URL, use Supabase Stripe Webhook edge function's URL
  - Select events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
  - Copy `Signing secret` and add it to Supabase project secrets as `STRIPE_WEBHOOK_SECRET`


### Environment Variables

Add the following environment variables to your frontend project:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_STRIPE_PUBLISHABLE_KEY`

### Supabase

Create a new project in Supabase and add the following:

#### Secrets

Add the following secrets to your Supabase project:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

#### Profiles Table

Create a _profiles_ table:
```sql
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  stripe_customer_id text unique,
  full_name text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

Create a policy to allow server-only full access to _profiles_ table:
```sql
create policy "Server-only full access to profiles"
on profiles
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');
```

#### Subscriptions Table

Create a _subscriptions_ table:
```sql
create table subscriptions (
  id uuid primary key default uuid_generate_v4(),

  user_id uuid not null references profiles(id) on delete cascade,
  stripe_subscription_id text unique not null,
  plan text,
  status text,

  created_at timestamp with time zone default now(),
  expires_at timestamp with time zone
);
```

Grant read-only access to authorized users:
```sql
alter table subscriptions enable row level security;

create policy "Users can read their own subscriptions"
on subscriptions
for select
using (auth.uid() = user_id);
```

Create a policy to allow server-only full access to _subscriptions_ table:
```sql
create policy "Server-only full access to subscriptions"
on subscriptions
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');
```

#### Edge Functions

:warning: **Warning:** Disable JWT verification on stripe-webhooks edge function. Webhook uses Stripe's signature verification.

Create edge functions in Supabase using:

- _src/supabase-edge-functions/checkout-session-creation.ts_
- _src/supabase-edge-functions/stripe-webhooks.ts_

## Development

```bash
npm run dev
```

## Screenshots

Pricing cards
![image](https://github.com/user-attachments/assets/90b571ad-d2e4-48a7-a65e-0a0485242d98)

Members area
![image](https://github.com/user-attachments/assets/c6899c9c-acb3-4c48-a1bf-8514d4edecb6)

Stripe's Checkout
![image](https://github.com/user-attachments/assets/7781704f-a147-400f-b95f-8a5f07844669)

Stripe's Products
![image](https://github.com/user-attachments/assets/6cebf78e-6266-42bf-abed-d33c0dd77c52)

Stripe's Customers
![image](https://github.com/user-attachments/assets/018aa93a-3f2f-49c6-a08d-fbb613f953fa)

Stripe's Subscriptions
![image](https://github.com/user-attachments/assets/14cdaa2e-93b0-4080-abe1-f51807d62c1e)=


## Project Setup
- [x] Initialize Vue project with Vite
- [x] Install required dependencies:
  - [x] @supabase/supabase-js
  - [x] @stripe/stripe-js

## Environment Setup
- [x] Create `.env` file with following variables:
  - [x] VITE_SUPABASE_URL
  - [x] VITE_SUPABASE_ANON_KEY
  - [x] VITE_STRIPE_PUBLISHABLE_KEY

## Supabase Authentication
- [x] Create authentication components:
  - [x] LoginForm.vue
  - [x] SignUpForm.vue
  - [x] LogoutButton.vue
- [x] Implement Supabase client setup
- [x] Add authentication state management
- [x] Create protected routes
- [x] Implement session handling

## Stripe Integration
- [x] Set up Stripe client
- [x] Create pricing cards component
- [x] Implement subscription button
- [x] Set up Stripe Checkout:
  - [x] Create Stripe products in development
  - [x] Configure success/cancel URLs
  - [x] Implement checkout session creation
  - [x] Handle checkout completion

## Supabase Edge Function
- [x] Create edge function for Stripe webhook
- [x] Set up webhook endpoint
- [x] Implement webhook signature verification
- [x] Handle Stripe events:
  - [x] checkout.session.completed
  - [x] customer.subscription.updated
  - [x] customer.subscription.deleted
