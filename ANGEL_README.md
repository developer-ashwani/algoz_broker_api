# Angel Broking API Routes Documentation

This document provides detailed information about all available API routes in the Angel Broking integration.

## Table of Contents
1. [Orders](#orders)
2. [Portfolio](#portfolio)
3. [Users](#users)
4. [Historical Data](#historical-data)

## Orders

### Get Order Book
- **Endpoint**: `/api/angel/orders/orderbook`
- **Method**: GET
- **Description**: Retrieves the list of all orders
- **Response**: 
  ```json
  {
    "status": "success",
    "message": "Order book retrieved successfully",
    "data": [...]
  }
  ```

### Place Order
- **Endpoint**: `/api/angel/orders/place`
- **Method**: POST
- **Description**: Places a new order
- **Request Body**:
  ```json
  {
    "variety": "NORMAL",
    "tradingsymbol": "RELIANCE",
    "symboltoken": "2885",
    "transactiontype": "BUY",
    "exchange": "NSE",
    "ordertype": "MARKET",
    "producttype": "INTRADAY",
    "duration": "DAY",
    "price": "0",
    "squareoff": "0",
    "stoploss": "0",
    "quantity": "1"
  }
  ```

### Cancel Order
- **Endpoint**: `/api/angel/orders/cancel`
- **Method**: POST
- **Description**: Cancels an existing order
- **Request Body**:
  ```json
  {
    "variety": "NORMAL",
    "orderid": "201020000000080"
  }
  ```
- **Response**:
  ```json
  {
    "status": true,
    "message": "SUCCESS",
    "errorcode": "",
    "data": {
      "orderid": "201020000000080",
      "uniqueorderid": "34reqfachdfih"
    }
  }
  ```

### Modify Order
- **Endpoint**: `/api/angel/orders/modify`
- **Method**: POST
- **Description**: Modifies an existing order
- **Request Body**:
  ```json
  {
    "variety": "NORMAL",
    "orderid": "201020000000080",
    "ordertype": "LIMIT",
    "producttype": "INTRADAY",
    "duration": "DAY",
    "price": "1000",
    "quantity": "1"
  }
  ```

## Portfolio

### Get Holdings
- **Endpoint**: `/api/angel/portfolio/holdings`
- **Method**: GET
- **Description**: Retrieves the user's current holdings
- **Response**: 
  ```json
  {
    "status": "success",
    "message": "Holdings fetched successfully",
    "data": [...]
  }
  ```

### Get All Holdings
- **Endpoint**: `/api/angel/portfolio/holdings/all`
- **Method**: GET
- **Description**: Retrieves all holdings including those in transit
- **Response**: 
  ```json
  {
    "status": "success",
    "message": "All holdings fetched successfully",
    "data": [...]
  }
  ```

### Get Positions
- **Endpoint**: `/api/angel/portfolio/positions`
- **Method**: GET
- **Description**: Retrieves the user's current positions
- **Response**: 
  ```json
  {
    "status": "success",
    "message": "Positions fetched successfully",
    "data": [...]
  }
  ```

### Get Trade Book
- **Endpoint**: `/api/angel/portfolio/tradebook`
- **Method**: GET
- **Description**: Retrieves the user's trade history
- **Response**: 
  ```json
  {
    "status": "success",
    "message": "Trade book fetched successfully",
    "data": [...]
  }
  ```

### Convert Position
- **Endpoint**: `/api/angel/portfolio/positions/convert`
- **Method**: POST
- **Description**: Converts a position from one product type to another
- **Request Body**:
  ```json
  {
    "exchange": "NSE",
    "oldproducttype": "INTRADAY",
    "newproducttype": "DELIVERY",
    "tradingsymbol": "RELIANCE",
    "transactiontype": "BUY",
    "quantity": "1",
    "type": "DAY"
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "message": "Position converted successfully",
    "data": {...}
  }
  ```

## Users

### Get User Profile
- **Endpoint**: `/api/angel/users/profile`
- **Method**: GET
- **Description**: Retrieves the user's profile information
- **Response**: 
  ```json
  {
    "status": "success",
    "message": "Profile fetched successfully",
    "data": {
      "clientcode": "AB1234",
      "name": "John Doe",
      "email": "john@example.com",
      "mobile": "9876543210",
      "exchanges": ["NSE", "BSE"],
      "products": ["CNC", "MIS", "NRML"],
      "lastlogintime": "2024-01-01 10:00:00"
    }
  }
  ```

### Get User Funds
- **Endpoint**: `/api/angel/users/funds`
- **Method**: GET
- **Description**: Retrieves the user's available funds and RMS limits
- **Response**: 
  ```json
  {
    "status": "success",
    "message": "Funds fetched successfully",
    "data": {
      "availablecash": "100000",
      "utilizeddebits": "50000",
      "availablemargin": "50000",
      "net": "100000"
    }
  }
  ```

### Logout User
- **Endpoint**: `/api/angel/users/logout`
- **Method**: POST
- **Description**: Logs out the user and invalidates the session
- **Request Body**:
  ```json
  {
    "clientcode": "AB1234"
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "message": "Logged out successfully",
    "data": null
  }
  ```

## Historical Data

### Get Historical Candle Data
- **Endpoint**: `/api/angel/historical/candle`
- **Method**: POST
- **Description**: Retrieves historical candle data for a symbol
- **Request Body**:
  ```json
  {
    "exchange": "NSE",
    "symboltoken": "2885",
    "interval": "ONE_MINUTE",
    "fromdate": "2024-01-01 09:15",
    "todate": "2024-01-01 15:30"
  }
  ```
- **Response**: Array of candle data with OHLCV (Open, High, Low, Close, Volume) information

## Authentication

All routes require authentication using the Angel Broking API token. The token should be included in the request header:

```
Authorization: Bearer <your_api_token>
```

## Error Handling

All endpoints follow a consistent error response format:

```json
{
  "status": false,
  "message": "Error message",
  "errorcode": "ERROR_CODE",
  "data": null
}
```

Common error codes:
- `MISSING_FIELDS`: Required fields are missing in the request
- `INVALID_VARIETY`: Invalid order variety provided
- `INVALID_ORDER_ID`: Invalid order ID format
- `INTERNAL_ERROR`: Server-side error occurred

## Rate Limiting

Please note that the Angel Broking API has rate limits. It's recommended to implement appropriate delays between requests to avoid hitting these limits.
