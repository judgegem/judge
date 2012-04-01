var casper    = require('casper').create(),
    path      = casper.cli.args[0],
    colorizer = require('colorizer').create(),
    data;

casper
  .start(path)
  .then(function() {
    this.waitForSelector('.finished-at', function() {
      data = this.evaluate(readResults);
    });
  })
  .run(function() {
    this.echo(fmtTitle(data.desc, data.status));
    if (data.messages.length > 0) {
      this.echo(data.messages.join('\n\n') + '\n', colorType(data.status));
    }
    this.exit(data.status);
  });

var readResults = function() {
  var desc   = document.querySelector('.runner .description').innerHTML,
      msgs   = [],
      status = 0;
  if (document.querySelector('.runner.failed')) {
    var f = document.querySelectorAll('.spec.failed');
    for (var i = 0, l = f.length; i < l; i += 1) {
      var msg = '  ' + (i + 1) + '. '
                + f[i].querySelector('.description').title
                + ' (' + f[i].querySelector('.messages .resultMessage').innerHTML + ')';
      msgs.push(msg);
    };
    status = 1;
  };
  return { desc: desc, messages: msgs, status: status };
};

var fmtTitle = function(string, status) {
  var fail = (status === 1);
  string = colorizer.format(string, {
    fg: (fail ? 'red' : 'green'),
    bold: true,
    underscore: !!fail
  });
  string = '\n' + string + '\n';
  return string;
};

var colorType = function(status) {
  return (status === 1) ? 'WARNING' : 'INFO';
};
