//Express
const express = require('express');
const multer = require('multer');
const upload = multer();
const app = express();

const toKb = (bytes) => (bytes / 8000).toFixed(2);

//Serve static files from /public
app.use(express.static('.', {
    setHeaders: (res, path, stat) => {
        if (path.endsWith('.wasm')) {
            res.set('Content-Type', 'application/wasm');
        }
    }
}));

app.post('/service', upload.single('fileCompressed'), (req, res) => {
    console.log('File size uploaded!', toKb(req.file.size), 'Kb');
    res.send('ok');
})

//Star server
app.listen(2222, () => console.log('Server running on port 2222!'));