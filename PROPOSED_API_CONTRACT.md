# Proposed API Contract for WOOF AI

## 1. Overview
This document defines a proposed API contract for the WOOF AI web application. It is designed to support the app's pages and features while keeping the business entity separate from owner/user identity. The API follows a REST-style structure with clear resource boundaries.

## 2. Domain Model
### 2.1 Business Entities
- `BusinessEntity`
  - `id`: string
  - `name`: string
  - `type`: string (`"retail"`, `"cafe"`, `"services"`, etc.)
  - `location`: object
    - `address`: string
    - `city`: string
    - `country`: string
  - `timezone`: string
  - `settings`: object
    - `dataRetentionDays`: number
    - `autoRetrainEnabled`: boolean
    - `notificationPreferences`: object
      - `alerts`: boolean
      - `suggestions`: boolean
      - `reports`: boolean
      - `system`: boolean

### 2.2 Owner Identity
- `OwnerProfile`
  - `id`: string
  - `businessEntityId`: string
  - `name`: string
  - `email`: string
  - `phone`: string
  - `role`: string (`"owner"`)
  - `status`: string (`"active"`, `"inactive"`)

### 2.3 User Identity
- `UserIdentity`
  - `id`: string
  - `businessEntityId`: string
  - `email`: string
  - `name`: string
  - `role`: string (`"staff"`, `"manager"`, `"analyst"`)
  - `permissions`: string[]
  - `status`: string

### 2.4 Audit and Activity
- `AuditEvent`
  - `id`: string
  - `businessEntityId`: string
  - `actorId`: string | null
  - `actorType`: string (`"user"`, `"system"`, `"ai"`)
  - `targetRecord`: string
  - `actionModule`: string
  - `stateTransition`: string
  - `turnaroundTime`: string
  - `timestamp`: string
  - `status`: string
  - `category`: string

### 2.5 Business Objects
- `PromotionSuggestion`
  - `id`: string
  - `businessEntityId`: string
  - `title`: string
  - `triggerWindow`: string
  - `discount`: string
  - `expectedLift`: string
  - `confidence`: string
  - `reason`: string
  - `status`: string (`"pending"`, `"active"`, `"dismissed"`)
  - `suppressionReason?`: string

- `ForecastRun`
  - `id`: string
  - `businessEntityId`: string
  - `modelType`: string
  - `timeRange`: string
  - `outcomes`: object
  - `createdAt`: string

- `FeedbackRecord`
  - `id`: string
  - `businessEntityId`: string
  - `promotionId`: string
  - `feedbackType`: string (`"helpful"`, `"not-helpful"`)
  - `submittedBy`: string
  - `submittedAt`: string

- `SystemSetting`
  - `businessEntityId`: string
  - `autoRetrainEnabled`: boolean
  - `confidenceThreshold`: number
  - `dataRetentionDays`: number
  - `theme`: string

## 3. Authentication and Identity
### 3.1 Login
- `POST /api/auth/login`
  - Request
    - `email`: string
    - `password`: string
    - `role`: string (`"owner"` | `"staff"`)
  - Response
    - `token`: string
    - `user`: `UserIdentity` | `OwnerProfile`
    - `businessEntity`: `BusinessEntity`

### 3.2 Password Reset
- `POST /api/auth/password-reset`
  - Request
    - `email`: string
    - `role`: string (`"owner"` | `"staff"`)
  - Response
    - `message`: string

### 3.3 Session
- `GET /api/auth/me`
  - Response
    - `user`: `UserIdentity` | `OwnerProfile`
    - `businessEntity`: `BusinessEntity`

## 4. Business and Ownership
### 4.1 Business Entity
- `GET /api/businesses/:businessEntityId`
  - Response: `BusinessEntity`

- `PATCH /api/businesses/:businessEntityId`
  - Request body includes updatable settings and location.
  - Response: updated `BusinessEntity`

### 4.2 Owner Profile
- `GET /api/businesses/:businessEntityId/owners`
  - Response: `OwnerProfile[]`

- `POST /api/businesses/:businessEntityId/owners`
  - Request
    - `name`: string
    - `email`: string
    - `phone`: string
  - Response: created `OwnerProfile`

- `PATCH /api/businesses/:businessEntityId/owners/:ownerId`
  - Request: partial owner data
  - Response: updated `OwnerProfile`

### 4.3 Staff User Management
- `GET /api/businesses/:businessEntityId/users`
  - Response: `UserIdentity[]`

- `POST /api/businesses/:businessEntityId/users`
  - Request
    - `name`: string
    - `email`: string
    - `role`: string
    - `permissions`: string[]
  - Response: created `UserIdentity`

- `PATCH /api/businesses/:businessEntityId/users/:userId`
  - Request: partial user data
  - Response: updated `UserIdentity`

## 5. Dashboard Data Endpoints
### 5.1 Home Dashboard
- `GET /api/businesses/:businessEntityId/dashboard/home`
  - Response includes:
    - `revenue`: number
    - `orders`: number
    - `busiestSector`: string
    - `pendingActions`: number
    - `aiInsights`: string
    - `suggestions`: `PromotionSuggestion[]`

### 5.2 Retail Dashboard
- `GET /api/businesses/:businessEntityId/dashboard/retail`
  - Response includes:
    - `retailRevenue`: number
    - `activeSkus`: number
    - `stockoutAlerts`: number
    - `spoilageRiskCount`: number
    - `inventoryItems`: object[]
    - `channelPerformance`: object[]

