# GTM/UTM Testing Guide

## Setup

### Development Environment

GTM is now enabled in development mode. To enable/disable it, set the following in `.env.development`:

```env
GATSBY_ENABLE_GTM_DEV=true  # Set to "true" to enable, "false" to disable
```

**Important:** After changing this value, restart your development server.

### Production/Staging Environment

GTM is **automatically enabled** in production/staging environments as long as `GATSBY_GOOGLE_TAG_MANAGER` environment variable is set.

**Note:** Helper functions (`window.testGTMWithCampaignCode`, etc.) are only available in development mode. For production testing, use URL parameters directly.

## Testing GTM

### 1. Check GTM Status

Open browser console and run:

```javascript
// Check if GTM is loaded
window.checkGTMStatus();
```

This will show:

- Whether GTM container is loaded
- Whether dataLayer exists
- Current dataLayer length
- GTM Container ID

### 2. Test UTM Parameters

#### Method 1: Using URL Parameters

Visit your site with UTM parameters in the URL:

**Test with UTM parameters only:**

```
http://localhost:8000/?utm_source=test_source&utm_medium=test_medium&utm_campaign=test_campaign
```

**Test with campaign_code only:**

```
http://localhost:8000/?campaign_code=test123
```

**Test with combination of campaign_code + UTM parameters:**

```
http://localhost:8000/?campaign_code=test123&utm_source=test_source&utm_medium=test_medium&utm_campaign=test_campaign
```

**Test with combination in path with language:**

```
http://localhost:8000/zh/?campaign_code=test123&utm_source=test_source&utm_medium=test_medium&utm_campaign=test_campaign
```

The parameters will be:

1. Saved to localStorage
2. Pushed to GTM dataLayer
3. Removed from URL (for clean URLs)

#### Method 2: Using Browser Console

Open browser console and run:

**Test with combination of campaign_code + UTM:**

```javascript
// Test with combination of campaign_code and UTM parameters
window.testGTMWithCampaignCode({
  campaign_code: "test_campaign_123",
  utm_source: "google",
  utm_medium: "cpc",
  utm_campaign: "summer_sale",
});

// Check the result
window.getDataLayer();
```

**Test with campaign_code only:**

```javascript
window.testGTMWithCampaignCode({
  campaign_code: "IB08801328J",
});
```

**Test with UTM only:**

```javascript
window.testGTMWithCampaignCode({
  utm_source: "facebook",
  utm_medium: "social",
  utm_campaign: "promo_2024",
});
```

**Simulate URL visit with parameters:**

```javascript
// Simulate visit with combination of parameters
window.simulateURLWithParams({
  campaign_code: "test123",
  utm_source: "test_source",
  utm_medium: "test_medium",
  utm_campaign: "test_campaign",
  pathname: "/zh/", // Optional: specify pathname
});
```

**Check dataLayer:**

```javascript
window.getDataLayer();

// Check GTM status
window.checkGTMStatus();
```

### 3. Verify in GTM Preview Mode

