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
    res.sendFile(__dirname + "/error.html")
})

app.listen (port, () => {
    console.log(`listening to http://localhost:${port}`)
})