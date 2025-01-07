const router = require('express').Router();
const { BlogPost, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  try {
    const blogPostData = await BlogPost.findAll({
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
      order: [['date_created', 'DESC']],
    });

    const posts = blogPostData.map((post) => post.get({ plain: true }));

    res.render('homepage', { 
      posts, 
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/post/:id', async (req, res) => {
  try {
    const postData = await BlogPost.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['name'],
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ['name'],
            },
          ],
        },
      ],
    });

    if (!postData) {
      res.status(404).redirect('/');
      return;
    }

    const post = postData.get({ plain: true });
    const canEdit = req.session.user_id === post.user_id;

    res.render('post', {
      ...post,
      logged_in: req.session.logged_in,
      canEdit,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/dashboard', withAuth, async (req, res) => {
  try {
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: BlogPost }],
    });

    const user = userData.get({ plain: true });

    res.render('dashboard', {
      ...user,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/new-post', withAuth, (req, res) => {
  res.render('new-post', {
    logged_in: true
  });
});

router.get('/edit-post/:id', withAuth, async (req, res) => {
  try {
    const postData = await BlogPost.findByPk(req.params.id);
    
    if (!postData) {
      res.status(404).redirect('/dashboard');
      return;
    }

    const post = postData.get({ plain: true });

    if (post.user_id !== req.session.user_id) {
      res.redirect('/dashboard');
      return;
    }

    res.render('edit-post', {
      ...post,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }
  res.render('login');
});

router.get('/signup', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }
  res.render('signup');
});

module.exports = router;
