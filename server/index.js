import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'

import connectDB from './mongodb/connect.js'
import userRouter from './routes/user.routes.js'
import propertyRouter from './routes/property.routes.js'

dotenv.config()

const app = express()

const allowedOrigins = ['https://yarigaben.netlify.app'];

app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin (like Postman, server-to-server)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,  // if using cookies or auth headers
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));


app.use(express.json({limit: '50mb'}))

app.get('/', (req, res) => {
    res.send({message: 'Hello World'})
})

app.use('/api/v1/users', userRouter)
app.use('/api/v1/properties', propertyRouter)

const startServer = async () => {
    try {
        // connect to the database
        connectDB(process.env.MONGODB_URL)

        app.listen(8080, () => console.log('Server started on http://localhost:8080'))
    } catch (error) {
        console.log(error)
    }
}

startServer()