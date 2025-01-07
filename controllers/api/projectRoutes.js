const router = require('express').Router();
const { BlogPost, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// Create new post
router.post('/', withAuth, async (req, res) => {
  try {
    const newPost = await BlogPost.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(newPost);
  } catch (err) {
    res.status(400).json(err);
  }
});

// Update post
router.put('/:id', withAuth, async (req, res) => {
  try {
    const post = await BlogPost.findByPk(req.params.id);
    
    if (!post) {
      res.status(404).json({ message: 'No post found with this id!' });
      return;
    }

    if (post.user_id !== req.session.user_id) {
      res.status(403).json({ message: 'You can only edit your own posts!' });
      return;
    }

    await BlogPost.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({ message: 'Post updated successfully!' });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete post
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const post = await BlogPost.findByPk(req.params.id);
    
    if (!post) {
      res.status(404).json({ message: 'No post found with this id!' });
      return;
    }

    if (post.user_id !== req.session.user_id) {
      res.status(403).json({ message: 'You can only delete your own posts!' });
      return;
    }

    await post.destroy();

    res.status(200).json({ message: 'Post deleted successfully!' });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Add comment to post
router.post('/:id/comments', withAuth, async (req, res) => {
  try {
    const newComment = await Comment.create({
      ...req.body,
      post_id: req.params.id,
      user_id: req.session.user_id,
    });

    res.status(200).json(newComment);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
