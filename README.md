# LoamLabs Component API

Secure, high-performance component database API serving the spoke calculator and public component library.

## Overview

This serverless API provides a centralized data source for bicycle wheel components (rims, hubs, spokes, nipples) to multiple consumer applications. By decoupling the component database from Shopify's live API, it ensures instant load times, protects proprietary engineering data, and enables advanced functionality like deep-linking and SEO optimization.

## Key Features

- **Decoupled Architecture**: Component data stored in optimized JSON files, not fetched from Shopify in real-time
- **Domain-Restricted Access**: Referer validation ensures API only serves authorized domains
- **Sub-Second Response Times**: Static JSON serving enables near-instant calculator load times
- **Single Source of Truth**: Powers both customer-facing spoke calculator and public component library
- **Deep-Link Support**: Enables URL-based component pre-selection for seamless user journeys
- **SEO Optimization**: Fuels searchable component library for organic traffic capture

## Technical Architecture

### Core Technologies
- **Runtime**: Node.js (Vercel Serverless Functions)
- **Data Format**: JSON (static files)
- **Security**: Referer header validation
- **Source**: Google Sheets (manual updates, exported to JSON)

### Data Structure

**Component Files**:
- `rims.json` - Rim specifications (ERD, weight, dimensions, compatibility)
- `hubs.json` - Hub specifications (PCD, flange dimensions, axle standards)
- `spokes.json` - Spoke specifications (weight, material, compatibility)
- `nipples.json` - Nipple specifications (weight, compatibility)

**Schema Example (Rim)**:
```json
{
  "Vendor": "Reserve",
  "Title": "Reserve 30 SL",
  "Wheel Size": "29",
  "ERD": "599",
  "Inner Width": "30",
  "Weight": "380",
  "Spoke Count": "28h,32h",
  "Brake Interface": "Centerlock,6Bolt"
}
```

### API Endpoints

```
GET /api/components        # Returns combined dataset (all component types)
GET /api/rims             # Returns rims only
GET /api/hubs             # Returns hubs only
GET /api/spokes           # Returns spokes only
GET /api/nipples          # Returns nipples only
```

### Security Layer

**Referer Validation**:
```javascript
const allowedReferers = [
  'https://loamlabsusa.com',
  'https://www.loamlabsusa.com'
];

const referer = request.headers.get('referer');
if (!referer || !allowedReferers.some(allowed => referer.startsWith(allowed))) {
  return new Response('Forbidden', { status: 403 });
}
```

Only requests originating from authorized domains receive data. Prevents:
- Unauthorized scraping of proprietary component data
- Competitor access to engineering specifications
- API abuse and bandwidth theft

## Consumer Applications

### 1. Customer-Facing Spoke Calculator
**URL**: `https://loamlabsusa.com/pages/spoke-calculator`

**Integration**:
- Fetches component data on page load
- Populates searchable vendor/model dropdowns
- Uses component specs (ERD, PCD, flange dimensions) for geometric calculations
- Supports URL hash-based component pre-selection via LZString compression

**Benefits**:
- Instant load times (no live Shopify API calls)
- Offline-first capability (data cached in browser)
- Enables save/share functionality via URL state

### 2. Public Component Library
**URL**: `https://loamlabsusa.com/pages/wheel-component-library`

**Integration**:
- Fetches full component dataset
- Renders searchable, filterable library organized by vendor
- Displays detailed specifications in expandable accordions
- Generates "Use in Calculator" deep-links for each component

**Benefits**:
- SEO asset capturing organic search traffic (e.g., "DT Swiss 350 ERD")
- Establishes brand authority in wheel building community
- Seamless funnel from information discovery to calculator usage

## Data Management Workflow

1. **Source of Truth**: Component specifications maintained in Google Sheet
2. **Export**: Sheet data exported to individual JSON files (rims.json, hubs.json, etc.)
3. **Deployment**: JSON files committed to this GitHub repo
4. **Automatic Updates**: Vercel auto-deploys on push, making new data live instantly
5. **Consumer Update**: Spoke calculator and component library fetch fresh data on next page load

## CORS Configuration

API configured to allow cross-origin requests from authorized domains:
```javascript
headers: {
  'Access-Control-Allow-Origin': 'https://loamlabsusa.com',
  'Access-Control-Allow-Methods': 'GET',
  'Content-Type': 'application/json'
}
```

## Performance Characteristics

- **Response Time**: < 100ms (static file serving)
- **Data Size**: ~50-200KB per component type (minimal bandwidth)
- **Cache-First**: Browsers can cache responses for fast repeat loads
- **No Rate Limits**: Static data serving scales infinitely on Vercel

## Future Enhancements

- **Versioning**: Add `/api/v2/components` for breaking schema changes
- **Filtering**: Add query parameters for server-side filtering (e.g., `?vendor=Reserve&wheelSize=29`)
- **GraphQL Layer**: Consider GraphQL endpoint for advanced querying needs
- **Real-Time Sync**: Webhook integration to auto-update JSON files when Shopify products change
- **Authentication**: Add API key authentication for premium integrations

## Data Privacy

No customer data, order history, or sensitive business information is exposed via this API. Only public product specifications are served.

## License

MIT License - See LICENSE file for details

---

**Built to power high-performance, data-driven tools for the LoamLabs wheel building ecosystem.**
