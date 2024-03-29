var express = require('express');
var request = require('request');
const {render } = require('../../app');
const Blog = require('../../app_api/models/blog');

var apiOptions = {
  server: "http://localhost"
};

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.home = function(req, res) {
  res.render('home', {title: 'Home Page'});
};

module.exports.blogAdd = function(req, res) {
  res.render('blogAdd', {title: 'Add Blog'});
};

module.exports.doAddBlog = function(req, res) {
  var requestOptions, path, postdata;
  path = '/api/blogs';
  postdata = {
    blogTitle: req.body.blogTitle,
    blogEntry: req.body.blogEntry
  };
  requestOptions = {
    url: apiOptions.server + path,
    method: "POST",
    json: postdata
  };
  request(requestOptions, function(err, response, body) {
    if (response.statusCode === 201) {
      res.redirect('/blog-list');
    }
  });
}

module.exports.renderEditBlog = function(req, res, blogdata) {
  res.render('blogEdit', {title: 'Edit Blog ', blog: blogdata});
};

module.exports.editBlog = function(req, res) {
  var requestOptions, path;
  path = '/api/blogs/' + req.params.id;
  requestOptions = {
    url: apiOptions.server + path,
    method: "GET",
    json: {}
  };
  request(requestOptions, function(err, response, body) {
    if (response.statusCode === 200) {
      module.exports.renderEditBlog(req, res, body);
    }
  });
};

module.exports.doBlogEdit = function(req, res) {
  console.log("Updating a blog entry with id of " + req.params.id);
  console.log(req.body);
  Blog.findByIdAndUpdate(
     req.params.id,
     { $set: { "blogEntry": req.body.blogEntry, "blogTitle": req.body.blogTitle } },
     { new: true } // to return the updated document
  )
  .then(response => {
      // Redirect to /blog-list after successfully updating the blog
      res.redirect('/blog-list');
  })
  .catch(err => {
    // Send an error response if there is any error
    sendJSONresponse(res, 400, err);
  });
};
    
module.exports.getDeleteBlog = function(req, res) {
  var requestOptions, path;
  path = '/api/blogs/' + req.params.id;
  requestOptions = {
    url: apiOptions.server + path,
    method: "GET",
    json: {}
  };

  request(requestOptions, function(err, response, body) {
    if (response.statusCode === 200) {
      // Correct reference to the renderDeleteBlog function
      module.exports.renderDeleteBlog(req, res, body);
    }
  });
}

module.exports.renderDeleteBlog = function(req, res, blogdata) {
  res.render('blogDelete', {title: 'Delete Blog', blog: blogdata});
};

module.exports.doDeleteBlog = function(req, res) {
  var requestOptions, path;
  path = '/api/blogs/' + req.params.id;
  requestOptions = {
    url: apiOptions.server + path,
    method: "DELETE",
    json: {}
  };
  request(requestOptions, function(err, response, body) {
    if (response.statusCode === 204) {
      res.redirect('/blog-list');
    }
  });
  res.redirect('/blog-list');
}
module.exports.blogDelete = function(req, res) {
  res.render('blogDelete', {title: 'Blog Delete'});
}

module.exports.blogList = function(req, res) {
  var requestOptions, path;
  path = '/api/blogs';
  requestOptions = {
    url: apiOptions.server + path,
    method: "GET",
    json: {}
  };
  request(requestOptions, function(err, response, body) {
    if (response.statusCode === 200) {
      res.render('blogList', {title: 'Blog List', blogs: body});
    }
  });
}
