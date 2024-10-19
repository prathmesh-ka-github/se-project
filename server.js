const express = require("express")
const { spawn } = require('child_process')
const path = require('path')
const app = express()
const port = 3000

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

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

app.get('/survey', (req, res) => {
    res.status(200)
    res.sendFile(__dirname + "/Pages/quiz.html")
})

// app.get('/survey_results', (req, res) => {
//     const pythonProcess = spawn('python', ['database/recommendation_model.py']);
//     let responseSent = false;

//     pythonProcess.stdout.on('data', (data) => {
//         const jsonStr = data.toString();
//         //console.log("Output from Python script:", jsonStr);  // Log the raw output
//         try {
//             let cards = JSON.parse(jsonStr);
//             res.render('survey_results', { cards: cards });
//             responseSent = true;
//         } catch (err) {
//             console.error("JSON parsing error:", err);
//             if (!responseSent) {
//                 res.status(500).send("An error occurred while processing the JSON output.");
//                 responseSent = true;
//             }
//         }
//     });
    
//     pythonProcess.stderr.on('data', (data) => {
//         console.error(`Error: ${data.toString()}`);
//         if (!responseSent) {
//             res.status(500).send("An error occurred while executing the Python script.");
//             responseSent = true;
//         }
//     });

//     pythonProcess.on('close', (code) => {
//         if (!responseSent) {
//             res.status(500).send(`Python script exited with code ${code}`);
//             responseSent = true;
//         }
//     });
// });

app.post('/submit-survey', (req, res) => {
    const formData = req.body;

    const pythonProcess = spawn('python', ['database/recommendation_model.py'], {
        stdio: ['pipe', 'pipe', 'pipe']
    });

    pythonProcess.stdin.write(JSON.stringify(formData));
    pythonProcess.stdin.end();

    let outputData = '';

    pythonProcess.stdout.on('data', (data) => {
        outputData += data.toString();
    });

    pythonProcess.stdout.on('end', () => {
        // console.log("Output from Python script:", outputData);
        try {
            let recommendations = JSON.parse(outputData);
            res.render('survey_results', { cards: recommendations });
        } catch (err) {
            console.error("JSON parsing error:", err);
            res.status(500).send("An error occurred while processing the JSON output.");
        }
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Error: ${data.toString()}`);
        res.status(500).send("An error occurred while executing the Python script.");
    });
});

app.listen (port, () => {
    console.log(`listening to http://localhost:${port}`)
})