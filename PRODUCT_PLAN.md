# Expenses App Product Plan

## Purpose

This project is a personal, offline-first expenses and income tracking web app designed for extremely fast data entry, rich reporting, budgeting, and future expansion into cloud sync, mobile, and bank integrations.

The primary product goal is simple:

> Let the user enter the least amount of information possible while still producing rich, accurate financial insights.

This document is the source of truth for what the project is, how it should behave, and how it should be built.

## Product Summary

The app is a polished consumer-style finance app with a hint of premium design. It is initially:

- Single-user
- Web-first
- Offline-first
- Personal-use focused
- PIN-protected
- Powered by React on the frontend
- Backed by Supabase for cloud sync, storage, and future auth
- Enhanced with Google Gemini for OCR, categorization, summaries, and smart suggestions

The product should feel fast, calm, and effortless. It should avoid the complexity and bookkeeping-heavy feel of traditional finance tools.

## Core Product Principles

1. Save first, enrich later.
   A transaction should be saved quickly even if some fields are incomplete. AI and heuristics can enrich it afterward.

2. Optimize for the fastest possible capture flow.
   The primary use case is adding expenses quickly, with minimal manual input.

3. Default to sensible inference.
   The app should infer category, account, merchant, date, currency, and recurring patterns whenever confidence is high enough.

4. Work offline without friction.
   The app must function without internet for normal entry, edits, and review of local data.

5. Keep data structured enough for powerful outputs.
   Even though entry is lightweight, the stored data model must support accurate budgets, multi-currency reporting, account balances, recurring transactions, and analytics.

6. Design for future expansion without forcing early complexity.
   v1 is personal and local-first, but the architecture should support future sync, auth, bank integrations, and mobile apps.

## Target User

Initial user:

- The owner of this repo
- Personal finance use only
- Tracks both expenses and income
- Uses multiple accounts
- Uses multiple currencies
- Wants strong UX over accounting complexity

Potential future expansion:

- Optional cloud account
- Multi-device sync
- Bank integrations
- Mobile apps

## What Problem This App Solves

Most finance apps either:

- make entry too slow,
- require too much structure upfront,
- fail offline,
- do not handle multi-currency cleanly,
- feel too much like spreadsheets or accounting software,
- or make the user do categorization and cleanup manually.

This app should solve those problems by being:

- faster to enter into,
- smarter at inferring fields,
- stronger at summarizing spending,
- better at handling real-world accounts and currencies,
- and easier to use daily.

## Product Goals

### Primary Goals

- Make expense entry extremely fast
- Support both expenses and income
- Support multiple accounts and account types
- Support multiple currencies with a base reporting currency
- Show exactly how much has been spent over time
- Provide monthly and category budgets
- Support receipts and receipt OCR
- Offer AI-powered categorization, summaries, and insights
- Function offline first
- Protect access with a PIN

### Secondary Goals

- Support recurring transactions
- Support CSV import and export
- Provide reminders and alerts
- Prepare for direct bank sync in a later phase
- Prepare for cloud sync and cross-device support

## Non-Goals for Initial Build

These should not block the initial polished version:

- Shared household or team usage
- Multi-user collaboration
- Native mobile apps
- Mandatory login
- Direct bank integrations in the first release
- Complex savings goals system
- Investment portfolio tracking

## Chosen Product Decisions

The following decisions are locked in unless explicitly changed later:

- Platform first: web app
- User scope: single personal user
- Data model: local-first with sync-ready design
- Offline behavior: full local add/edit/view support, sync later
- Security: app PIN with auto-lock timer
- Storage approach: local database first, Supabase for cloud and storage later
- AI provider: Google Gemini
- Base stack: React + Supabase
- Budget model: overall monthly budget plus category monthly budgets
- Currency model: store original currency and base-currency converted value
- Bank sync: architecture-ready, but phase 2 or later
- Receipt flow: both create-from-receipt and attach-receipt-later
- Home screen priority: quick add, monthly overview, budgets, recent transactions, account balances

## User Experience Vision

The app should feel:

- polished,
- premium,
- minimal but not empty,
- quick,
- smart,
- reassuring,
- and easy enough to use every day.

It should not feel:

