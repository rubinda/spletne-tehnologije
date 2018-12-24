const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const chalk = require('chalk');
const spdy = require('spdy');
const fs = require('fs');

const models = require('./models');

const app = express();

// Parssaj JSON iz telesa in URL encoded vrednosti
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Uporabi morgana za belezenje zahtevkov
app.use(morgan('dev'));

// Povezi se  na podatkovno bazo in preveri ali
// imamo uspesno povezavo na podatkovno bazo
mongoose.connect('mongodb://localhost/student-forum', { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, chalk.red('Napaka na povezavi :(')));
db.once('open', () => {
    console.log(chalk.greenBright('Povezan'), 'z bazo studentskega foruma', chalk.yellowBright(':)'));
});

// Povej NodeJS naj parsa EJS polja
app.set('view engine', 'ejs');
// Registriraj vire
// Home stran, prikazuje vsa vprasanja
app.get('/', async (req, res, next) => {
    // Pridobi vprasanja in populiraj komentarje zanje
    const questions = await models.Question.find({}).populate('comments').sort({ createdAt: -1 });
    return res.render('pages/index', {
        questions,
    });
});

// Vir na katerega se posilja nove komentarje
app.post('/comment', async (req, res, next) => {
    const { author, message, questionId } = req.body;
    // Preveri ali so podana polja nenicelna
    if (!author || !message || !questionId) return res.status(400).send('Prosim podajte paramtere');
    const createdAt = Date.now();
    const newComment = new models.Comment({
        author,
        message,
        createdAt,
    });
    newComment.save();
    await models.Question.findOneAndUpdate({ _id: questionId },
        {
            $push: {
                comments: newComment,
            },
        });
    return res.redirect('back');
});

// Vir na katerem lahko dodamo novo vprasanje
app.get('/questions/new', (req, res, next) => {
    res.render('pages/new-question');
});

// Vir, ki iz prejetih podatkov generira
app.post('/questions', (req, res, next) => {
    const { author, question } = req.body;
    const createdAt = Date.now();
    const newQuestion = new models.Question({
        author,
        question,
        createdAt,
    });
    newQuestion.save();
    res.redirect('/');
});
// Izpise sporocilo da streznik tece ob zagonu
function onListening() {
    const addr = this.address();
    const bind = typeof addr === 'string'
        ? `${addr}`
        : `localhost:${addr.port}`;
    console.log('Server listening on', chalk.blue(`https://${bind}`));
}
// Kljuc in certifikat za SSL
const options = {
    key: fs.readFileSync(`${__dirname}/config/server.key`),
    cert: fs.readFileSync(`${__dirname}/config/server.cert`),
};
// Ustvari streznik in ga zazeni na podanem portu (3000 default)
const server = spdy.createServer(options, app);
server.listen(process.env.port || '8080');
server.on('listening', onListening);

module.exports = app;
