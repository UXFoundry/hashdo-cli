var Cli = module.exports,
  HashDoWeb = require('hashdo-web'),
  Path = require('path'),
  FS = require('fs'),
  LiveReload = require('express-livereload'),
  Program = require('commander'),
  Open = require('open'),
  YeomanEnv = require('yeoman-environment'),
  _ = require('lodash');

Cli.run = function (processArgv) {
  
  function printLogo() {
    console.log('     __ __     ____         ');
    console.log('  __/ // /_   / __ \\  ____ ');
    console.log(' /_  _  __/  / / / / / __ \\');
    console.log('/_  _  __/  / /_/ / / /_/ / ');
    console.log(' /_//_/    /_____/  \\____/ ');
    console.log('');
    console.log('v%s', HashDoWeb.hashdo.version);
    console.log('');
  }

  Program
    .command('serve')
    .description('Starts web server to render and test #Do cards.')
    .option('-p, --port <port>', 'Use an alternate port for the web server (defaults to 4000).', parseInt)
    .action(function (options) {
      printLogo();
      
      var port = options.port || 4000;
      var baseUrl = 'http://localhost:' + port
      var firebaseUrl = 'https://hashdodemo.firebaseio.com/';
      
      HashDoWeb.init(baseUrl, firebaseUrl, port, process.cwd());
      
      // Add live reload middleware.
      LiveReload(HashDoWeb.express, { watchDir: process.cwd() });
            
      // Setup extra web end-points for testing.
      HashDoWeb.hashdo.packs.cards().forEach(function (card) {
        var packDirectory = Path.join(process.cwd(), 'hashdo-' + card.pack);
        
        // Web Hook Test Routes
        var cardTestWebHook = Path.join(packDirectory, 'test', card.card, 'webhook.js');
                
        var testHookExists = false;
        try {
          // Use this because exists will be deprecated.
          FS.statSync(cardTestWebHook);
          testHookExists = true;      
        } catch (err) {}
        
        if (testHookExists) {
          console.log('CLI: Found test web hook for %s', cardTestWebHook);
          HashDoWeb.express.get('/webhook/' + card.pack + '/' + card.card + '/test', require(cardTestWebHook).webhook);
        }
      });
      
      // Add test harness for each card.        
      HashDoWeb.express.get('/:pack/:card/test', require('./controllers/harness'));
      
      // Override the default navigation paths.
      HashDoWeb.express.get('/:pack', require('./controllers/pack'));
      HashDoWeb.express.get('/', require('./controllers/index'));
      
      HashDoWeb.start(function () {
        Open(baseUrl);
      });
    });
    
  Program
    .command('create <template>')
    .description('Creates a new #Do pack or adds a new card using a template generator.')
    .action(function (template) {
      printLogo();
      
      var yenv = YeomanEnv.createEnv();
      yenv.register(Path.join(__dirname, 'yeoman/generator-hashdo/generators/app'), 'hashdo:pack');
      yenv.register(Path.join(__dirname, 'yeoman/generator-hashdo/generators/card'), 'hashdo:card');
      
      if (template.toLowerCase() === 'pack') {
        yenv.run('hashdo:pack', { hideGreeting: true });
      }
      else if (template.toLowerCase() === 'card') {
        yenv.run('hashdo:card', { hideGreeting: true });
      }
      else {
        console.error('Oops! "%s" is an invalid template type.', template);
        console.error('  pack: Create a new pack (collection) of cards.');
        console.error('  card: Create a new card and add it to an existing pack.');
      }      
    });
  
  Program.parse(processArgv);
  
  // Display help by default if nothing passed in.
  if (!process.argv.slice(2).length) {
    Program.outputHelp();
  }
};
