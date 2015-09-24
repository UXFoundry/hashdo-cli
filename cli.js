var Cli = module.exports,
  HashDoWeb = require('hashdo-web'),
  Path = require('path'),
  Program = require('commander'),
  Open = require('open'),
  YeomanEnv = require('yeoman-environment').createEnv(),
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
      HashDoWeb.start('http://localhost:' + port, port, process.cwd());
    });
    
  Program
    .command('create <template>')
    .description('Creates a new #Do pack or adds a new card using a template generator.')
    .action(function (template) {
      YeomanEnv.register(Path.join(__dirname, 'yeoman/generator-hashdo/generators/app'), 'hashdo:pack');
      YeomanEnv.register(Path.join(__dirname, 'yeoman/generator-hashdo/generators/card'), 'hashdo:card');
      
      printLogo();
      
      if (template.toLowerCase() === 'pack') {
        YeomanEnv.run('hashdo:pack', { hideGreeting: true });
      }
      else if (template.toLowerCase() === 'card') {
        YeomanEnv.run('hashdo:card', { hideGreeting: true });
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
