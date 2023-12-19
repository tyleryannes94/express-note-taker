const express = require ('express');
const fs = require ('fs');
const path = require ('path');
const { v4: uuidv4 } = require('uuid');

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

app.post ('api/notes', (req,res) => {
    const newNote = {...req.body, id: uuidv4()};
    fs.readFile('./db/db.json', 'utf8', (err,data)=> {
        if (err) throw err;
        const notes = JSON.parse(data);
        notes.push(newNote);
        fs.writeFile('.db/db.json', JSON.stringify(notes), (err))=> {
            if (err) throw err;
            res.json(newNote);
        }
    })
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
})

app.get ('*', (req,res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen (PORT, ()=> console.log(`Server is listening on ${PORT}.`));