- corporate,
- spreadsheet-like,
- bookkeeping-heavy,
- cluttered,
- or slow.

### Core UX Promise

The app should make it possible to log a transaction in just a few seconds using any of these flows:

- one-line quick add
- fast form
- receipt upload
- recurring template
- CSV import

### Core UX Strategy

- Put quick add everywhere
- Use suggestions aggressively
- Use recent/frequent chips
- Minimize required fields
- Delay cleanup work unless necessary
- Show high-signal summaries on the home screen
- Make budgets visible but not oppressive

## Main User Flows

### 1. Quick Add Expense

Examples:

- `18 coffee card`
- `90k pho vnd`
- `120 uber`
- `14 lunch today cash`

Expected behavior:

- Parse amount
- Infer merchant if possible
- Infer category from history or heuristics
- Infer account from text or user history
- Default the date to today unless overridden
- Save immediately when confidence is high
- Show lightweight confirmation or correction UI if confidence is low
- Allow undo after save

### 2. Fast Structured Entry

For cases where natural language is not enough:

- Amount
- Type
- Date
- Account
- Category
- Merchant
- Notes
- Receipt attachment

The form should still be compact and optimized for speed.

### 3. Receipt-Based Entry

Flow:

- User uploads or captures receipt
- Gemini extracts merchant, date, amount, currency, and possible line items
- App suggests category and account
- User confirms in a single compact review step
- Receipt is linked to the transaction

### 4. Income Entry

Examples:

- salary
- freelance income
- refunds
- reimbursements

Income should be visible in reports and clearly separated from expenses.

### 5. Transfer Entry

Examples:

- moving money from cash to bank
- paying a credit card from a bank account
- internal wallet/account transfers

Transfers must not count as spending or income.

### 6. Review Spending

The app must allow the user to quickly answer:

- How much have I spent this month?
- What category did it go to?
- What changed compared with last month?
- Which account did it come from?
- Am I over budget?
- What did I spend while traveling?

## Screens and Navigation

### Required Screens

- Lock Screen
- Onboarding
- Home Dashboard
- Quick Add Modal or Sheet
- Full Transaction Form
- Transactions List
- Transaction Detail
- Accounts Overview
- Account Detail
- Budgets Overview
- Budget Detail
- Reports Dashboard
- Receipts Screen
- Recurring Transactions Screen
- Import Screen
- AI Insights Screen
- Settings Screen

### Home Dashboard Priorities

The home screen should show:

- quick add input at the top
- total spent this month
- remaining monthly budget
- category budget warnings
- recent transactions
- account balances summary
- shortcuts for receipt, income, transfer, and recurring entry

## Features

## v1 Must-Have Features

### Transaction Tracking

- expense entry
- income entry
- transfer entry
- transaction editing and deletion
- transaction search and filtering
- recent transactions view
- account-aware transaction history

### Fast Capture

- natural language quick add
- compact manual form
- saved recent/frequent merchants
- category/account suggestions
- one-tap repeat of common transactions
- undo after quick save

### Accounts

- cash accounts
- bank accounts
- credit cards
- manual wallets
- multiple accounts in multiple currencies
- opening balances
- account balance views

### Budgets

- overall monthly budget
- category monthly budgets
- progress bars and alerts
- budget status states: on track, watch, at risk, over

### Reporting

- monthly totals
- custom date ranges
- category breakdowns
- merchant breakdowns
- spending trends
- income vs expense
- cash flow overview
- budget vs actual
- recurring/subscription visibility

### Recurring Transactions

- recurring income
- recurring expenses
- recurring reminders
- edit/skip/pause recurring rules

### Receipts

- receipt upload
- receipt attachment to existing transaction
- OCR extraction
- receipt search
- missing receipt reminders for configured cases

### Multi-Currency

- support for any user-added currency
- original currency storage
- base reporting currency
- exchange rate snapshot per transaction

### Imports and Exports

- CSV import
- CSV export
- PDF report export

### AI Features

- OCR post-processing
- category suggestions
- merchant normalization
- monthly summaries
- unusual spending alerts
- optional natural-language spending Q&A

### Security

- PIN lock
- auto-lock timer

## v1.5 Nice-to-Have Features

- voice entry
- better recurring detection
- richer AI conversational analytics
- more advanced import mapping
- exchange rate refresh automation

