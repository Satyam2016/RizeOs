const Post = require("../models/Post");

exports.createFeedPost = async (req, res) => {
  try {
    console.log("post api trigerred")
    const  postData = req.body;
    console.log(postData)
    const userId = req.user.id;
    const newPost = new Post({
      author: userId,
      content: {text : postData.content},
      type: postData.type,
      tags: postData.tags,
      visibility: postData.visibility,
    });


    const savedPost = await newPost.save();
    const posts = await Post.find().populate("author");
    console.log("author" , posts)
    console.log(posts.profile)
    res.status(201).json({posts, savedPost});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create post" });
  }
}

exports.getFeedPosts = async (req, res) => {
  try {
    const posts = await Post.find({ visibility: "public" }).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch feed" });
  }
};