### 5.3 Cafe Dashboard
- `GET /api/businesses/:businessEntityId/dashboard/cafe`
  - Response includes:
    - `cafeRevenue`: number
    - `orders`: number
    - `avgCheck`: number
    - `activeMenuItems`: number
    - `modelMetrics`: object
    - `sentimentSummary`: object

### 5.4 Services Dashboard
- `GET /api/businesses/:businessEntityId/dashboard/services`
  - Response includes:
    - `servicesRevenue`: number
    - `activeBookings`: number
    - `utilizationRate`: number
    - `peakAlertTime`: string
    - `bookingForecast`: object[]

## 6. Forecasting and Simulation
### 6.1 Demand Forecasts
- `GET /api/businesses/:businessEntityId/forecast/demand`
  - Response includes:
    - `forecastData`: object[]
    - `occupancyAlerts`: object[]
    - `merchandisingRecommendations`: object[]

### 6.2 AI Simulation
- `POST /api/businesses/:businessEntityId/simulation/run`
  - Request
    - `scenario`: object
    - `controls`: object
  - Response
    - `outcomes`: object
    - `predictedMetrics`: object
    - `recommendedActions`: object[]

## 7. Prescriptive and Feedback APIs
### 7.1 Active Suggestions
- `GET /api/businesses/:businessEntityId/suggestions/active`
  - Response: `PromotionSuggestion[]`

- `POST /api/businesses/:businessEntityId/suggestions/:suggestionId/approve`
  - Response: `PromotionSuggestion`

- `POST /api/businesses/:businessEntityId/suggestions/:suggestionId/dismiss`
  - Request
    - `reason?`: string
  - Response: `PromotionSuggestion`

### 7.2 Suppressed Suggestions
- `GET /api/businesses/:businessEntityId/suggestions/suppressed`
  - Response: `PromotionSuggestion[]`

### 7.3 Feedback Recording
- `POST /api/businesses/:businessEntityId/feedback`
  - Request
    - `promotionId`: string
    - `feedbackType`: string (`"helpful"` | `"not-helpful"`)
    - `submittedBy`: string
  - Response: `FeedbackRecord`

- `GET /api/businesses/:businessEntityId/feedback/summary`
  - Response includes:
    - `totalDeployed`: number
    - `activePromotions`: number
    - `averageAccuracy`: number
    - `feedbackCounts`: object

## 8. Audit and Compliance
### 8.1 Audit Events
- `GET /api/businesses/:businessEntityId/audit-events`
  - Query params
    - `search?`: string
    - `module?`: string
    - `status?`: string
    - `category?`: string
  - Response: `AuditEvent[]`

### 8.2 Audit Filters Summary
- `GET /api/businesses/:businessEntityId/audit-events/summary`
  - Response includes:
    - `pendingApprovals`: number
    - `avgTurnaroundTime`: string
    - `systemBottlenecks`: number
    - `automatedTriggers`: number

## 9. System Settings
### 9.1 Current Settings
- `GET /api/businesses/:businessEntityId/settings`
  - Response: `SystemSetting`

### 9.2 Update Settings
- `PATCH /api/businesses/:businessEntityId/settings`
  - Request includes desired changes
  - Response: updated `SystemSetting`

### 9.3 Export Data
- `POST /api/businesses/:businessEntityId/settings/export`
  - Request
    - `format?`: string (`"zip"`, `"csv"`)
  - Response
    - `downloadUrl`: string

## 10. Chat and Virtual Assistant
### 10.1 Chat Messages
- `GET /api/businesses/:businessEntityId/chat/messages`
  - Response: message list

- `POST /api/businesses/:businessEntityId/chat/messages`
  - Request
    - `message`: string
    - `sender`: string
  - Response: created chat message

## 11. Notes on Ownership Separation
- `BusinessEntity` is the central business record.
- `OwnerProfile` is linked to `BusinessEntity` by `businessEntityId`.
- `UserIdentity` also links to `BusinessEntity` by `businessEntityId`.
- Staff or manager users have separate identity records and permissions, distinct from owner profile.
- Audit events and business actions always include `businessEntityId` so ownership and activity remain traceable.

## 12. Example Contracts by Page
### 12.1 Home
- `GET /api/businesses/:id/dashboard/home`
- `GET /api/businesses/:id/suggestions/active`

### 12.2 Retail
- `GET /api/businesses/:id/dashboard/retail`
- `GET /api/businesses/:id/dashboard/retail/inventory`

### 12.3 Cafe
- `GET /api/businesses/:id/dashboard/cafe`
- `GET /api/businesses/:id/dashboard/cafe/sentiment`

### 12.4 Services
- `GET /api/businesses/:id/dashboard/services`
- `GET /api/businesses/:id/dashboard/services/alerts`

### 12.5 AI Simulation
- `POST /api/businesses/:id/simulation/run`

### 12.6 Feedback
- `GET /api/businesses/:id/feedback/summary`
- `POST /api/businesses/:id/feedback`

### 12.7 Audit
- `GET /api/businesses/:id/audit-events`
- `GET /api/businesses/:id/audit-events/summary`

### 12.8 Settings
- `GET /api/businesses/:id/settings`
- `PATCH /api/businesses/:id/settings`

### 12.9 Login
- `POST /api/auth/login`
- `POST /api/auth/password-reset`

---

This contract supports the app's pages and features while keeping business entity identity separate from owner/user records.
