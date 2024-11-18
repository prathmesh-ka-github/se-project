const express = require("express")
const bcrypt = require('bcrypt')
const session = require('express-session')
const mongoose = require('mongoose')
const Product = require('./schemas/Product')
const User = require('./schemas/User')
const { spawn } = require('child_process')
const path = require('path')
const app = express()
const port = 3000

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(express.static(__dirname + ""))
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'Pages')));

app.use(session({
    secret: 'secret_key', 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // set to true in production with HTTPS
}));

mongoose.connect('mongodb+srv://alden:1234@boxedfashioncluster.ljset.mongodb.net/ProductData?retryWrites=true&w=majority&appName=BoxedfashionCluster');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

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

app.get('/page2', (req, res) => {
    res.sendFile(path.join(__dirname, 'Pages/page2.html'));
});

app.get('/page3-customer', (req,res) => {
    res.status(200)
    res.sendFile(__dirname + "/Pages/page3-customer.html")
})

app.get('/page3-retailer', (req,res) => {
    res.status(200)
    res.sendFile(__dirname + "/Pages/page3-retailer.html")
})

app.get('/survey', (req, res) => {
    res.status(200)
    res.sendFile(__dirname + "/Pages/quiz.html")
})

app.get('/catalogue', async (req, res) => {
    try {
        const products = await Product.find({});
        res.render('catalogue', { products: products });
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while retrieving products.');
    }
});

app.get('/cart', async (req, res) => {
    try {
        const products = await Product.find({});
        res.render('cart', { products: products });
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while retrieving cart items.');
    }
});

app.get('/wishlist', async (req, res) => {
    try {
        const products = await Product.find({});
        res.render('wishlist', { products: products });
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while retrieving wishlist items.');
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log('user not found')
            res.status(400).json({error : 'User not found'});
            return 1
        }
        //const hashedPassword = await bcrypt.hash(password, 10);
        // console.log(hashedPassword)
        // console.log(user.password)
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Invalid credentials');
        }

        // Set user email in local storage and redirect to the landing page
        req.session.userEmail = email;
        res.json({ email: user.email }); // This will be handled on the client-side to store in local storage
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred during login');
    }
});

app.post('/create-user', async (req, res) => {
    try {
        const newUser = new User({ email: req.body.email, password: req.body.password });
        await newUser.save();
        req.session.userEmail = req.body.email; // Store email in session
        res.status(200).send('User created successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while creating the user');
    }
});

app.post('/submit-profile', async (req, res) => {
    try {
        const email = req.session.userEmail; // Retrieve email from session
        if (!email) {
            return res.status(400).send('User email not found in session');
        }
        const updateData = req.body;
        await User.findOneAndUpdate({ email }, updateData);
        res.status(200).send('Profile updated successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while updating the profile');
    }
});

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
