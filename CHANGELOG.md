# Changelog

* **2.1.0**
    - [#55](https://github.com/joecorcoran/judge/pull/55): move confirmation validator to comfirmation field
    - [#56](https://github.com/joecorcoran/judge/pull/56): add `email_field` support
    - [#58](https://github.com/joecorcoran/judge/pull/58): add presence validation support to radio buttons
    - [#60](https://github.com/joecorcoran/judge/pull/60): support Ruby-style regex in JavaScript
* **2.0.6**
    - [#46](https://github.com/joecorcoran/judge/pull/46): remove Responders
    - [#49](https://github.com/joecorcoran/judge/pull/49): remove status check from tryClose
    - [#48](https://github.com/joecorcoran/judge/pull/48): added original value to uniqueness validations
    - [#51](https://github.com/joecorcoran/judge/pull/51): Seperate required parameters from conditional parameters
    - [#52](https://github.com/joecorcoran/judge/pull/52): Fix nested model uniqueness validation
* **2.0.5**
* **2.0.4** Better empty param handling and safer loading of engine files.
* **2.0.3** Fixed Internet Explorer XHR bug.
* **2.0.2** Fixed controller inheritance bug.
* **2.0.1** Fixed URI encoding bug.
* **2.0.0** Breaking changes. Event/queueing in the front end; uniqueness and other XHR validations.
* **1.5.0** Added interface for declaring localised messages within EachValidators, which means we can reliably pass custom messages to the client side. Some internal implementation details have been altered and underscore.js was updated.
* **1.4.0** judge.store.validate now accepts callback function too.
* **1.3.0** Validate methods now accept callbacks; judge.utils removed in favour of functions within a closure; some specs were tidied/deleted as appropriate.
* **1.2.0** Changes to the format of validator functions; improved method of including custom validators; updated dependencies; fixed RegExp flag bug.
* **1.1.0** Fixed incorrect Enumerable implementation in ValidatorCollection. Lots more internal tidying, including extraction of HTML attribute building.
* **1.0.0** Validator code extracted into classes; Form builder methods no longer require “validated_” prefix; Added judge.store.validate() shortcut method; Some minor implementation updates to judge.js; No more dummy app in tests, no more crappy Gemfile, no more Jeweler.
* **0.5.0** Error messages looked up through Rails i**18**n.
* **0.4.3** IE bug fixes: No longer checking for element type in the Watcher constructor, to avoid IE object string "quirk"; now using typeof to check for undefined properties of window.
* **0.4.2** Fixed bug introduced in the last bug fix – now globally replacing double slashes :)
* **0.4.1** Fixed slash escaping bug in judge.js RegExp converter; removed uniqueness data from data attributes to prevent judge.js from expecting a validation method.
* **0.4.0** Added new form builders.
* **0.3.1** Removed unused keys from validator options in data attributes. Include Judge::FormHelper in ApplicationHelper to avoid clash with haml aliases.
* **0.3.0** Added confirmation and acceptance validation, more form builders.
* **0.2.0** Remove jQuery dependency; refactored to include new namespace, watchers and store; added headless testing.
* **0.1.1** Removed duplicate dependencies in gemspec.
* **0.1.0** First release.