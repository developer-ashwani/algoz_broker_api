# Upstox Trading API Integration

A Node.js application that integrates with Upstox Trading APIs to place various types of orders in both sandbox and live environments.

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

### Sandbox Environment

All sandbox endpoints are prefixed with `/api/sandbox/orders`

#### 1. Delivery Market Order
```bash
curl -X POST http://localhost:3000/api/sandbox/orders/deliveryMarketOrder \
-H "Content-Type: application/json" \
-H "Authorization: Bearer your_sandbox_token" \
-d '{
    "quantity": 1,
    "product": "D",
    "validity": "DAY",
    "instrument_token": "NSE_EQ|INE528G01035",
    "order_type": "MARKET",
    "transaction_type": "BUY",
    "disclosed_quantity": 0,
    "trigger_price": 0,
    "is_amo": false
}'
```

#### 2. Delivery Limit Order
```bash
curl -X POST http://localhost:3000/api/sandbox/orders/deliveryLimitOrder \
-H "Content-Type: application/json" \
-H "Authorization: Bearer your_sandbox_token" \
-d '{
    "quantity": 1,
    "product": "D",
    "validity": "DAY",
    "price": 20.0,
    "instrument_token": "NSE_EQ|INE528G01035",
    "order_type": "LIMIT",
    "transaction_type": "BUY",
    "disclosed_quantity": 0,
    "trigger_price": 0,
    "is_amo": false
}'
```

#### 3. Delivery Stop Loss Order
```bash
curl -X POST http://localhost:3000/api/sandbox/orders/deliveryStopLossOrder \
-H "Content-Type: application/json" \
-H "Authorization: Bearer your_sandbox_token" \
-d '{
    "quantity": 1,
    "product": "D",
    "validity": "DAY",
    "price": 20.0,
    "instrument_token": "NSE_EQ|INE528G01035",
    "order_type": "SL",
    "transaction_type": "BUY",
    "disclosed_quantity": 0,
    "trigger_price": 19.5,
    "is_amo": false
}'
```

#### 4. Delivery Stop Loss Market Order
```bash
curl -X POST http://localhost:3000/api/sandbox/orders/deliveryStopLossOrderMarket \
-H "Content-Type: application/json" \
-H "Authorization: Bearer your_sandbox_token" \
-d '{
    "quantity": 1,
    "product": "D",
    "validity": "DAY",
    "instrument_token": "NSE_EQ|INE528G01035",
    "order_type": "SL_M",
    "transaction_type": "BUY",
    "disclosed_quantity": 0,
    "trigger_price": 24.5,
    "is_amo": false
}'
```

#### 5. Intraday Market Order
```bash
curl -X POST http://localhost:3000/api/sandbox/orders/intradayMarketOrder \
-H "Content-Type: application/json" \
-H "Authorization: Bearer your_sandbox_token" \
-d '{
    "quantity": 1,
    "product": "I",
    "validity": "DAY",
    "instrument_token": "NSE_EQ|INE528G01035",
    "order_type": "MARKET",
    "transaction_type": "BUY",
    "disclosed_quantity": 0,
    "trigger_price": 0,
    "is_amo": false
}'
```

#### 6. Intraday Limit Order
```bash
curl -X POST http://localhost:3000/api/sandbox/orders/intradayLimitOrder \
-H "Content-Type: application/json" \
-H "Authorization: Bearer your_sandbox_token" \
-d '{
    "quantity": 1,
    "product": "I",
    "validity": "DAY",
    "price": 20.0,
    "instrument_token": "NSE_EQ|INE528G01035",
    "order_type": "LIMIT",
    "transaction_type": "BUY",
    "disclosed_quantity": 0,
    "trigger_price": 0,
    "is_amo": false
}'
```

### Live Environment

All live orders are handled through a single endpoint: `/api/live/orders`

Example requests for different order types:

#### 1. Delivery Market Order
```bash
curl -X POST http://localhost:3000/api/live/orders \
-H "Content-Type: application/json" \
-H "Authorization: Bearer your_live_token" \
-d '{
    "quantity": 1,
    "product": "D",
    "validity": "DAY",
    "instrument_token": "NSE_EQ|INE528G01035",
    "order_type": "MARKET",
    "transaction_type": "BUY",
    "disclosed_quantity": 0,
    "trigger_price": 0,
    "is_amo": false
}'
```

[Continue with all other live order examples as shown above]

## Request Parameters

