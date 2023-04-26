
/* Import dependencies */
import express from "express";
import path from "path";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import DatabaseController from "./Controller/Database.mjs";
import session from "express-session";
import alert from "alert";

// const express = require("express");
// const mysql = require("mysql2");
//const path = require("path");
const app = express();
const port = 3000;

/* Add form data middleware */
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "verysecretkey",
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: false,
        expires: 60000
    },
  })
);

// Deny access ot 'Views' folder
//app.use(express.static(path.join(__dirname, '/Images')));
// Integrate pug with express
app.set('views', './app/views');
app.set('view engine', 'pug');

// Serve assets from 'static' folder
app.use(express.static("Images"));

//Set-up the connection with the database
const db = await DatabaseController.connect()
const { conn } = db

//--------> Get
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

app.get("/login", (req, res) => {
    if(req.session.loggedIn || !req.session.cookie.expires) {
        req.session.destroy();
        res.render('Landing');
    } else {
        res.render('LogIn');
    }
    
});
app.get("/register", (req, res) => {
  if(req.session.loggedIn || !req.session.cookie.expires) {
    res.render('Landing');
  } else {
      res.render('Register');
  }
    
});


app.get("/crud", async (req, res) => {
    if(req.session.loggedIn || !req.session.cookie.expires) {
      if(req.session.userRole == "admin") {
        const [rows, fields] = await db.getCountries();
        res.render('Crud', {'data':rows});
      } else {
        return res.status(401).send("Access denied!");
      }

    } else {
        return res.status(401).send("User not logged in");
    }

});

app.get("/data", async (req, res) => {
    const [rows, fields] = await db.getCities();
    res.render('Data', {'data':rows});
});



app.get("/updateCoutry/:Name", async (req, res) => {
    if(req.session.loggedIn || !req.session.cookie.expires) {
        const countryName = req.params.Name;
        const data = await db.getCounty(countryName);
        res.render('UpdateCountry', {'data':data[0][0]});
    } else {
        return res.status(401).send("User not logged in");
    }
  });


app.get("/deleteCoutry/:Name", async (req, res) => {
    if(req.session.loggedIn || !req.session.cookie.expires) {
        const countryName = req.params.Name;
        const r = await db.deleteCountry(countryName);
        console.log(r);
        const [rows, fields] = await db.getCountries();
        return res.redirect("/crud");
    } else {
        return res.status(401).send("User not logged in");
    }
  });


//--------> Post method
// Register 
app.post("/api/register", async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    try {
      const sql = `INSERT INTO person (firstName, lastName, email, role, password) VALUES ('${firstName}', '${lastName}', '${email}', 'user', '${hashed}')`;
      const [result, _] = await conn.execute(sql);
      console.log(result);
      console.log("Done!");
      return res.redirect("/login");
    } catch (err) {
      console.error(err);
      return res.status(400).send(err.sqlMessage);
    }
  });

// Update country
  app.post("/api/UpdateCountry", async (req, res) => {
    const { Name, Continent, Region, Population } = req.body;
    const popInt = parseInt(Population);
    try {
      const sql = `UPDATE country SET Continent='${Continent}', Region='${Region}', Population=${popInt} WHERE Name='${Name}';`;
      const data = await conn.execute(sql);
      console.log("Update");
      console.log(data);
      return res.redirect("/crud");
    } catch (err) {
      console.error(err);
      return res.status(400).send(err.sqlMessage);
    }
  });



// Login 
app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(401).send("Missing credentials");
    }
  
    const sql = `SELECT id, role, password FROM person WHERE email = '${email}'`;
    const [results, cols] = await conn.execute(sql);
  
    const user = results[0];
  
    if (!user) {
      return res.status(401).send("User does not exist!");
    }
  
    const { id, role } = user;
    console.log(user);
    const hash = user?.password;
    console.log("Hash Password: ");
    console.log(hash);
    const match = await bcrypt.compare(password, hash);
  
    if (!match) {
      return res.status(401).send("Invalid password");
    }
  
    req.session.loggedIn = true;
    req.session.userId = id;
    req.session.userRole = role;
  
    return res.redirect("/home");
  });

  // Search Country 
app.post("/api/searchC", async (req, res) => {
    const { countryName } = req.body;
    console.log(countryName);
    const [rows, fields] = await db.getCountriesStartWith(countryName);
    res.render('Crud', {'data':rows});
});

app.listen(port, () => {
    console.log('Server Listening');
    //console.log(db);
});


