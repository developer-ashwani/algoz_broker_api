const axios = require('axios');
const aliceblueConfig = require('./aliceblue.config');

class AliceBlueAPI {
    constructor() {
        this.baseUrl = aliceblueConfig.baseUrl;
        this.endpoints = aliceblueConfig.endpoints;
    }

    /**
     * Generic method to handle all HTTP requests
     * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
     * @param {string} endpoint - API endpoint
     * @param {Object} data - Request payload (for POST, PUT)
     * @param {Object} headers - Additional headers
     * @returns {Promise} - API response
     */
    async request(method, endpoint, data = null, headers = {}) {
        try {
            const config = {
                method: method.toLowerCase(),
                url: `${this.baseUrl}${endpoint}`,
                headers: {
                    'Content-Type': 'application/json',
                    ...headers
                }
            };

            // Add data to config based on method
            if (['post', 'put'].includes(method.toLowerCase()) && data) {
                config.data = data;
            } else if (['get', 'delete'].includes(method.toLowerCase()) && data) {
                config.params = data;
            }

            const response = await axios(config);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Make a GET request
     * @param {string} endpoint - API endpoint
     * @param {Object} params - Query parameters
     * @param {Object} headers - Additional headers
     * @returns {Promise} - API response
     */
    async get(endpoint, params = {}, headers = {}) {
        return this.request('GET', endpoint, params, headers);
    }

    /**
     * Make a POST request
     * @param {string} endpoint - API endpoint
     * @param {Object} data - Request payload
     * @param {Object} headers - Additional headers
     * @returns {Promise} - API response
     */
    async post(endpoint, data = {}, headers = {}) {
        return this.request('POST', endpoint, data, headers);
    }

    /**
     * Make a PUT request
     * @param {string} endpoint - API endpoint
     * @param {Object} data - Request payload
     * @param {Object} headers - Additional headers
     * @returns {Promise} - API response
     */
    async put(endpoint, data = {}, headers = {}) {
        return this.request('PUT', endpoint, data, headers);
    }

    /**
     * Make a DELETE request
     * @param {string} endpoint - API endpoint
     * @param {Object} params - Query parameters
     * @param {Object} headers - Additional headers
     * @returns {Promise} - API response
     */
    async delete(endpoint, params = {}, headers = {}) {
        return this.request('DELETE', endpoint, params, headers);
    }

    /**
     * Handle API errors
     * @param {Error} error - Error object
     * @returns {Error} - Formatted error
     */
    handleError(error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            return {
                status: error.response.status,
                message: error.response.data.message || 'API request failed',
                data: error.response.data
            };
        } else if (error.request) {
            // The request was made but no response was received
            return {
                status: 500,
                message: 'No response received from AliceBlue API',
                data: null
            };
        } else {
            // Something happened in setting up the request that triggered an Error
            return {
                status: 500,
                message: 'Error setting up request to AliceBlue API',
                data: error.message
            };
        }
    }

    /**
     * Get account details
     * @param {string} authToken - Authorization token
     * @returns {Promise} - Account details
     */
    async getAccountDetails(authToken) {
        // Validate required parameters
        if (!authToken) {
            throw {
                status: 400,
                message: 'Authorization token is required',
                data: { required: ['authToken'] }
            };
        }

        // Format authorization header
        const headers = {
            'Authorization': `Bearer ${authToken}`
        };

        // Make the GET request
        return this.get(
            this.endpoints.accountDetails,
            {},  // No query parameters needed
            headers
        );
    }

    /**
     * Get RMS limits (funds) for the account
     * @param {string} authToken - Authorization token (userId sessionId)
     * @returns {Promise} - RMS limits data
     */
    async getRmsLimits(authToken) {
        // Validate required parameters
        if (!authToken) {
            throw {
                status: 400,
                message: 'Authorization token is required',
                data: { required: ['authToken'] }
            };
        }

        // Format authorization header
        const headers = {
            'Authorization': `Bearer ${authToken}`
        };

        // Make the GET request
        return this.get(
            this.endpoints.funds,
            {},  // No query parameters needed
            headers
        );
    }

    /**
     * Get holdings for the account
     * @param {string} authToken - Authorization token (userId sessionId)
     * @returns {Promise} - Holdings data
     */
    async getHoldings(authToken) {
        // Validate required parameters
        if (!authToken) {
            throw {
                status: 400,
                message: 'Authorization token is required',
                data: { required: ['authToken'] }
            };
        }

        // Format authorization header
        const headers = {
            'Authorization': `Bearer ${authToken}`
        };

        // Make the GET request
        return this.get(
            this.endpoints.holdings,
            {},  // No query parameters needed
            headers
        );
    }

    /**
     * Get position book for the account
     * @param {string} authToken - Authorization token (userId sessionId)
     * @param {string} ret - Return type (e.g., "DAY")
     * @returns {Promise} - Position book data
     */
    async getPositionBook(authToken, ret = "DAY") {
        // Validate required parameters
        if (!authToken) {
            throw {
                status: 400,
                message: 'Authorization token is required',
                data: { required: ['authToken'] }
            };
        }

        // Format authorization header
        const headers = {
            'Authorization': `Bearer ${authToken}`
        };

        // Prepare request payload
        const payload = {
            ret
        };

        // Make the POST request
        return this.post(
            this.endpoints.positions,
            payload,
            headers
        );
    }

    /**
     * Get historical candle data
     * @param {string} token - The token for the instrument
     * @param {string} resolution - Resolution of data (1 for minute, D for day)
     * @param {string} from - From time in milliseconds (UNIX timestamp)
     * @param {string} to - To time in milliseconds (UNIX timestamp)
     * @param {string} exchange - Exchange segment (NSE, NFO, CDS, MCX)
     * @param {string} authToken - Authorization token
     * @returns {Promise<Object>} Historical data response
     */
    async getHistoricalData(token, resolution, from, to, exchange, authToken) {
        try {
            if (!authToken) {
                throw new Error('Authorization token is required');
            }

            // Format Authorization header
            const headers = {
                'Authorization': `Bearer ${authToken}`
            };

            // Prepare payload
            const payload = {
                token,
                resolution,
                from,
                to,
                exchange
            };

            // Make POST request to historical data endpoint
            const response = await this.post(this.endpoints.historicalData, payload, headers);
            return response;
        } catch (error) {
            console.error('Error fetching historical data:', error);
            throw error;
        }
    }

    /**
     * Get order book for the account
     * @param {string} authToken - Authorization token (userId sessionId)
     * @returns {Promise<Object>} Order book response
     */
    async getOrderBook(authToken) {
        try {
            if (!authToken) {
                throw new Error('Authorization token is required');
            }

            // Format Authorization header
            const headers = {
                'Authorization': `Bearer ${authToken}`
            };

            // Make GET request to order book endpoint
            const response = await this.get(this.endpoints.orderBook, {}, headers);
            return response;
        } catch (error) {
            console.error('Error fetching order book:', error);
            throw error;
        }
    }

    /**
     * Get trade book for the account
     * @param {string} authToken - Authorization token (userId sessionId)
     * @returns {Promise<Object>} Trade book response
     */
    async getTradeBook(authToken) {
        try {
            if (!authToken) {
                throw new Error('Authorization token is required');
            }

            // Format Authorization header
            const headers = {
                'Authorization': `Bearer ${authToken}`
            };

            // Make GET request to trade book endpoint
            const response = await this.get(this.endpoints.tradeBook, {}, headers);
            return response;
        } catch (error) {
            console.error('Error fetching trade book:', error);
            throw error;
        }
    }

    /**
     * Place an order
     * @param {Object} order - Order details
     * @param {string} order.discqty - Number of quantity to be disclosed to the market
     * @param {string} order.trading_symbol - Trading symbol of the instrument
     * @param {string} order.exch - Exchange (NSE, BSE, NFO, MCX)
     * @param {string} order.transtype - Transaction Type (BUY or SELL)
     * @param {string} order.ret - Retention type (DAY)
     * @param {string} order.prctyp - Price type (L, MKT, SL, SL-M)
     * @param {number} order.qty - Number of quantity to transact
     * @param {string} order.symbol_id - Trading symbol Token
     * @param {number} order.price - Price of the instrument
     * @param {number} order.trigPrice - Trigger price for SL orders
     * @param {string} order.pCode - Product code (MIS, CO, CNC, BO, NRML)
     * @param {string} order.complexty - Order complexity (REGULAR, BO)
     * @param {string} order.orderTag - Order remarks
     * @param {string} order.deviceNumber - Unique Device ID
     * @param {string} authToken - Authorization token (userId sessionId)
     * @returns {Promise<Object>} Order response
     */
    async placeOrder(order, authToken) {
        try {
            if (!authToken) {
                throw new Error('Authorization token is required');
            }

            // Format Authorization header
            const headers = {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            };

            // Make POST request to place order endpoint
            const response = await this.post('/placeOrder/executePlaceOrder', [order], headers);
            return response;
        } catch (error) {
            console.error('Error placing order:', error);
            throw error;
        }
    }

    /**
     * Place a bracket order
     * @param {Object} order - Bracket order details
     * @param {string} order.discqty - Number of quantity to be disclosed to the market
     * @param {string} order.trading_symbol - Trading symbol of the instrument
     * @param {string} order.exch - Exchange (NSE, BSE, NFO, MCX)
     * @param {string} order.transtype - Transaction Type (BUY or SELL)
     * @param {string} order.ret - Retention type (DAY)
     * @param {string} order.prctyp - Price type (L, MKT, SL, SL-M)
     * @param {number} order.qty - Number of quantity to transact
     * @param {number} order.price - Price at which main leg of bracket order will be placed
     * @param {string} order.pCode - Product code (MIS, CO, CNC, BO, NRML)
     * @param {string} order.symbol_id - Trading symbol Token
     * @param {number} order.target - Target price
     * @param {number} order.stopLoss - Stop loss price
     * @param {number} order.trailing_stop_loss - Trailing stop loss value
     * @param {string} order.complexty - Order complexity (BO)
     * @param {number} order.trigPrice - Trigger price for SL orders
     * @param {string} order.orderTag - Order remarks
     * @param {string} order.deviceNumber - Unique Device ID
     * @param {string} authToken - Authorization token (userId sessionId)
     * @returns {Promise<Object>} Order response
     */
    async placeBracketOrder(order, authToken) {
        try {
            if (!authToken) {
                throw new Error('Authorization token is required');
            }

            // Format Authorization header
            const headers = {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            };

            // Make POST request to place order endpoint
            const response = await this.post(this.endpoints.placeOrder, [order], headers);
            return response;
        } catch (error) {
            console.error('Error placing bracket order:', error);
            throw error;
        }
    }

    /**
     * Modify an existing order
     * @param {Object} order - Order modification details
     * @param {string} order.transtype - Transaction Type (BUY or SELL)
     * @param {number} order.discqty - Number of quantity to be disclosed to the market
     * @param {string} order.exch - Exchange (NSE, BSE, NFO, MCX)
     * @param {string} order.trading_symbol - Trading symbol of the instrument
     * @param {string} order.nestOrderNumber - Nest Order Number
     * @param {string} order.prctyp - Price type (L, MKT, SL, SL-M)
     * @param {number} order.price - Price at which order will be placed
     * @param {number} order.qty - Modified quantity
     * @param {number} order.trigPrice - Trigger price for SL orders
     * @param {number} order.filledQuantity - Quantity that's been filled
     * @param {string} order.pCode - Product code (MIS, CO, CNC, BO, NRML)
     * @param {string} order.deviceNumber - Unique Device ID
     * @param {string} authToken - Authorization token (userId sessionId)
     * @returns {Promise<Object>} Order modification response
     */
    async modifyOrder(order, authToken) {
        try {
            if (!authToken) {
                throw new Error('Authorization token is required');
            }

            // Format Authorization header
            const headers = {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            };

            // Make POST request to modify order endpoint
            const response = await this.post('/placeOrder/modifyOrder', order, headers);
            return response;
        } catch (error) {
            console.error('Error modifying order:', error);
            throw error;
        }
    }

    /**
     * Cancel an existing order
     * @param {Object} order - Order cancellation details
     * @param {string} order.exch - Exchange (NSE, BSE, NFO, MCX)
     * @param {string} order.nestOrderNumber - Nest Order Number
     * @param {string} order.trading_symbol - Trading symbol of the instrument
     * @param {string} order.deviceNumber - Unique Device ID
     * @param {string} authToken - Authorization token (userId sessionId)
     * @returns {Promise<Object>} Order cancellation response
     */
    async cancelOrder(order, authToken) {
        try {
            if (!authToken) {
                throw new Error('Authorization token is required');
            }

            // Format Authorization header
            const headers = {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            };

            // Make POST request to cancel order endpoint
            const response = await this.post('/placeOrder/cancelOrder', order, headers);
            return response;
        } catch (error) {
            console.error('Error canceling order:', error);
            throw error;
        }
    }

    /**
     * Get order history for a specific order
     * @param {Object} order - Order details
     * @param {string} order.nestOrderNumber - Nest Order Number
     * @param {string} authToken - Authorization token (userId sessionId)
     * @returns {Promise<Object>} Order history response
     */
    async getOrderHistory(order, authToken) {
        try {
            if (!authToken) {
                throw new Error('Authorization token is required');
            }

            // Format Authorization header
            const headers = {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            };

            // Make POST request to order history endpoint
            const response = await this.post('/placeOrder/orderHistory', order, headers);
            return response;
        } catch (error) {
            console.error('Error fetching order history:', error);
            throw error;
        }
    }
}

module.exports = new AliceBlueAPI(); 