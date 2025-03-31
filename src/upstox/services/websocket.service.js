const UpstoxClient = require('upstox-js-sdk');

class WebSocketService {
    constructor() {
        this.streamer = null;
        this.isConnected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 3;
        this.reconnectInterval = 10; // seconds
    }

    initialize(token) {
        try {
            if (this.streamer) {
                console.log("WebSocket already initialized.");
                return;
            }

            // Set up authentication
            const defaultClient = UpstoxClient.ApiClient.instance;
            defaultClient.authentications['OAUTH2'].accessToken = token;

            // Create market data streamer
            this.streamer = new UpstoxClient.MarketDataStreamerV3();
            this.setupEventHandlers();

            return this.streamer;
        } catch (error) {
            console.error('WebSocket Initialization Error:', error);
            throw new Error('Failed to initialize WebSocket: ' + error.message);
        }
    }

    async getMarketDataFeedUrl(token) {
        try {
            const defaultClient = UpstoxClient.ApiClient.instance;
            defaultClient.authentications['OAUTH2'].accessToken = token;
            
            const apiInstance = new UpstoxClient.WebsocketApi();
            
            const response = await new Promise((resolve, reject) => {
                apiInstance.getMarketDataFeedAuthorize("2.0", (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data.data.authorizedRedirectUri);
                    }
                });
            });

            return response;

        } catch (error) {
            console.error('Get Market Data Feed URL Error:', error);
            throw new Error('Failed to fetch WebSocket URL: ' + error.message);
        }
    }

    setupEventHandlers() {
        if (!this.streamer) {
            throw new Error('WebSocket not initialized');
        }
    
        this.streamer.on('open', () => {
            console.log('WebSocket Connected');
            this.isConnected = true;
            this.reconnectAttempts = 0;
        });
    
        this.streamer.on('message', (data) => {
            try {
                console.log('Market Update:', data.toString('utf-8'));
            } catch (error) {
                console.error('Message parsing error:', error);
            }
        });
    
        this.streamer.on('error', (error) => {
            console.error('WebSocket Error:', error);
            this.isConnected = false;
    
            //  Check if streamer is null before accessing autoReconnectEnabled
            if (this.streamer && !this.streamer.autoReconnectEnabled) {
                this.handleReconnect();
            }
        });
    
        this.streamer.on('close', () => {
            console.log('WebSocket Connection Closed');
            this.isConnected = false;
    
            // Check if streamer is null before accessing autoReconnectEnabled
            if (this.streamer && !this.streamer.autoReconnectEnabled) {
                this.handleReconnect();
            }
        });
    }

    async connect() {
        try {
            if (this.isConnected) {
                throw new Error('WebSocket already connected');
            }

            if (!this.streamer) {
                throw new Error('WebSocket not initialized');
            }

            this.streamer.connect();
            this.streamer.autoReconnect(true, this.reconnectInterval, this.maxReconnectAttempts);

            return new Promise((resolve, reject) => {
                this.streamer.once('open', () => resolve());
                this.streamer.once('error', (error) => reject(error));

                setTimeout(() => {
                    reject(new Error('Connection timeout'));
                }, 10000);
            });
        } catch (error) {
            console.error('WebSocket Connect Error:', error);
            throw error;
        }
    }

    subscribe(instruments, mode = 'full') {
        try {
            if (!this.isConnected) {
                throw new Error('WebSocket not connected');
            }

            if (!Array.isArray(instruments) || instruments.length === 0) {
                throw new Error('Invalid instruments array');
            }

            if (!['full', 'ltpc'].includes(mode)) {
                throw new Error('Invalid mode. Must be "full" or "ltpc"');
            }

            this.streamer.subscribe(instruments, mode);
            console.log('Subscribed to instruments:', instruments, 'Mode:', mode);
        } catch (error) {
            console.error('Subscribe Error:', error);
            throw error;
        }
    }

    unsubscribe(instruments) {
        try {
            if (!this.isConnected) {
                throw new Error('WebSocket not connected');
            }

            if (!Array.isArray(instruments) || instruments.length === 0) {
                throw new Error('Invalid instruments array');
            }

            this.streamer.unsubscribe(instruments);
            console.log('Unsubscribed from instruments:', instruments);
        } catch (error) {
            console.error('Unsubscribe Error:', error);
            throw error;
        }
    }

    changeMode(instruments, mode) {
        try {
            if (!this.isConnected) {
                throw new Error('WebSocket not connected');
            }

            if (!Array.isArray(instruments) || instruments.length === 0) {
                throw new Error('Invalid instruments array');
            }

            if (!['full', 'ltpc'].includes(mode)) {
                throw new Error('Invalid mode. Must be "full" or "ltpc"');
            }

            this.streamer.changeMode(instruments, mode);
            console.log('Changed mode for instruments:', instruments, 'New mode:', mode);
        } catch (error) {
            console.error('Change Mode Error:', error);
            throw error;
        }
    }

    disconnect() {
        try {
            if (!this.isConnected) {
                throw new Error('WebSocket not connected');
            }

            this.streamer.disconnect();
            this.isConnected = false;
            this.streamer = null;
            console.log('WebSocket disconnected successfully');
        } catch (error) {
            console.error('Disconnect Error:', error);
            throw error;
        }
    }

    handleReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`Reconnect attempt ${this.reconnectAttempts} of ${this.maxReconnectAttempts}`);
            
            setTimeout(() => {
                if (!this.isConnected) {
                    this.connect().catch(error => {
                        console.error('Reconnection failed:', error);
                    });
                }
            }, this.reconnectInterval * 1000);
        } else {
            console.log('Max reconnection attempts reached');
        }
    }
}

// Export singleton instance
module.exports = new WebSocketService();
