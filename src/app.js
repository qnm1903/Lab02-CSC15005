// main.js or app.js
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import session from 'express-session'
import configViewEngine from './configs/viewEngine.js';
import path from "path";

//Router
import IndexRouter from './routes/index.js';
import UserRouter from './routes/user.route.js';

const __dirname = path.resolve()
const app = express()

app.use(cookieParser());
//config
app.set('trust proxy', 1);
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
  },
}));

app.use(express.static(path.join(__dirname, "src", 'public'))); // Thư mục public nằm ở root
app.set('views', path.join(process.cwd(), 'src/views'));

configViewEngine(app); //view engine

//middleware
app.use(express.urlencoded({ extend: true }));
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

//Register to using Routers
app.use(IndexRouter.getRouter());
app.use('/user', new UserRouter().getRouter());

// Error handling middleware
app.use((err, req, res, next) => {
  console.log(err);
  if (process.env.NODE_ENV === 'pro') {
    return res.render('404', { eventData: null });
  } else {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: err.message,
        stack: err.stack,
      });
    } else {
      return res.status(500).json({
        message: 'An unexpected error occurred',
        error: err.message,
        stack: err.stack,
      });
    }
  }
});

export default app