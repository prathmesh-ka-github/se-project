const express = require("express")

const app = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(express.static(__dirname + ""))

const { error } = require("console")
// mongoose.connect("-connection-string-")

app.get('/', (req,res) => {
    res.status(200)
    res.sendFile(__dirname + "/index.html")
})

app.get('/err', (req,res) => {
    res.status(200)
    res.sendFile(__dirname + "/Pages/error.html")
})

app.get('/login', (req,res) => {
    res.status(200)
    res.sendFile(__dirname + "/Pages/login.html")
})

app.get('/signin', (req,res) => {
    res.status(200)
    res.sendFile(__dirname + "/Pages/page1.html")
})

app.listen (port, () => {
    console.log(`listening to http://localhost:${port}`)
})