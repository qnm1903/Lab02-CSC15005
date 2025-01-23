import express from 'express'
import morgan from 'morgan'
import path from 'path'
import compression from 'compression'
import { engine } from 'express-handlebars'
import dotenv from 'dotenv';
import { stringify } from 'querystring'

dotenv.config();

const configViewEngine = (app) => {
    const __dirname = path.resolve()
    app.use(compression())
    app.use(express.static('public')) // Giả sử file CSS nằm trong thư mục `public/css`

    // Cấu hình Handlebars
    app.engine('hbs', engine({
        extname: '.hbs',
        defaultLayout: 'main',
        layoutsDir: path.join(__dirname, 'src/views/layouts'),
        partialsDir: path.join(__dirname, 'src/views/partials'),
        helpers: {
            json_stringify: function(context) {
                return JSON.stringify(context);
            }
        }
    }));
    app.set('view engine', 'hbs')
    app.set('views', path.join(__dirname, 'src/views'))

    // HTTP logger
    app.use(morgan('tiny'))

    app.use((req, res, next) => {
        console.log(`${req.method} ${req.url}`)
        next()
    })
}

export default configViewEngine