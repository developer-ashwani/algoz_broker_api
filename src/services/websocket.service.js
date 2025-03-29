const UpstoxClient = require('upstox-js-sdk');

class WebSocketService {
    constructor() {
        this.streamer = null;
        this.isConnected = false;
    }

    initialize(token) {
        try {
            // Set up authentication
            const defaultClient = UpstoxClient.ApiClient.instance;
            defaultClient.authentications['OAUTH2'].accessToken = token;

            // Create market data streamer
            this.streamer = new UpstoxClient.MarketDataStreamerV3();
            this.setupEventHandlers();

            return this.streamer;
        } catch (error) {
            console.error('WebSocket Initialization Error:', error);
            throw error;
        }
    }

    setupEventHandlers() {
        this.streamer.on('open', () => {
            console.log('WebSocket Connected');
            this.isConnected = true;
        });

        this.streamer.on('message', (data) => {
            const feed = data.toString('utf-8');
            console.log('Market Update:', feed);
        });

        this.streamer.on('error', (error) => {
            console.error('WebSocket Error:', error);
            this.isConnected = false;
        });

        this.streamer.on('close', () => {
            console.log('WebSocket Connection Closed');
            this.isConnected = false;
        });
    }

    connect() {
        if (!this.streamer) {
            throw new Error('WebSocket not initialized');
        }
        this.streamer.connect();
        this.streamer.autoReconnect(true, 10, 3);
    }

    subscribe(instruments, mode = 'full') {
        if (!this.isConnected) {
            throw new Error('WebSocket not connected');
        }
        this.streamer.subscribe(instruments, mode);
    }

    unsubscribe(instruments) {
        if (!this.isConnected) {
            throw new Error('WebSocket not connected');
        }
        this.streamer.unsubscribe(instruments);
    }

    changeMode(instruments, mode) {
        if (!this.isConnected) {
            throw new Error('WebSocket not connected');
        }
        this.streamer.changeMode(instruments, mode);
    }

    disconnect() {
        if (this.streamer) {
            this.streamer.disconnect();
            this.isConnected = false;
        }
    }
}

module.exports = new WebSocketService(); 