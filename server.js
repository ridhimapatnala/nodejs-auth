require('dotenv').config()
const express = require('express')
const connectToDB=require('./db/db')
const authRoutes = require('./routes/auth-routes')
const homeRoutes = require('./routes/home-routes')
const adminRoutes = require('./routes/admin-routes')
const imageRoutes = require('./routes/image-routes')

connectToDB()

const app = express()
const PORT = process.env.PORT || 3000;

//middlewares
app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api/home', homeRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/image', imageRoutes)

app.listen(PORT, ()=>{
    console.log(`server running on port ${PORT}`)
})