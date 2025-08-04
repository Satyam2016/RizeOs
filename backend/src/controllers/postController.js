const Post = require("../models/Post");

exports.createFeedPost = async (req, res) => {
  try {
    const  postData = req.body;
    const userId = req.user.id;
    const newPost = new Post({
      author: userId,
      content: {text : postData.content},
      type: postData.type,
      tags: postData.tags,
      visibility: postData.visibility,
    });

    const savedPost = await newPost.save();
   const posts = await Post.find().populate("author").lean();

    res.status(201).json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create post" });
  }
}

exports.getFeedPosts = async (req, res) => {
  try {
     const userId = req.user.id;
     const posts = await Post.find().populate("author")
   
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch feed" });
  }
};
