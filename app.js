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

app.post('/api/notes', (req, res) => {
    const newNote = { ...req.body, id: uuidv4() };
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) throw err;
        const notes = JSON.parse(data);
        notes.push(newNote);
        fs.writeFile('./db/db.json', JSON.stringify(notes), (err) => {
            if (err) throw err;
            res.json(newNote);
        });
    });
});

app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) throw err;
        let notes = JSON.parse(data);
        notes = notes.filter(note => note.id !== noteId);
        fs.writeFile('./db/db.json', JSON.stringify(notes), (err) => {
            if (err) {
                res.status(500).send('Error deleting the note.');
            } else {
                res.send('Note deleted successfully.');
            }
        });
    });
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'));
})

app.get ('*', (req,res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen (PORT, ()=> console.log(`Server is listening on ${PORT}.`));