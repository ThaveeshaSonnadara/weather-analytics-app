# Weather Analytics App

A full-stack weather analytics application built with Angular on the frontend and NestJS on the backend. The app fetches city weather data from OpenWeatherMap, calculates a comfort score for each city, ranks the cities by comfort, and exposes the results through a protected API secured by Auth0 JWT validation.

## Project Overview

This project includes:

- Angular frontend for user authentication and dashboard visualization
- NestJS backend for weather retrieval and ranking logic
- Auth0-based access protection for API requests
- In-memory cache for reducing repeated API calls and improving response time
- Comfort scoring model to rank cities based on weather conditions

## Tech Stack

- Frontend: Angular + Nx
- Backend: NestJS + Nx
- Authentication: Auth0
- Weather API: OpenWeatherMap
- Caching: in-memory Map with TTL-based expiry

---

## Setup Instructions

### 1. Install dependencies

From the project root:

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the backend project root (`apps/weather-analytics-nest-be/.env`) or `.env.local` depending on your setup.

Example:

```bash
OPENWEATHER_API_KEY=your_openweather_api_key
AUTH0_DOMAIN=dev-deyrn1jbhpjqwz4m.us.auth0.com
AUTH0_AUDIENCE=https://api.weather-analytics.com
AUTH0_ISSUER=https://dev-deyrn1jbhpjqwz4m.us.auth0.com/
CACHE_TTL=300
```

The frontend Auth0 settings are supplied via `apps/weather-analytics-angular-fe/auth_config.json`:

```json
{
  "domain": "dev-deyrn1jbhpjqwz4m.us.auth0.com",
  "clientId": "drOBE3MjFMxFAu2bSQwKSXhFrGGbwwl6",
  "Auth0Audiance": "https://api.weather-analytics.com"
}
```

### 3. Run the backend

```bash
nx run weather-analytics-nest-be:serve
```

The API runs on:

```bash
http://localhost:3000/api
```

### 4. Run the frontend

Open a second terminal and run:

```bash
nx run weather-analytics-angular-fe:serve
```

The app will be available at the Angular dev server URL, typically:

```bash
http://localhost:4200
```

### 5. Authentication flow

The weather API is protected by JWT validation through the NestJS guard. Users must authenticate via Auth0 before they can call the weather endpoint.

---

## Comfort Index Formula

The backend computes a comfort score for each city using a weighted sum of normalized sub-scores. The formula used in the code is:

```text
comfortScore =
  temperatureScore * 0.4 +
  humidityScore * 0.3 +
  windScore * 0.2 +
  cloudinessScore * 0.1
```

Each sub-score is calculated separately and then clamped to the range 0 to 100 before aggregation.

### Individual component formulas

#### 1) Temperature score

```text
temperatureScore = clamp(100 - abs(temperature - 24) * 5)
```

- Ideal temperature target: 24°C
- A value close to 24°C receives a higher score
- The score drops by 5 points for each 1°C away from the ideal

#### 2) Humidity score

```text
humidityScore = clamp(100 - abs(humidity - 50) * 2)
```

- Ideal humidity target: 50%
- High or low humidity away from the midpoint reduces comfort
- Humidity is penalized more gently than temperature because people generally tolerate a wider range of humidity than temperature swings

#### 3) Wind speed score

```text
windScore = clamp(100 - abs(windSpeed - 2.5) * 20)
```

- Ideal wind speed target: 2.5 m/s
- Wind is weighted as a moderate factor since too much wind can feel uncomfortable, but a gentle breeze is often pleasant
- A 1 m/s deviation reduces the score by 20 points

#### 4) Cloudiness score

```text
cloudinessScore = clamp(100 - abs(cloudiness - 30))
```

- Ideal cloudiness target: 30%
- Cloud cover affects the perceived quality of the day
- Moderate cloudiness is considered more comfortable than either fully clear or heavily overcast conditions

### Clamp behavior

```text
clamp(value) = max(0, min(100, value))
```

This keeps the final score in a realistic 0–100 range and prevents unrealistic negative or inflated values.

