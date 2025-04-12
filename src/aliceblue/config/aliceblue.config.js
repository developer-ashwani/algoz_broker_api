const aliceblueConfig = {
    // API Base URLs
    baseUrl: 'https://ant.aliceblueonline.com/rest/AliceBlueAPIService/api/',
    socketUrl: '',

    // API Endpoints
    endpoints: {
        // login: '/rest/auth/initiate',
        // validate: '/rest/auth/validate',
        // profile: '/rest/user/profile',
        funds: '/limits/getRmsLimits',
        positions: '/positionAndHoldings/positionBook',
        holdings: '/positionAndHoldings/holdings',
        ordersHistory: '/placeOrder/orderHistory',
        // trades: '/rest/account/trades',
        placeOrder: '/placeOrder/executePlaceOrder',
        modifyOrder: '/placeOrder/modifyOrder',
        cancelOrder: '/placeOrder/cancelOrder',
        orderBook: '/placeOrder/fetchOrderBook',
        tradeBook: '/placeOrder/fetchTradeBook',
        // marketData: '/rest/market/data',
        historicalData: '/chart/history',
        accountDetails: '/customer/accountDetails',
        
    },

    // Timeouts
    timeouts: {
        request: 10000, // 10 seconds
        socket: 30000,  // 30 seconds
    },

    // Retry Configuration
    retry: {
        maxAttempts: 3,
        delay: 1000, // 1 second
    },

    // Market Segments
    segments: {
        NSE: 'NSE',
        NFO: 'NFO',
        BSE: 'BSE',
        BFO: 'BFO',
        MCX: 'MCX',
        CDS: 'CDS'
    },

    // Order Types
    orderTypes: {
        MARKET: 'MARKET',
        LIMIT: 'LIMIT',
        SL: 'SL',
        SLM: 'SLM'
    },

    // Product Types
    productTypes: {
        NRML: 'NRML',
        MIS: 'MIS',
        CNC: 'CNC',
        CO: 'CO',
        BO: 'BO'
    },

    // Validity Types
    validityTypes: {
        DAY: 'DAY',
        IOC: 'IOC',
        GTD: 'GTD'
    }
};

module.exports = aliceblueConfig; 