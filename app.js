const express = require('express');
const errorMiddleware = require('./middleware/error');
const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload")
const dotenv = require("dotenv")
const cors = require("cors")

dotenv.config({path:"backend_guitar/backend/config/config.env"})
const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(fileUpload());
const product = require('./routes/productRoutes');
const customer = require('./routes/customerRoutes');
const order = require('./routes/orderRoutes')
const payment = require('./routes/paymentRoutes')

app.use('/api/v1',product)
app.use('/api/v1',customer)
app.use('/api/v2',order)
app.use('/api/v2',payment)
app.use(errorMiddleware)
module.exports = app
