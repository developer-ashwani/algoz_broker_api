# Fyers API Implementation

A Node.js application that integrates with Fyers Trading APIs for market data, order management, and portfolio tracking.

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
FYERS_APP_ID=your_app_id
FYERS_SECRET_KEY=your_secret_key
FYERS_REDIRECT_URL=your_redirect_url
FYERS_LOG_DIR="./logs/fyres" (create the folder logs/fyers in root directory)
```

4. Start the server:
```bash
npm start
```

## API Endpoints

### Order Management

#### Place Order
```bash
# Place a single order
POST http://localhost:3000/fyers/api/orders
Content-Type: application/json

{
    "symbol": "NSE:SBIN-EQ",
    "qty": 1,
    "type": 1,
    "side": 1,
    "productType": "INTRADAY",
    "limitPrice": 355,
    "stopPrice": 0,
    "disclosedQty": 0,
    "validity": "DAY",
    "offlineOrder": false,
    "stopLoss": 0,
    "takeProfit": 0,
    "orderTag": "tag1"
}
```

#### Place Multiple Orders
```bash
# Place multiple orders (up to 10)
POST http://localhost:3000/fyers/api/orders/multi
Content-Type: application/json

[
    {
        "symbol": "NSE:SBIN-EQ",
        "qty": 1,
        "type": 2,
        "side": 1,
        "productType": "INTRADAY",
        "limitPrice": 0,
        "stopPrice": 0,
        "disclosedQty": 0,
        "validity": "DAY",
        "offlineOrder": true,
        "stopLoss": 0,
        "takeProfit": 0
    }
]
```

#### Modify Order
```bash
# Modify a single order
PUT http://localhost:3000/fyers/api/orders/modify
Content-Type: application/json

{
    "id": "52104087951",
    "qty": 1,
    "type": 4,
    "side": 1,
    "limitPrice": 355,
    "stopPrice": 366,
    "offlineOrder": false
}
```

#### Modify Multiple Orders
```bash
# Modify multiple orders (up to 10)
PATCH http://localhost:3000/fyers/api/orders/modify/multi
Content-Type: application/json

[
    {
        "id": "121041288802",
        "qty": 1,
        "type": 1,
        "side": 1,
        "limitPrice": 86,
        "stopPrice": 0,
        "offlineOrder": false
    }
]
```

#### Cancel Order
```bash
# Cancel a single order
DELETE http://localhost:3000/fyers/api/orders/cancel
Content-Type: application/json

{
    "id": "52104087951"
}
```

#### Cancel Multiple Orders
```bash
# Cancel multiple orders (up to 10)
DELETE http://localhost:3000/fyers/api/orders/cancel/multi
Content-Type: application/json

[
    {
        "id": "121033179942"
    },
    {
        "id": "121033179943"
    }
]
```

### Portfolio Management

#### Get Positions
```bash
# Get all open positions
GET http://localhost:3000/fyers/api/portfolio/positions
```

#### Convert Position
```bash
# Convert position from intraday to delivery or vice versa
POST http://localhost:3000/fyers/api/portfolio/convert
Content-Type: application/json

{
    "symbol": "NSE:SBIN-EQ",
    "positionSide": 1,
    "convertQty": 1,
    "convertFrom": "INTRADAY",
    "convertTo": "CNC",
    "overnight": true
}
```

#### Delete Position
```bash
# Exit a single position
DELETE http://localhost:3000/fyers/api/portfolio/position
Content-Type: application/json

{
    "id": "NSE:SBIN-EQ"
}

# Exit all positions
DELETE http://localhost:3000/fyers/api/portfolio/position
Content-Type: application/json

{
    "exit_all": 1
}
```

### Historical Data

#### Get Historical Candle Data
```bash
# Get historical candle data
GET http://localhost:3000/fyers/api/historical/candle?symbol=NSE:SBIN-EQ&resolution=D&date_format=0&range_from=1690895316&range_to=1691068173&cont_flag=1
```

## Order Types

1. Limit Order (type: 1)
2. Market Order (type: 2)
3. Stop Order (type: 3)
4. Stoplimit Order (type: 4)

## Product Types

- CNC (For equity only)
- INTRADAY (Applicable for all segments)
- MARGIN (Applicable only for derivatives)
- CO (Cover Order)
- BO (Bracket Order)
- MTF (Approved Symbols Only)

## Order Side

1. Buy (side: 1)
2. Sell (side: -1)

## Validity

- IOC (Immediate or Cancel)
- DAY (Valid till the end of the day)

## Response Formats

### Success Response
```json
{
    "success": true,
    "code": 200,
    "message": "Success message",
    "data": {}, // Optional
    "timestamp": "2024-02-14T12:34:56.789Z"
}
```

### Error Response
```json
{
    "success": false,
    "error": "Error Type",
    "message": "Error message",
    "timestamp": "2024-02-14T12:34:56.789Z"
}
```

## Error Codes

- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 429: Too Many Requests
- 500: Internal Server Error

## Rate Limits

- Market data: 100 requests per minute
- Order placement: 50 requests per minute
- Other endpoints: 30 requests per minute

## Notes

1. All timestamps are in ISO 8601 format
2. Market data is only available during market hours (9:15 AM - 3:30 PM IST)
3. Multi-order endpoints support up to 10 orders per request
4. Position conversion is subject to exchange rules and timing

## License

[Your License] 