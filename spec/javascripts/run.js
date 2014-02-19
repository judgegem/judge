var system = require('system'),
    page = require('webpage').create();

page.onConsoleMessage = function(msg) {
  console.log(msg);
};

page.open('http://localhost:' + system.args[1] + '/spec/javascripts/index.html', function(status) {
  if (status !== 'success') {
    console.log('Page status:', status);
    phantom.exit(1);
  }

  page.evaluate(function() {
    var env = jasmine.getEnv();
    window.reporter = new jasmine.TapReporter();
    env.addReporter(reporter);
    env.execute();
  });

  var wait = setInterval(function() {
    var report = page.evaluate(function() {
      return [
        window.reporter.finished,
        window.reporter.passed_specs,
        window.reporter.executed_specs
      ];
    });
    if (report[0]) {
      clearInterval(wait);
      var didPass = report[1] === report[2], exitCode = didPass ? 0 : 1;
      console.log('Exiting with status', exitCode);
      phantom.exit(exitCode);
    }
  }, 250);
});
