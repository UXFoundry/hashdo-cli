'use strict';
var Yeoman = require('yeoman-generator'),
  Path = require('path'),
  _ = require('lodash');

module.exports = Yeoman.generators.Base.extend({  
  constructor: function () {
    Yeoman.generators.Base.apply(this, arguments);
    this.option('hideGreeting', { type: Boolean, defaults: false, hide: true });
  },
  
  prompting: function () {
    // Have Yeoman greet the user.
    if (!this.options.hideGreeting) {
      var Chalk = require('chalk'),
        YoSay = require('yosay');
        
      this.log(YoSay('Welcome to the top-notch ' + Chalk.red('#Do Card Pack') + ' generator!'));
    }

    var questions = [{
      type: 'input',
      name: 'packName',
      message: 'What is the name of your card collection (card pack)?',
      default: 'Demo Pack',
      filter: function (val) { return val.replace(/hashdo-/i, ''); }
    }, {
      type: 'input',
      name: 'packDesc',
      message: 'Please provide a description for you card collection?',      
      filter: function (value) { return value.replace(/'/g, '\\\'') },
      default: 'My demonstration #Do card pack.'
    }];

    return this.prompt(questions).then(function (answers) {
      this.answers = answers;
      this.answers.camelCasePackName = 'hashdo-' + _.camelCase(answers.packName);
    }.bind(this));
  },

  writing: {
    app: function () {
      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath(this.answers.camelCasePackName + '/package.json'),
        this.answers
      );
    }
  },

  install: function () {    
    process.chdir(Path.join(process.cwd(), this.answers.camelCasePackName));
    
    this.npmInstall();
  }
});
