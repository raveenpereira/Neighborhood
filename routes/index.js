
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('profile', { data: 'swarna' });
};