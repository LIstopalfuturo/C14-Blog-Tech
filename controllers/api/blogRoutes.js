const router = require('express').Router();
const { BlogPost } = require('../../models');
const withAuth = require('../../utils/auth');

router.post('/', withAuth, async (req, res) => {
  try {
    const newPost = await BlogPost.create({
      title: req.body.title,
      content: req.body.content,
      user_id: req.session.user_id,
    });

    res.status(200).json(newPost);
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(400).json({ message: 'Failed to create blog post', error: err.message });
  }
});

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

    await post.update({
      title: req.body.title,
      content: req.body.content,
    });

    res.status(200).json(post);
  } catch (err) {
    console.error('Error updating post:', err);
    res.status(500).json({ message: 'Failed to update post', error: err.message });
  }
});

module.exports = router; 