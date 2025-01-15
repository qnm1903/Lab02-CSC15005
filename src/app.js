// main.js or app.js
import express from 'express';
import configViewEngine from './configs/viewEngine.js';
import indexRoutes from './routes/index.js';
import bodyParser from 'body-parser';
import'./db/init.mongodb.js'
import path from "path";
const __dirname = path.resolve()
const app = express()
app.set("view engine", "ejs")
app.use(express.static(path.join(__dirname, "src", 'public'))); // Thư mục public nằm ở root
app.set('views', path.join(process.cwd(), 'src/views'));

configViewEngine(app);
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(indexRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  console.log(err);
  if (process.env.NODE_ENV === 'pro') {
    return res.render('404', {eventData: null});
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

// Start the server

export default app