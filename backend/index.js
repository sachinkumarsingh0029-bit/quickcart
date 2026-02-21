const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const dotenv = require('dotenv');
const mongoSanitize = require('express-mongo-sanitize');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const csurf = require('csurf');

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

const corsConfig = {
    origin: true,
    credentials: true,
};

app.use(cors(corsConfig));
app.options('*', cors(corsConfig));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', "default-src 'self'");
    next();
});

app.use(rateLimiterMiddleware);
app.use(ipBannedMiddleware);
app.use(assignUniqueIdentity);

/* =======================
   CSRF CONFIG
======================= */

let csrfProtection;

if (process.env.NODE_ENV === 'production') {
    csrfProtection = csurf({
        cookie: {
            secure: true,
            httpOnly: true,
        },
    });
} else {
    csrfProtection = (req, res, next) => next();
}

/* =======================
   ROUTES
======================= */

app.use('/api/auth', csrfProtection, authRouter);
app.use('/api/seller', csrfProtection, sellerRouter);
app.use('/api/admin', csrfProtection, adminRouter);
app.use('/api/product', csrfProtection, productRouter);
app.use('/api/superadmin', csrfProtection, superAdminRouter);
app.use('/api/order', csrfProtection, orderRoutes);
app.use('/api/payment', csrfProtection, paymentRoutes);
app.use('/api/payroll', csrfProtection, payrollRoutes);
app.use('/api/ticket', csrfProtection, ticketRoutes);
app.use('/api/ticketmaster', csrfProtection, ticketMasterRoutes);
app.use('/api/root', csrfProtection, rootRouter);

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
   SERVER START (Render Compatible)
======================= */

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});