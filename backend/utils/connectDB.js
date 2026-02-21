const mongoose = require('mongoose');
const dns = require('dns');

// Use reliable public DNS resolvers so SRV lookups for MongoDB Atlas don't depend
// on the local router/ISP DNS configuration (which is causing ECONNREFUSED).
dns.setServers(['8.8.8.8', '1.1.1.1']);

const connectDB = async () => {
    try {
        const host = process.env.USING_DOCKER === "true" ? "mongo" : "127.0.0.1";
        let connectionString = process.env.USING_ONLINE_DB === "true" ? process.env.MONGODB_URI : `mongodb://myuser:mypassword@${host}:27017/?authSource=admin`;
        
        // Ensure connection string has proper format for MongoDB Atlas
        if (process.env.USING_ONLINE_DB === "true" && connectionString && !connectionString.includes('?')) {
            // Add database name and connection options if missing
            const dbName = connectionString.split('/').pop() || 'QuickCart';
            if (!connectionString.endsWith('/') && !connectionString.includes('/' + dbName)) {
                connectionString = connectionString.endsWith('/') 
                    ? connectionString + dbName 
                    : connectionString + '/' + dbName;
            }
            if (!connectionString.includes('?')) {
                connectionString += '?retryWrites=true&w=majority';
            }
        }
        
        // Mongoose 7+ no longer needs useNewUrlParser and useUnifiedTopology
        const conn = await mongoose.connect(connectionString, {
            serverSelectionTimeoutMS: 10000, // 10 seconds timeout for server selection
            socketTimeoutMS: 45000, // 45 seconds socket timeout
            maxPoolSize: 10, // Maintain up to 10 socket connections
            minPoolSize: 5, // Maintain at least 5 socket connections
        });

        console.log(`MongoDB connected: ${conn.connection.host}`);

        // Enable mongoose debugging
        if (process.env.NODE_ENV === 'development') {
            mongoose.set('debug', false);
        }
    } catch (error) {
        console.log(error);
        if (error.code === 'EREFUSED' || error.message.includes('EREFUSED')) {
            console.error(`MongoDB connection failed: DNS resolution error. This could be due to:`);
            console.error(`  1. Network connectivity issues`);
            console.error(`  2. DNS server problems`);
            console.error(`  3. Firewall blocking DNS queries`);
            console.error(`  4. VPN or proxy configuration issues`);
            console.error(`\nPlease check your internet connection and try again.`);
        } else {
            console.error(`MongoDB connection failed: ${error.message}`);
        }
        process.exit(1);
    }
};

mongoose.set('runValidators', true); // enable running validators on update queries

mongoose.plugin(schema => {
    // add createdAt and updatedAt timestamps to documents
    schema.add({
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
    });

    schema.pre('findOneAndUpdate', function () {
        // set the updatedAt field when updating a document
        this.set({ updatedAt: new Date() });
    });
});

mongoose.set('strictQuery', true);

module.exports = connectDB;
