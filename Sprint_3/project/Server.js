const express = require("express");
const mysql = require("mysql2");
const path = require("path");
const app = express();
const port = 3000;

// Deny access ot 'Views' folder
app.use(express.static(path.join(__dirname, '/Images')));
// Integrate pug with express
app.set('views', './app/views');
app.set('view engine', 'pug');


//Set-up the connection with the database
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST || 'localhost',
    user: 'user',
    password: 'password',
    database: 'world',
    port: "3306",
});


app.get("/", (req, res) => {
    res.render('Landing');
});

app.get("/home", (req, res) => {
    res.render('Landing');
});

app.get("/about", (req, res) => {
    res.render('About');
});


app.get("/contact", (req, res) => {
    res.render('Contact');
});

app.get("/career", (req, res) => {
    res.render('Career');
});

app.get("/data", (req, res) => {
    //res.render('Blocks/Data');
    db.execute("SELECT * FROM city LIMIT 10", (err, rows, fields) => {
        console.log(`The length of cities table is: ${rows.length} rows`);
        res.render('Data', {'data':rows})
    })
});


app.listen(port, () => {
    console.log('Server Listening');
    //console.log(db);
})
