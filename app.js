const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');
const url = 'mongodb://127.0.0.1:27017/wikiDB';
const port = process.env.PORT ? process.env.PORT : 3000 ;

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(`${__dirname}/public`));

app.set('view engine', 'ejs');

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});

const articleSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: String,
    createdAt: {
        type: Date,
        defalut: Date.now
    }
});

const Article = mongoose.model('Article', articleSchema);

app.route('/articles')
    .get((req, res) => {
        Article.find((err, results) => {
            if(!err) {
                res.send(results);
            } else {
                res.send(err);
            }
        });
    })
    .post((req, res) => {

        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });

        newArticle.save((err) => {
            if(!err) {
                res.send('Successfully added one new article!');
            } else {
                res.send(err);
            } 
        });
    })
    .delete((req, res) => {
        Article.deleteMany((err) => {
            if(!err) {
                res.send('All articles deleted successfully');
            } else {
                res.send(err);
            }
        });
    });

app.route('/articles/:article')
    .get((req, res) => {
        Article.findOne({title: req.params.article}, (err, result) => {
            if(result) {
                res.send(result);
            } else {
                res.send(`No articles were found matching ${req.params.article}`);
            }
        });
    })
    .put((req, res) => {
        Article.updateOne(
            {title: req.params.article},
            {title: req.body.title, content: req.body.content},
            {upsert: true},
            (err) => {
                if(!err) {
                    res.send(`Successfully updated the document ${req.params.article}`);
                } else {
                    res.send(err);
                }
            });
    })
    .patch((req, res) => {
        Article.update(
            {title: req.params.article},
            {$set: req.body},
            (err) => {
                if(!err) {
                    res.send(`Successfully updated the article`);
                } else {
                    res.send(err);
                }
            }
        )
    })
    .delete((req, res) => {
        Article.deleteOne({title: req.params.article}, (err) => {
            if(!err) {
                res.send(`Successfully deleted the article on ${req.params.article}`);
            } else {
                res.send(err);
            }
        });
    });






app.listen(port, () => {
    console.log(`app is listening on port ${port}`)
});