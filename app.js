const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser"); //JSON Parseとかするやつ
const exphbs = require('express-handlebars');

const app = express();
const port = process.env.PORT || 5000;

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
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
    
    connection.query("SELECT * from beers", (err, beers) => {
      connection.release(); //Return the connection to pool
      //htmlに表示したい
      if (!err) {
        res.render("index", {
          title: "Beer App",
          beers
        })
      } else {
        console.log(err);
      }
    });
  })
});

//Get a single beer by id
app.get("/detail/:id", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log(`Connected as id ${connection.threadId}`);
    
    connection.query("SELECT * from beers WHERE id = ?", [req.params.id], (err, beer) => {
      connection.release(); //Return the connection to pool

      if (!err) {
        // console.log(beer);
        res.render("detail", {
          beer
        })
      } else {
        console.log(err);
      }

    });
  })
});

//Delete a record / beer by id
//Do not forget JSON setting on POSTMAN
app.get("/delete/:id", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log(`Connected as id ${connection.threadId}`);
    
    const id = req.params.id;
    //削除するビール名を取得したい
    // connection.query("SELECT * from beers WHERE id = ?", [id], (err, beer) => {
    //   if (err) throw err;
    // })
    
    connection.query("DELETE from beers WHERE id = ?", [id], (err, rows) => {
      connection.release(); //Return the connection to pool
      
      if (!err) {
        // res.send(`The record with the id: ${req.params.id} has been deleted.`);
        res.render("delete", {
          id
          // name : beerName
        })
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
    if (!params.name || !params.tagline || !params.description) {
          return res.status(400).json({ msg: "Please include a name, tagline and description" });
          //returnつければelseで書かなくてもいいheader already sentが出てこないようになる
    }

    connection.query("INSERT INTO beers SET ?", params, (err, rows) => {
      // connection.release(); //Return the connection to pool
      if (!err) {
        // res.send(`The record with the name: ${params.name} has been added.`)
        connection.query("SELECT * from beers", (err, beers) => {
          connection.release();
          if (err) throw err;
          res.render("index", {
            title : "Beer App",
            beers
          });
        });
      } else {
        console.log(err);
      }

    });
    // console.log(req.body);
  })
});

//Update a beer 
app.get("/edit/:id", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log(`Connected as id ${connection.threadId}`);

    const id = req.params.id;
    
    connection.query("SELECT * FROM beers WHERE id = ?", [id], (err, beer) => {
      connection.release(); //Return the connection to pool

      if (!err) {
        res.render("edit", {
          beer
        });
      } else {
        console.log(err);
      }
    });
    // console.log(req.body);
  })
});

app.put("/update/:id", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log(`Connected as id ${connection.threadId}`);

    const { id, name, tagline, description } = req.body;
    
    connection.query("UPDATE beers SET name = ?, tagline = ?, description = ?, WHERE id = ?", [name, tagline, description, id], (err, rows) => {
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