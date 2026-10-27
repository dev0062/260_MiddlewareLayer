import express from 'express'
import pg from 'pg'
import Joi from 'joi'

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


const biodataSchema = Joi.object({
    id: Joi.number().integer().positive(),
    nama: Joi.string().trim().min(2).max(100).required(),
    nim: Joi.string().trim().min(5).max(20).required(),
    kelas: Joi.string().trim().min(1).max(20).required(),
})

const idSchema = Joi.object({
    id: Joi.number().integer().positive().required(),
})

//MILDWARE VALIDATION BODY
function validateBody(schema){
    return (req, res, next) => {
        const {error, value} = schema.validate(req.body, {
            abortEarly: false,
            convert: true,
            allowUnknown: false,
        })

        if(error){
            return errorResponse(
                res,
                'validasi Input Gagal',
                400,
                error.details.map(item => ({
                    field: item.path.join('.'),
                    message: item.message,
                }))

            )

        }
        req.body = value
        next()
    }
}

//MIDDLEWARE VALIDATIION PARAMETER

function validateParams(schema){
    return (req, res, next) => {
        const {error, value} = schema.validate(req.params, {
            abortEarly: false,
            convert: true,
            allowUnknown: false,
        })

        if(error){
            return errorResponse(
                res,
                'parameter Tidak Valid',
                400,
                error.details.map(item => ({
                    field: item.path.join('.'),
                    message: item.message,
                }))

            )

        }
        req.params = value
        next ()
    }
}

//METHOD GET

app.get('/', async(req, res) => {
    const result = await pool.query(
        'SELECT * FROM biodata ORDER BY id'
    )
    return successResponse(res, 'Data berhasil diambil', result.rows)
})

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})
