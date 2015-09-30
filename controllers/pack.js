var HashDoWeb = require('hashdo-web'),
  Handlebars = require('handlebars'),
  FS = require('fs'),
  Path = require('path'),
  _ = require('lodash');
  
module.exports = function (req, res) {
  var template = Handlebars.compile(FS.readFileSync(Path.join(__dirname, '../templates/cards.hbs')).toString());
  var html = template(_.filter(HashDoWeb.hashdo.packs.cards(), 'pack', req.params.pack));
  
  res.status(200);
  res.send(html);
};

