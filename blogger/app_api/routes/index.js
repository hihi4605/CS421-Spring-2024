var express = require('express');
var router = express.Router();
var ctrlBlog = require('../controllers/blog');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Blogger' });
});

/* Return a list of blogs */
//router.get('/api/blogs/', ctrlBlog.blogList);

/* Return a single blog given an id */
//router.get('/api/blogs/:id',ctrlBlog.blogList);

/* Add a blog */
//router.post('/api/blogs/', ctrlBlog.blogAdd);

/* Update a blog given an id*/
//router.put('/api/blogs/:id', ctrlBlog.blogEdit);

/* Delete a blog given an id */
//router.delete('/api/blogs/:id', ctrlBlog.blogDelete);


module.exports = router;