1. Open [Google Tag Manager](https://tagmanager.google.com/)
2. Select your container (GTM-TFM34GFQ)
3. Click "Preview" button
4. Enter your localhost URL: `http://localhost:8000`
5. You should see:
   - Container loaded
   - Page view events
   - UTM parameters in dataLayer
   - Route change events (when navigating)

### 4. Check dataLayer in Browser

Open browser console and run:

```javascript
// View current dataLayer
console.log(window.dataLayer);

// Filter for UTM parameters
window.dataLayer.filter(
  (item) => item.utm_source || item.utm_campaign || item.campaign_code
);
```

### 5. Test Events

You can manually push events to test GTM triggers:

```javascript
// Push a test event
window.dataLayer.push({
  event: "test_event",
  eventCategory: "test",
  eventAction: "click",
  eventLabel: "test_button",
});

// Check if event was pushed
console.log(window.dataLayer);
```

## Available Helper Functions

The following functions are available in `src/helpers/services/gtm-service.js` and exposed to `window` in development:

- `pushUTMParamsToDataLayer()` - Automatically pushes UTM params from localStorage to dataLayer
- `testGTMDataLayer(testData)` - Manually push test data to dataLayer
- `getDataLayer()` - Get current dataLayer contents
- `checkGTMStatus()` - Check if GTM is loaded and ready
- `testGTMWithCampaignCode(params)` - **Test with combination of campaign_code + UTM parameters**
- `simulateURLWithParams(params)` - Simulate URL visit with parameters

## Testing Scenarios

### Scenario 1: Campaign Code Only

```javascript
// URL: http://localhost:8000/?campaign_code=IB08801328J
// Expected:
// - campaign_code saved to localStorage
// - campaign_code pushed to dataLayer
// - URL cleaned (campaign_code removed)
// - r_code removed from localStorage if exists
```

### Scenario 2: UTM Parameters Only

```javascript
// URL: http://localhost:8000/?utm_source=google&utm_medium=cpc&utm_campaign=summer
// Expected:
// - UTM parameters saved to localStorage
// - UTM parameters pushed to dataLayer
// - URL cleaned (UTM parameters removed)
```

### Scenario 3: Campaign Code + UTM Parameters (Combined)

```javascript
// URL: http://localhost:8000/?campaign_code=test123&utm_source=google&utm_medium=cpc&utm_campaign=summer
// Expected:
// - campaign_code saved to localStorage
// - UTM parameters saved to localStorage
// - All parameters pushed to dataLayer together
// - URL cleaned (all parameters removed)
// - r_code removed from localStorage if exists
```

### Scenario 4: Test with Browser Console

```javascript
// Test combination
window.testGTMWithCampaignCode({
  campaign_code: "IB08801328J",
  utm_source: "facebook",
  utm_medium: "social",
  utm_campaign: "winter_promo",
});

// Verify in dataLayer
window.dataLayer.filter(
  (item) => item.campaign_code || item.utm_source || item.utm_campaign
);

// Verify in localStorage
console.log({
  campaign_code: localStorage.getItem("campaign_code"),
  utm_source: localStorage.getItem("utm_source"),
  utm_medium: localStorage.getItem("utm_medium"),
  utm_campaign: localStorage.getItem("utm_campaign"),
});
```

## Common Issues

### GTM Not Loading

1. Check `.env.development` has `GATSBY_ENABLE_GTM_DEV=true`
2. Restart development server
3. Check browser console for errors
4. Verify GTM Container ID is correct: `GTM-TFM34GFQ`

### UTM Parameters Not Appearing

1. Check localStorage: `localStorage.getItem('utm_source')`
2. Check dataLayer: `window.dataLayer`
3. Verify parameters are being pushed: Look for console log "UTM parameters pushed to dataLayer"
4. Check URL was cleaned (parameters should be removed from URL after saving)

### dataLayer Not Updating

1. Ensure `pushUTMParamsToDataLayer()` is called (it's called in Layout component)
2. Check browser console for errors
3. Verify GTM is loaded: `window.checkGTMStatus()`

## Testing GTM in Production/Staging

### Testing in Production/Staging Environment

#### Method 1: Test with URL Parameters

Open browser and visit URL with parameters:

**Test with combination of campaign_code + UTM:**

```
https://your-production-url.com/?campaign_code=test123&utm_source=test_source&utm_medium=test_medium&utm_campaign=test_campaign
```

**Test with campaign_code only:**

```
https://your-production-url.com/?campaign_code=IB08801328J
```

**Test with UTM parameters only:**

```
https://your-production-url.com/?utm_source=google&utm_medium=cpc&utm_campaign=summer_sale
```

**Test with combination in path with language:**

```
https://your-production-url.com/zh/?campaign_code=test123&utm_source=test_source&utm_medium=test_medium&utm_campaign=test_campaign
```

#### Method 2: Verify in Browser Console

After opening URL with parameters, open browser console (F12) and run:

```javascript
// Check GTM Status
console.log("GTM Status:", {
  gtmLoaded: typeof window.google_tag_manager !== "undefined",
  dataLayerExists: typeof window.dataLayer !== "undefined",
  dataLayerLength: window.dataLayer?.length || 0,
});

// Check localStorage
console.log("LocalStorage:", {
  campaign_code: localStorage.getItem("campaign_code"),
  utm_source: localStorage.getItem("utm_source"),
  utm_medium: localStorage.getItem("utm_medium"),
  utm_campaign: localStorage.getItem("utm_campaign"),
});

// Check dataLayer for UTM/Campaign parameters
const paramsInDataLayer = window.dataLayer.filter(
  (item) =>
    item.campaign_code ||
    item.utm_source ||
    item.utm_medium ||
    item.utm_campaign
);
console.log("Parameters in dataLayer:", paramsInDataLayer);

// Check current URL (should be cleaned)
console.log("Current URL:", window.location.href);
```

#### Method 3: Test with GTM Preview Mode

1. Open [Google Tag Manager](https://tagmanager.google.com/)
2. Select container **GTM-TFM34GFQ**
3. Click **"Preview"** button
4. Enter production URL with parameters:
   ```
   https://your-production-url.com/?campaign_code=test123&utm_source=test_source&utm_medium=test_medium&utm_campaign=test_campaign
   ```
5. Click **"Connect"**
6. In GTM Preview panel, you will see:
   - Container loaded
   - Page view events
   - UTM parameters in dataLayer
   - Campaign code in dataLayer
   - Route change events (when navigating)

#### Method 4: Manual Push to dataLayer (Production)

If helper functions are not available in production, you can manually push:

```javascript
// Manually push parameters to dataLayer
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  campaign_code: "test123",
  utm_source: "test_source",
  utm_medium: "test_medium",
  utm_campaign: "test_campaign",
});

// Verify
console.log("dataLayer:", window.dataLayer);
```

#### Method 5: Check Network Requests

1. Open Chrome DevTools → **Network** tab
2. Filter with **"gtm"** or **"collect"**
3. Visit URL with parameters
4. You will see requests to:
   - `https://www.googletagmanager.com/gtm.js?id=GTM-TFM34GFQ`
   - `https://www.google-analytics.com/collect` (if GA configured in GTM)

### Expected Behavior in Production

1. ✅ **Parameters saved to localStorage** - Check in Application → Local Storage
2. ✅ **Parameters pushed to dataLayer** - Check in Console: `window.dataLayer`
3. ✅ **URL cleaned** - Parameters removed from URL after saving
4. ✅ **GTM container loaded** - Check in Network tab or Console
5. ✅ **Events sent to GTM** - Verify in GTM Preview Mode or Network tab

### Troubleshooting Production Testing

**GTM not loading:**

- Check Network tab for errors
- Verify `GATSBY_GOOGLE_TAG_MANAGER` environment variable in production environment
- Check browser console for error messages

**Parameters not appearing in dataLayer:**

- Check localStorage if parameters are saved
- Refresh page after adding parameters to URL
- Check console for log "UTM parameters pushed to dataLayer"

**URL not cleaned:**

- Check console for log "Cleaning URL"
- Verify function `getCampaignParamsAndSetToStorage` is called
- Check if there are any errors in console

## Testing Checklist

### Development

- [ ] GTM container loads in development
- [ ] UTM parameters from URL are saved to localStorage
- [ ] UTM parameters are pushed to dataLayer
- [ ] URL is cleaned (parameters removed after saving)
- [ ] Route changes trigger events
- [ ] GTM Preview mode shows events correctly
- [ ] Campaign code works correctly
- [ ] Multiple UTM parameters work together

### Production/Staging

- [ ] GTM container loads in production URL
- [ ] UTM parameters from URL are saved to localStorage
- [ ] UTM parameters are pushed to dataLayer
- [ ] URL is cleaned after parameters are saved
- [ ] GTM Preview mode works with production URL
- [ ] Campaign code + UTM combination works correctly
- [ ] Network requests to GTM are sent correctly
