const express = require ('express');
const fs = require ('fs');
const path = require ('path');

const app = express ();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get ('/api/notes', (req, res) => {
    fs.readFile('./db/db.json','utf8',(err,data) =>{
        if (err) throw err;
        res.json (JSON.parse(data));
    })
});