## Later Features

- direct bank integrations
- cloud auth
- cross-device sync
- native mobile apps
- push notifications
- biometric unlock on mobile
- shared budgets or household mode

## Data and Domain Model

The system should be designed around these core entities.

### Core Entities

- User
- Profile
- Device
- Account
- Transaction
- Category
- Merchant
- Budget
- Recurring Rule
- Receipt
- Import
- Reminder
- AI Suggestion
- Exchange Rate
- Sync Event

### Transaction Types

Transactions should support:

- expense
- income
- transfer
- credit_card_payment
- adjustment

### Important Transaction Fields

- `id`
- `type`
- `amount_original`
- `currency_original`
- `amount_base`
- `base_currency`
- `exchange_rate`
- `date`
- `merchant_id`
- `description`
- `category_id`
- `source_account_id`
- `destination_account_id`
- `notes`
- `receipt_id`
- `status`
- `created_locally_at`
- `updated_locally_at`
- `synced_at`
- `ai_confidence`

### Important Account Fields

- `id`
- `name`
- `type`
- `currency`
- `institution`
- `opening_balance`
- `current_balance`
- `archived`
- `last_reconciled_at`

### Important Budget Fields

- `id`
- `name`
- `period_type`
- `amount`
- `currency`
- `category_id`
- `start_date`
- `end_date`
- `rollover_enabled`

### Important Receipt Fields

- `id`
- `storage_path`
- `merchant_name_extracted`
- `amount_extracted`
- `currency_extracted`
- `date_extracted`
- `ocr_raw`
- `linked_transaction_id`

## Multi-Currency Rules

The app must always preserve the original transaction data.

For every transaction:

- store original amount
- store original currency
- store base currency amount
- store exchange rate snapshot used

Benefits:

- accurate travel and mixed-currency records
- stable historical reporting
- ability to report in a default base currency such as AUD
- support for user-defined currencies in the future

## Accounts and Financial Logic

### Account Types

Support these account types:

- cash
- bank
- credit_card
- e-wallet
- manual

### Account Behavior Rules

- expenses reduce the source account balance
- income increases the destination account balance
- transfers move value between owned accounts
- credit card spending increases liability correctly
- credit card payment should be treated as a transfer/payment event, not as a second expense

## Budgeting Logic

Recommended default budget system:

- overall monthly budget
- category monthly budgets

Reason:

- easy to understand
- useful for personal finance
- less complex than weekly-only or rollover-first systems
- good for a polished consumer app

### Budget Status Logic

- `on_track`
- `watch`
- `at_risk`
- `over_budget`

The UI should surface overspending clearly but calmly.

## AI and Automation Plan

Google Gemini should be used as an assistive layer, not a blocking dependency.

### Gemini Use Cases

- OCR cleanup and extraction from receipts
- auto-categorization
- merchant normalization
- natural-language parsing fallback
- monthly summaries
- anomaly detection
- budget suggestions
- conversational queries over the user’s financial data

### AI Product Rules

- never block saving a transaction on AI completion
- prefer deterministic local logic first
- use AI when extraction/inference is ambiguous or high value
- allow user corrections
- learn from user corrections for future suggestions

### AI Learning Sources

- merchant history
- category correction history
- account selection history
- recurring transaction patterns
- text patterns from manual quick add

## Offline-First Architecture

The app should be truly local-first in day-to-day use.

### Offline Requirements

- create transactions offline
- edit transactions offline
- view local history offline
- view budgets and reports from local data offline
- queue cloud sync until online

### Local Storage

Recommended:

- IndexedDB via Dexie

Reason:

- works well in web apps
- supports structured local persistence
- suitable for offline-first apps
- can store local sync metadata

### Sync Strategy

- local writes happen first
- sync in background when online
- each record has local timestamps and sync state
- simple conflict resolution for single-user mode
- Supabase becomes source of truth for synced cloud state

## Technical Architecture

## Recommended Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Zustand
- TanStack Query
- React Hook Form
- Zod
- Framer Motion
- Dexie

### Backend / Cloud

- Supabase Postgres
- Supabase Storage
- Supabase Edge Functions

### AI

- Google Gemini API via secure server-side function

### Why This Stack

