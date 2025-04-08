const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const logger = require('./config/logger'); // Import logger

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const upstoxLiveRoutes = require('./upstox/routes/live');
const fyersRoutes = require('./fyers/routes');

// Mount routes
app.use('/upstox/api/live', upstoxLiveRoutes);
app.use('/fyers/api', fyersRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error(`Error: ${err.message} | Stack: ${err.stack}`);

    const statusCode = err.status || 500;
    res.status(statusCode).json({
        error: err.name || 'Internal Server Error',
        message: err.message
    });
});

// Handle 404 routes
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.method} ${req.url} not found`
    });
});

// Start server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});

// Graceful shutdown
const shutdown = () => {
    logger.info('Shutting down server...');
    server.close(() => {
        logger.info('Server closed. Exiting process.');
        process.exit(0);
    });

    // Force close connections after 5s
    setTimeout(() => {
        logger.error('Forcefully shutting down...');
        process.exit(1);
    }, 5000);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
    logger.error('Unhandled Rejection:', error);
    process.exit(1);
});
