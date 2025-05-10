const config = require('./index');

// Define CORS options
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);
    
    // Parse allowed origins from environment variable
    const allowedOrigins = config.corsOptions.origin.split(',');
    
    // Check if the origin is allowed
    if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: config.corsOptions.methods,
  allowedHeaders: config.corsOptions.allowedHeaders,
  credentials: true,
  maxAge: 86400, // 24 hours
};

module.exports = corsOptions;