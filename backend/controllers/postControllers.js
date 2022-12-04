const Post = require("../models/Post");
const User = require("../models/User");

exports.createPost = async (req, res) => {
  try {
    const post = await new Post(req.body).save();
    await post.populate("user", "first_name last_name username picture");
    res.json(post);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
exports.getAllPost = async (req, res) => {
  try {
    const followingTmp = await User.findById(req.user.id).select("following");
    const following = followingTmp.following;
    const promises = following.map((user) => {
      return Post.find({ user: user,"reports.reportBy":{$ne:req.user.id},removed:{$ne:true} })
        .populate("user", "first_name last_name username picture")
        .populate("comments.commentBy", "first_name last_name username picture")
        .sort({ createdAt: -1 });
    });
    const followingPosts = (await Promise.all(promises)).flat();
    const userPosts = await Post.find({ user: req.user.id ,removed:{$ne:true} })
      .populate("user", "first_name last_name username picture")
      .populate("comments.commentBy", "first_name last_name username picture")
      .sort({ createdAt: -1 });
    followingPosts.push(...[...userPosts]);
    followingPosts.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });
    res.json(followingPosts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
exports.comment = async (req, res) => {
  try {
    const { comment, image, postId } = req.body;
    let newComment = await Post.findByIdAndUpdate(
      postId,
      {
        $push: {
          comments: {
            comment: comment,
            image: image,
            commentBy: req.user.id,
            commentAt: new Date(),
          },
        },
      },
      {
        new: true,
      }
    ).populate("comments.commentBy", "first_name last_name picture username");
    res.json(newComment.comments);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
exports.savePost = async (req,res) => {
  try {
    const postId = req.params.id;
    const user = await User.findById(req.user.id);
    const check = user?.savedPosts.find(
      (post) => post.post.toString() === postId
    );
    if (check) {
      await User.findByIdAndUpdate(req.user.id, {
        $pull: {
          savedPosts: {
            _id:check._id, 
          },
        },
      });
    } else {
      await User.findByIdAndUpdate(req.user.id, {
        $push: {
          savedPosts: {
            post: postId,
            savedAt: new Date(),
          },
        },
      });
    }
    res.json("ok")
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
exports.deletePost=async(req,res)=>{
  try {
    await Post.findByIdAndUpdate(req.params.id,{$set:{removed:true}})
    res.json({status:"ok"})
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}