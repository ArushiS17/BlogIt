const express = require("express");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/blogDB", { useNewUrlParser: true, useUnifiedTopology: true });

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

const homeStartingContent = "Hello, I am Arushi, a final year Student at Vellore Institute of Technology. Welcome to my multi-page website!";
const aboutContent = "Hello, It's Arushi!";
const contactContent = "Let's get in Touch!";
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async function(req, res) {
  try {
    const posts = await Post.find({}); // Fetch all posts from the database
    res.render("home", {
       startingContent: homeStartingContent,
       posts: posts 
      });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/about", function(req, res) {
  res.render("about", { aboutUs: aboutContent });
});

app.get("/contact", function(req, res) {
  res.render("contact", { contactUs: contactContent });
});

app.get("/compose", function(req, res) {
  res.render("compose");
});

app.post("/compose", async function(req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  try {
    await post.save(); // Save the post to the database
    res.redirect("/"); // Redirect to home page to display the new post
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/posts/:postId", async function(req, res) {
  const requestedPostId = req.params.postId;

  try {
    const post = await Post.findOne({ _id: requestedPostId });
    if (post) {
      res.render("post", {
        title: post.title,
        content: post.content
      });
    } else {
      res.status(404).send("Post not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
