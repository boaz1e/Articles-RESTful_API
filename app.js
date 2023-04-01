const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

app.set("view-engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1/wikiDB", {
  useNewUrlParser: true,
});

const articleSchema = {
  title: String,
  content: String,
};

const Article = mongoose.model("Article", articleSchema);

// Requests Targetting all Articles //

app.get("/articles", async (req, res) => {
  const foundArticles = await Article.find();
  res.send(foundArticles);
});

app.post("/articles", (req, res) => {
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content,
  });

  newArticle
    .save()
    .then(console.log("Successfully added a new article."))
    .catch((err) => console.log(err));
});

app.delete("/articles", (req, res) => {
  Article.deleteMany()
    .then(() => console.log("Successfully deleted all articles."))
    .catch((err) => console.log(err));
});

// Requests Targetting A Specific Article //

app
  .route("/articles/:articleTitle")

  .get(async (req, res) => {
    foundArticle = await Article.findOne({ title: req.params.articleTitle });
    if (foundArticle) {
      res.send(foundArticle);
    } else {
      console.log("No articles matching that title was found.");
    }
  })

  .put((req, res) => {
    Article.updateOne(
      { title: req.params.articleTitle },
      { $set: { title: req.body.title, content: req.body.content } },
      { upset: true }
    )
      .then(() => console.log("Successfully updated article."))
      .catch((err) => console.log(err));
  })

  .patch((req, res) => {
    Article.updateOne({ title: req.params.articleTitle }, { $set: req.body })
      .then(console.log("Successfully updated article."))
      .catch((err) => console.log(err));
  })

  .delete((req, res) => {
    Article.deleteOne({
      title: req.params.articleTitle,
    })
      .then(() => console.log("Successfully deleted the article."))
      .catch((err) => console.log(err));
  });

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