| Parameter | Description | Required | Values |
|-----------|-------------|----------|---------|
| quantity | Order quantity | Yes | Integer > 0 |
| product | Product type | Yes | "D" (Delivery), "I" (Intraday) |
| validity | Order validity | Yes | "DAY", "IOC" |
| price | Order price | Yes for LIMIT/SL | Number |
| instrument_token | Trading symbol | Yes | e.g., "NSE_EQ|INE528G01035" |
| order_type | Type of order | Yes | "MARKET", "LIMIT", "SL", "SL_M" |
| transaction_type | Buy or Sell | Yes | "BUY", "SELL" |
| disclosed_quantity | Disclosed quantity | No | Integer ≥ 0 |
| trigger_price | Trigger price for SL orders | Yes for SL/SL_M | Number |
| is_amo | After market order | No | boolean |

## Error Handling

The API returns appropriate HTTP status codes:
- 200: Success
- 400: Bad Request (missing or invalid parameters)
- 401: Unauthorized (invalid token)
- 500: Server Error

Error response format:
```json
{
    "error": "Error message",
    "details": "Additional error details if available"
}
```

#### Profile Endpoints

1. Get User Profile
```bash
curl -X GET http://localhost:3000/api/live/profile \
-H "Content-Type: application/json" \
-H "Authorization: Bearer your_live_token"
```


#### Portfolio Endpoints

1. Get Holdings
```bash
curl -X GET http://localhost:3000/api/live/portfolio \
-H "Content-Type: application/json" \
-H "Authorization: Bearer your_live_token"
```

2. Get Positions
```bash
curl -X GET http://localhost:3000/api/live/portfolio/positions \
-H "Content-Type: application/json" \
-H "Authorization: Bearer your_live_token"
```

3. Get Trade History
```bash
curl -X GET http://localhost:3000/api/live/portfolio/trades \
-H "Content-Type: application/json" \
-H "Authorization: Bearer your_live_token"
```


#### 4. Get Order History
```bash
curl -X GET http://localhost:3000/api/live/orders/orderHistory/{orderId} \
-H "Content-Type: application/json" \
-H "Authorization: Bearer your_live_token"
```

Response format:
```json
{
    "order_id": "240112010371054",
    "status": "COMPLETED",
    "status_message": "",
    "order_timestamp": "2024-01-12T09:30:00Z",
    "exchange_order_id": "1000000000000000",
    "exchange_time": "2024-01-12T09:30:01Z",
    "order_type": "MARKET",
    "instrument_token": "NSE_EQ|INE528G01035",
    "quantity": 1,
    "price": 100.50,
    "product": "D",
    "validity": "DAY",
    "trigger_price": 0,
    "disclosed_quantity": 0,
    "transaction_type": "BUY"
}
```


### Modify Orders
Modify existing orders with updated parameters.

#### Modify Order
```bash
curl -X PUT http://localhost:3000/api/live/orders/modify \
-H "Content-Type: application/json" \
-H "Authorization: Bearer your_live_token" \
-d '{
    "orderId": "240111010331447",
    "orderType": "MARKET",
    "quantity": 1,
    "price": 0,
    "triggerPrice": 0,
    "validity": "DAY",
    "disclosedQuantity": 0
}'
```

Request Body Parameters:
- `orderId` (required): The ID of the order to modify
- `orderType`: Type of order (MARKET, LIMIT, SL, SL-M)
- `quantity`: Number of shares
- `price`: Price per share (for LIMIT orders)
- `triggerPrice`: Trigger price (for SL and SL-M orders)
- `validity`: Order validity (DAY, IOC)
- `disclosedQuantity`: Quantity to be disclosed

Response format:
```json
{
    "message": "Order modified successfully",
    "data": {
        "status": "success",
        "order_id": "240111010331447"
    }
}
```

### Cancel Orders
Cancel existing orders that haven't been executed.

#### Cancel Order
```bash
curl -X DELETE http://localhost:3000/api/live/orders/cancel/{orderId} \
-H "Content-Type: application/json" \
-H "Authorization: Bearer your_live_token"
```

Parameters:
- `orderId` (required): The ID of the order to cancel



## API Response Codes

### Success Responses
- 200: Request successful
- 201: Resource created successfully

### Error Responses
- 400: Bad Request (invalid parameters)
- 401: Unauthorized (invalid token)
- 403: Forbidden (insufficient permissions)
- 404: Resource not found
- 429: Too many requests
- 500: Internal server error

## Response Headers

All API responses include the following headers:
-H "Content-Type: application/json" \
-H "Authorization: Bearer your_live_token"


## Notes

1. Sandbox environment is for testing purposes only
2. Live environment requires valid API credentials
3. All prices must be within the valid range for the instrument
4. For Stop Loss orders, trigger price must be:
   - Less than limit price for Buy orders
   - Greater than limit price for Sell orders

## License

[Your License] 