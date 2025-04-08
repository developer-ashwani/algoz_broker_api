const FyersAPI = require("fyers-api-v3").fyersModel


// Create Fyers API instance
const fyers = new FyersAPI({
    enableLogging: true,  // Set to false to disable logging
    path: process.env.FYERS_LOG_DIR  // Optional: specify where to save logs
  });

fyers.setAppId(process.env.FYERS_APP_ID)
fyers.setRedirectUrl(process.env.FYERS_REDIRECT_URI)

// Authentication middleware
const fyersAuth = async (req, res, next) => {
    try {
        const accessToken = req.headers['authorization']?.split(' ')[1];
        
        if (!accessToken) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Access token is required',
                timestamp: new Date().toISOString()
            });
        }

        // Set the access token
        fyers.setAccessToken(accessToken);

        // Verify token by getting profile info
        try {
            const profileResponse = await fyers.get_profile();
            if (profileResponse.code !== 200) {
                return res.status(401).json({
                    error: 'Unauthorized',
                    message: profileResponse.message || 'Invalid access token',
                    timestamp: new Date().toISOString()
                });
            }
            // Attach fyers instance to request
            req.fyers = fyers;
            next();
        } catch (profileError) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Invalid access token',
                timestamp: new Date().toISOString()
            });
        }
    } catch (error) {
        console.error('Fyers Authentication Error:', error);
        res.status(401).json({
            error: 'Authentication Error',
            message: error.message || 'Invalid token',
            timestamp: new Date().toISOString()
        });
    }
};


module.exports = {
    fyers,
    fyersAuth,
}; 