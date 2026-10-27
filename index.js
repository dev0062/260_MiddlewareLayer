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

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})
