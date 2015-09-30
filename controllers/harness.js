var Handlebars = require('handlebars'),
  FS = require('fs'),
  Path = require('path');

module.exports = function (req, res) {
  var template = Handlebars.compile(FS.readFileSync(Path.join(__dirname, '../templates/harness.hbs')).toString());
  var html = template({
    packName: req.params.pack,
    cardName: req.params.card,
    card: require(Path.join(process.cwd(), 'hashdo-' + req.params.pack, req.params.card + '.js'))
  });
  
  res.status(200);
  res.send(html);
};

