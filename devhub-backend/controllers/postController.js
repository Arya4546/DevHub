const Post = require("../models/Post");

// ✅ CREATE NEW POST
exports.createPost = async (req, res) => {
  const { caption, privacy } = req.body;
  const userId = req.user.id;

  try {
    let imageUrl = null;
    let videoUrl = null;

    // If a file was uploaded (handled by multer)
    if (req.file) {
      const mime = req.file.mimetype;
      if (mime.startsWith("image/")) {
        imageUrl = `/uploads/${req.file.filename}`;
      } else if (mime.startsWith("video/")) {
        videoUrl = `/uploads/${req.file.filename}`;
      }
    }

    const newPost = await Post.create({
      user: userId,
      caption,
      imageUrl,
      videoUrl,
      privacy,
    });

    const populatedPost = await newPost.populate("user", "name");

    req.app.get("io").emit("new_post", populatedPost);

    res.status(201).json({
      message: "Post created",
      post: populatedPost,
    });
  } catch (err) {
    console.error("Create Post Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ GET ALL PUBLIC POSTS
exports.getPublicPosts = async (req, res) => {
  try {
    const posts = await Post.find({ privacy: "public" })
      .populate("user", "name email")
      .populate("comments.user", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (err) {
    console.error("Get Public Posts Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ REACT TO POST
exports.reactToPost = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const alreadyReacted = post.reactions.includes(userId);

    if (alreadyReacted) {
      post.reactions.pull(userId);
    } else {
      post.reactions.push(userId);
    }

    await post.save();

    req.app.get("io").emit("new_reaction", { postId, userId });

    res.status(200).json({
      message: alreadyReacted ? "Reaction removed" : "Post liked",
      reactions: post.reactions,
    });
  } catch (err) {
    console.error("React To Post Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ ADD COMMENT TO POST (fixed to populate)
exports.addComment = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;
  const { text } = req.body;

  if (!text) return res.status(400).json({ message: "Comment text is required" });

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = { user: userId, text };
    post.comments.push(comment);
    await post.save();

    // Populate the newly added comment only
    const populatedPost = await Post.findById(postId).populate("comments.user", "name");
    const newComment = populatedPost.comments[populatedPost.comments.length - 1];

    req.app.get("io").emit("new_comment", { postId, comment: newComment });

    res.status(201).json({
      message: "Comment added",
      comment: newComment,
    });
  } catch (err) {
    console.error("Add Comment Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ GET COMMENTS FOR POST
exports.getComments = async (req, res) => {
  const postId = req.params.id;

  try {
    const post = await Post.findById(postId).populate("comments.user", "name");
    if (!post) return res.status(404).json({ message: "Post not found" });

    res.status(200).json({
      comments: post.comments,
    });
  } catch (err) {
    console.error("Get Comments Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
