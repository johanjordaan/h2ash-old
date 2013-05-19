module.exports = function(app) {
  this.app = app;
  
  index = function(req, res){
    res.render('index', { title: 'Express2' });
  };  
  
  this.app.get('/', this.index);
}




