const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const dotenv = require('dotenv');
const mongoSanitize = require('express-mongo-sanitize');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const authRouter = require('./routes/auth/authRouter');
const sellerRouter = require('./routes/seller/sellerRouter');
const adminRouter = require('./routes/admin/adminRouter');
const productRouter = require('./routes/product/productRouter');
const superAdminRouter = require('./routes/superadmin/superAdminRouter');
const orderRoutes = require('./routes/order/orderRoutes');
const paymentRoutes = require('./routes/payment/paymentRoutes');
const payrollRoutes = require('./routes/payroll/payrollRoutes');
const ticketRoutes = require('./routes/ticket/ticketRouter');
const ticketMasterRoutes = require('./routes/ticketmaster/ticketMasterRoutes');
const rootRouter = require('./routes/root/rootRouter');

const rateLimiterMiddleware = require('./middleware/rateLimiterMiddleware.js');
const connectDB = require('./utils/connectDB');
const ipBannedMiddleware = require('./middleware/checkIpBanned');
const assignUniqueIdentity = require('./middleware/assignUniqueID');

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5500;

/* =======================
   GLOBAL MIDDLEWARES
======================= */

app.use(express.json());
app.use(cookieParser());
app.use(mongoSanitize());
app.use(helmet());
app.use(morgan('combined'));

/* ✅ PRODUCTION CORS FIX */
const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://quickcart-hazel-iota.vercel.app",
    "https://quickcart-5uy5.vercel.app"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));

app.options('*', cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(rateLimiterMiddleware);
app.use(ipBannedMiddleware);
app.use(assignUniqueIdentity);

/* =======================
   ROUTES
======================= */

app.use('/api/auth', authRouter);
app.use('/api/seller', sellerRouter);
app.use('/api/admin', adminRouter);
app.use('/api/product', productRouter);
app.use('/api/superadmin', superAdminRouter);
app.use('/api/order', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/ticket', ticketRoutes);
app.use('/api/ticketmaster', ticketMasterRoutes);
app.use('/api/root', rootRouter);

/* =======================
   ROOT ROUTE
======================= */

app.get('/', (req, res) => {
    res.send('🚀 QuickCart API is running successfully');
});

/* =======================
   ERROR HANDLING
======================= */

app.use((req, res) => {
    res.status(404).json({
        error: 'not_found',
        message: 'Route Not Found',
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'server_error',
        message: 'Internal Server Error',
    });
});

/* =======================
   SERVER START
======================= */

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});