---

## Why These Weights Were Chosen

The scoring model is intentionally heuristic rather than a full meteorological model. The weights reflect the relative importance of each parameter to human comfort:

- Temperature: 40%
  - Most important because it directly affects how hot or cold a person feels.
- Humidity: 30%
  - Affects perceived temperature and air quality comfort.
- Wind: 20%
  - Important, especially for cooling effect or wind chill, but less dominant than temperature.
- Cloudiness: 10%
  - Influences sunlight and perceived pleasantness, but is less impactful than the first three variables.

This weighting favors the factors most strongly associated with day-to-day comfort while still recognizing that wind and cloud coverage matter.

---

## Trade-offs Considered

Several design decisions were made to balance simplicity, speed, and usability:

1. Simple distance-from-ideal model
   - The formula is easy to explain and interpret.
   - It does not attempt to model every physiological or environmental factor in detail.

2. Linear penalty strategy
   - A straight-line penalty makes the calculation transparent and easy to debug.
   - It does not capture non-linear comfort behavior such as extreme heat being much worse than a moderate temperature deviation.

3. Fixed ideal values for a general audience
   - The model assumes an average comfort preference rather than a city-specific or personal preference profile.
   - This makes the score broadly useful but not perfectly individualized.

4. Normalized 0–100 scoring
   - Makes it easy to rank cities and present results in a UI.
   - It is a practical scoring scale but not a scientifically calibrated thermal comfort index like UTCI or Heat Index.

---

## Cache Design Explanation

The backend uses a simple in-memory cache implemented with a JavaScript `Map` structure.

### Cache service behavior

- Each cache entry stores:
  - the value
  - an expiry timestamp
- TTL is configured using `CACHE_TTL` and defaults to 300 seconds
- When a cached item is requested:
  - if the entry is missing, the system returns `null`
  - if the timestamp has expired, the item is removed and treated as a miss

### Why the cache is used

Two main cache layers are used:

1. Raw weather data cache
   - Key format: `weather:raw:${cityCode}`
   - Prevents repeated requests to the OpenWeatherMap API for the same city within the TTL window

2. Processed analytics cache
   - Key: `weather:analytics`
   - Stores the ranked list of cities after comfort scores are calculated
   - Avoids re-running expensive city-by-city weather fetches and sorting logic on every request

### Benefits

- Reduced API call volume
- Lower latency for repeated requests
- More stable performance under repeated dashboard refreshes

### Trade-off

The cache is stored in process memory, so it is not distributed across multiple backend instances. This is acceptable for a single-node or local deployment but not suitable for multi-instance production scaling without replacing it with Redis or another shared cache.

---

## Known Limitations

This current implementation is intentionally lightweight but has several limitations:

- It is a heuristic comfort score, not a meteorological standard such as UTCI or Heat Index.
- The model uses a single “ideal” value for each metric, which may not match every user or region.
- It does not consider precipitation, UV index, visibility quality beyond raw values, or other weather phenomena that can strongly affect comfort.
- The in-memory cache is local to a single runtime and is lost if the server restarts.
- The weather API requires a valid OpenWeatherMap key and may fail if the API is unavailable or rate-limited.
- The backend expects Auth0 configuration to be properly set up for secure access.

---

## API Behavior Summary

The weather endpoint returns a list of cities sorted by comfort score in descending order, with each item containing:

- city code
- city name
- temperature
- feels-like temperature
- humidity
- wind speed
- cloudiness
- pressure
- visibility
- weather status
- comfort score
- rank

The endpoint is protected by JWT authentication using Auth0.

---

## Run and Validate

To run the app end-to-end:

```bash
nx run weather-analytics-nest-be:serve
nx run weather-analytics-angular-fe:serve
```

Then open the frontend and sign in to retrieve the ranked weather analysis.

---

## Summary

This project combines real weather data, a transparent comfort formula, and a lightweight cache strategy to create a practical city-ranking dashboard. The score is intentionally easy to interpret and tune, which makes it suitable for demos, early product versions, and iterative improvements based on user feedback.
