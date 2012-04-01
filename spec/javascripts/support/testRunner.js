var casper = require('casper').create(),
    path   = casper.cli.args[0],
    data;

casper
  .start(path)
  .then(function() {
    this.waitForSelector('.finished-at', function() {
      data = this.evaluate(readResults);
    });
  })
  .run(function() {
    this.echo(data.desc);
    if (data.messages.length > 0) {
      this.echo(data.messages.join('\n'));
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
      var msg = message(
        f[i].querySelector('.description').title,
        f[i].querySelector('.messages .resultMessage').innerHTML
      );
      msgs.push(msg);
    };
    status = 1;
  };
  return { desc: desc, messages: msgs, status: status };
};

var message = function(title, message) {
  return '  - ' + title + ': ' + message;
};
