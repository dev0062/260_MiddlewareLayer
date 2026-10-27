import express from 'express'
import pg from 'pg'

const app = express()
const port = 3000
const {Pool} = pg

const pool = new Pool ({
    user : 'postgres',
    host : 'localhost',
    database : 'mahasiswa',
    password : '12345678',
    port : 5432
})

app.use(express.json())
app.use(express.urlencoded({extended: true}))

//MIDDLEWARE
app.use((req, res, next) => {
    const start = Date.now()

    res.on('finish', () => {
        const duration = Date.now() - start

        console.log({
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            duration: `${duration}ms`

        })
    })
    next()
})

//res
function successResponse(res, message, data, status = 200) {
    return res.status(status).json({
        success: true,
        message,
        data, 
        error: null,

    })

}


function errorResponse(res, message, status = 500, error = null) {
    return res.status(status).json({
        success: false,
        message,
        data: null, 
        error,

    })
}

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})
