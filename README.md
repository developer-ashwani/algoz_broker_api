# Upstox Trading API Integration

A Node.js application that integrates with Upstox Trading APIs for market data, order management, portfolio tracking, and options trading.

## Setup

### Prerequisites
- Node.js (v14 or higher)
- npm (Node Package Manager)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd <project-directory>
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
UPSTOX_SANDBOX_TOKEN=your_sandbox_token_here
UPSTOX_LIVE_TOKEN=your_live_token_here
PORT=3000
```

4. Start the server:
```bash
npm start
```

## API Endpoints

### Order Management

#### Place Orders
```bash
# Place a new order
POST http://localhost:3000/upstox/api/live/orders/place
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN

{
    "quantity": 1,
    "product": "D",
    "validity": "DAY",
    "price": 100.50,
    "instrument_token": "NSE_EQ|INE528G01035",
    "order_type": "LIMIT",
    "transaction_type": "BUY"
}
```

#### Get Orders
```bash
# Get order status by ID
GET http://localhost:3000/upstox/api/live/orders/get/status/{orderId}

# Get order book
GET http://localhost:3000/upstox/api/live/orders/get/book

# Get order history
GET http://localhost:3000/upstox/api/live/orders/get/orderHistory/{orderId}
```

#### Modify Orders
```bash
# Modify an existing order
PUT http://localhost:3000/upstox/api/live/orders/modify
Content-Type: application/json
{
    "orderId": "240111010331447",
    "quantity": 2,
    "orderType": "LIMIT",
    "price": 101.00
}
```

#### Cancel Orders
```bash
# Cancel an order
DELETE http://localhost:3000/upstox/api/live/orders/cancel/{orderId}
```

### Option Chain

#### Get Option Contracts
```bash
# Get option contracts without expiry date
GET http://localhost:3000/upstox/api/live/option-chain/contracts/{instrumentKey}

# Get option contracts with expiry date
GET http://localhost:3000/upstox/api/live/option-chain/contracts/{instrumentKey}/{expiryDate}

# Example:
GET http://localhost:3000/upstox/api/live/option-chain/contracts/NSE_INDEX|Nifty%2050/2024-10-31
```

#### Get Option Chain
```bash
# Get put/call option chain
GET http://localhost:3000/upstox/api/live/option-chain/chain/{instrumentKey}/{expiryDate}

# Example:
GET http://localhost:3000/upstox/api/live/option-chain/chain/NSE_INDEX|Nifty%2050/2024-10-31
```

### Market Data

#### Historical Data
```bash
# Get historical candle data
GET http://localhost:3000/upstox/api/live/historical/1minute?instrumentKey={key}&fromDate={date}&toDate={date}
GET http://localhost:3000/upstox/api/live/historical/30minute
GET http://localhost:3000/upstox/api/live/historical/day
GET http://localhost:3000/upstox/api/live/historical/week
GET http://localhost:3000/upstox/api/live/historical/month
```

#### Intraday Data
```bash
# Get intraday candle data
GET http://localhost:3000/upstox/api/live/intraday/1minute?instrumentKey={key}
GET http://localhost:3000/upstox/api/live/intraday/30minute?instrumentKey={key}
```

### WebSocket Endpoints

```bash
# Get WebSocket URL
GET http://localhost:3000/upstox/api/live/websocket/url

# Connect to WebSocket
POST http://localhost:3000/upstox/api/live/websocket/connect

# Subscribe to market data
POST http://localhost:3000/upstox/api/live/websocket/subscribe
Content-Type: application/json
{
    "instruments": ["NSE_EQ|INE020B01018"],
    "mode": "full"
}

# Unsubscribe from market data
POST http://localhost:3000/upstox/api/live/websocket/unsubscribe
Content-Type: application/json
{
    "instruments": ["NSE_EQ|INE020B01018"]
}

# Disconnect WebSocket
POST http://localhost:3000/upstox/api/live/websocket/disconnect
```

### Profile and Portfolio

#### Profile
```bash
# Get user profile
GET http://localhost:3000/upstox/api/live/profile
```

#### Portfolio
```bash
# Get holdings
GET http://localhost:3000/upstox/api/live/portfolio

# Get positions
GET http://localhost:3000/upstox/api/live/portfolio/positions

# Get trade history
GET http://localhost:3000/upstox/api/live/portfolio/trades
```

## Authentication

All API endpoints require authentication using a Bearer token:
```bash
Authorization: Bearer YOUR_ACCESS_TOKEN
```

## Response Formats

### Success Response
```json
{
    "status": "success",
    "message": "Operation completed successfully",
    "data": { ... }
}
```

### Error Response
```json
{
    "error": "Error type",
    "message": "Detailed error message",
    "timestamp": "2024-01-18T10:30:00.000Z"
}
```

## Rate Limits

- Market data: 100 requests per minute
- Order placement: 50 requests per minute
- Other endpoints: 30 requests per minute

## Notes

1. All timestamps are in ISO 8601 format
2. Market data is only available during market hours (9:15 AM - 3:30 PM IST)
3. WebSocket connection requires re-subscription after disconnection
4. Option chain data is subject to market timing and exchange rules

## Error Codes

- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 429: Too Many Requests
- 500: Internal Server Error

## License

[Your License] 