- React matches the chosen direction
- Supabase supports future auth, storage, sync, and backend simplicity
- Dexie makes offline-first practical in the browser
- Zod and typed forms reduce bugs
- TanStack Query helps with sync/server state
- Framer Motion helps create premium-feeling interactions

## Supabase Role in the Architecture

Supabase should be used for:

- future auth
- cloud backup
- sync target
- receipt file storage
- edge functions for secure AI access
- long-term centralized database

Supabase should not be the only runtime dependency for basic local usage in v1.

## Security Plan

### Initial Security

- app PIN
- auto-lock timeout
- local session lock state

### Later Security

- optional account auth
- encrypted sync-sensitive flows
- biometric unlock on mobile

## Import and Bank Sync Strategy

### v1 Import Strategy

- CSV import wizard
- field mapping
- preview before import
- duplicate detection

### Bank Sync Strategy

Direct bank sync should be architected as a future integration layer, not a v1 blocker.

Reason:

- high complexity
- multiple countries and providers
- additional security and compliance concerns
- likely slower to ship than the value it provides initially

The data model should still support imported and bank-sourced transactions later.

## Reporting and Analytics Requirements

The app must make it easy to answer:

- how much did I spend this month?
- what categories are increasing?
- which merchants take most of my money?
- what are my recurring costs?
- what is my net cash flow?
- which account did spending come from?
- how am I doing against budget?
- what did I spend in a specific country or currency?

### Required Views

- month overview
- category breakdown
- merchant breakdown
- trend lines
- budget comparison
- account summary
- recurring spend report
- income vs expense report

## Notifications and Reminders

v1 reminders should include:

- daily logging reminder
- budget threshold warning
- upcoming recurring payment reminder
- missing receipt reminder
- unusual spending alert

## Design Direction

The design should be:

- polished
- calm
- premium
- mobile-friendly even though web-first
- animation-aware but restrained
- readable at a glance

### Design Priorities

- fast visual scan
- strong hierarchy
- clear charts
- minimal friction
- confidence and trust

### Tone of Product Copy

Copy should be:

- simple
- clear
- non-judgmental
- not overly financial or technical

## Suggested Information Architecture

- `Home`
- `Transactions`
- `Accounts`
- `Budgets`
- `Reports`
- `Receipts`
- `Recurring`
- `Insights`
- `Settings`

## Implementation Phases

### Phase 1: Foundation

- project setup
- design system direction
- local database
- app shell
- routing
- PIN lock
- core state management

### Phase 2: Core Finance Tracking

- transaction model
- quick add
- transaction form
- accounts
- categories
- merchants
- income and transfers

### Phase 3: Review and Budgeting

- dashboard
- budgets
- reports
- account summaries
- filters and search

### Phase 4: Recurring and Receipts

- recurring transaction engine
- reminders
- receipt upload
- OCR flow
- receipt linking

### Phase 5: AI and Imports

- Gemini categorization
- summaries
- anomaly detection
- CSV import/export

### Phase 6: Sync and Cloud

- Supabase schema
- sync engine
- storage integration
- optional auth

### Phase 7: Future Growth

- bank sync
- mobile
- advanced analytics
- cross-device polish

## Recommended Development Order

1. App shell and foundational architecture
2. Local DB and transaction domain
3. Quick add flow
4. Accounts and account balances
5. Transactions list/detail/edit
6. Budgets
7. Reports/dashboard
8. Recurring transactions and reminders
9. Receipt upload and OCR
10. AI suggestions and summaries
11. CSV import/export
12. Supabase sync and storage
13. Future bank sync layer

## Success Criteria

The product is successful if:

- adding a normal expense usually takes only a few seconds
- the user can review monthly spending instantly
- budgets are easy to understand
- multi-currency data is handled correctly
- offline usage feels reliable
- receipts are easy to capture and retrieve
- the app becomes the default personal finance tool for daily use

## Final Product Definition

This project is a personal finance web app that prioritizes speed, simplicity, and intelligence. It should let the user log expenses and income with almost no friction, while still delivering strong reporting, budgeting, receipts, account tracking, reminders, and AI-powered assistance. It starts as a single-user offline-first app and is intentionally designed to grow into a sync-capable, multi-device, premium personal finance product over time.
