var page = new WebPage();
page.open(phantom.args[0], function(status) {
  if (status !== 'success') {
    console.log('Cannot open Jasmine server page');
    phantom.exit();
  } else {
    window.setTimeout(function () {
      var result = page.evaluate(function() {
        var desc = document.querySelector('.runner .description').innerHTML;
        if (document.querySelector('.runner.failed')) {
          var failed   = document.querySelectorAll('.spec.failed'),
              failMsgs = [],
              output   = '';
          for (var i = 0, l = failed.length; i < l; i += 1) {
            var msg = '  - ' + failed[i].querySelector('.description').title + ' (' + failed[i].querySelector('.messages .resultMessage').innerHTML + ')';
            failMsgs.push(msg);
          };
          output = '\n' + failMsgs.length + ' specs failed:\n\n' + failMsgs.join('\n') + '\n\n' + desc;
          return { msg:output, code:1 };
        } else {
          return { msg:desc, code:0 };
        };
      });
      console.log(result.msg);
      phantom.exit(result.code);
    }, 400);
  };
});
