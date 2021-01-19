const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//My sql
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "",
  database: "nodejs_beers"
});

//Get all beers
app.get("", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log(`Connected as id ${connection.threadId}`)
    
    connection.query("SELECT * from beers", (err, rows) => {
      connection.release(); //Return the connection to pool

      if (!err) {
        res.send(rows);
      } else {
        console.log(err);
      }

    });
  })
});

//Get a single beer by id
app.get("/:id", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log(`Connected as id ${connection.threadId}`);
    
    connection.query("SELECT * from beers WHERE id = ?", [req.params.id], (err, rows) => {
      connection.release(); //Return the connection to pool

      if (!err) {
        res.send(rows);
      } else {
        console.log(err);
      }

    });
  })
});

//Delete a record / beer by id
//Do not forget JSON setting on POSTMAN
app.delete("/:id", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log(`Connected as id ${connection.threadId}`);
    
    connection.query("DELETE from beers WHERE id = ?", [req.params.id], (err, rows) => {
      connection.release(); //Return the connection to pool

      if (!err) {
        res.send(`The record with the id: ${req.params.id} has been deleted.`);
      } else {
        console.log(err);
      }

    });
  })
});

//Add a beer
app.post("", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log(`Connected as id ${connection.threadId}`);

    const params = req.body;
    
    connection.query("INSERT INTO beers SET ?", params, (err, rows) => {
      connection.release(); //Return the connection to pool

      if (!err) {
        res.send(`The record with the name: ${params.name} has been added.`);
      } else {
        console.log(err);
      }

    });
    console.log(req.body);
  })
});

//Update a beer 
app.put("/:id", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log(`Connected as id ${connection.threadId}`);

    const { id, name, tagline, description } = req.body;
    
    connection.query("UPDATE beers SET name = ?, tagline = ? WHERE id = ?", [name, tagline, id], (err, rows) => {
      connection.release(); //Return the connection to pool

      if (!err) {
        res.send(`The record with the name: ${name} has been updated.`);
      } else {
        console.log(err);
      }

    });
    console.log(req.body);
  })
} );

//Listen on env or 5000
app.listen(port, () => console.log(`Listening on port ${port}`));