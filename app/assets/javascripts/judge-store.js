// Judge 1.5.0
// (c) 2011–2012 Joe Corcoran
// http://raw.github.com/joecorcoran/judge/master/LICENSE.txt
// This is judge-store.js, a storage extension to judge-core.js.
// You can find the Judge gem API documentation at <http://joecorcoran.github.com/judge/>.

/*jshint curly: true, evil: true, newcap: true, noarg: true, strict: false */
/*global window: false, _: false, JSON: false */ 

(function() {

  var root  = this,
      judge = root.judge,
      util  = judge.util;

  // The judge store is now open :)
  judge.store = (function() {
    
    var store = {};

    return {

      // Stores watcher(s) for element(s) against a user defined key.
      save: function(key, element) {
        var elements = util.isCollection(element) ? element : [element];
        _(elements).each(function(element) {
          if (!_(store).has(key)) { store[key] = []; }
          var watchedInstance = new judge.Watcher(element),
              currentStored   = _(store[key]).pluck('element');
          if (!_(currentStored).include(element)) {
            store[key].push(watchedInstance);
          }
        });
        return store;
      },

      // Removes stored watcher(s).
      remove: function(key, element) {
        if (!_(store).has(key)) { return null; }
        var elements = util.isCollection(element) ? element : [element];
        store[key] = _(store[key]).reject(function(j) { return _(elements).include(j.element); });
        if (store[key].length === 0) {
          delete store[key];
        }
        return store[key];
      },

      // Returns the entire store object, or an array of watchers stored against
      // the given key.
      get: function(key) {
        if (_(key).isUndefined()) { return store; }
        return _(store).has(key) ? store[key] : null;
      },

      // Returns the entire store object with watchers converted to elements, 
      // or all DOM elements stored within all watchers stored against the given key.
      getDOM: function(key) {
        if (_(key).isUndefined()) {
          var convertedStore = {};
          _(store).each(function(array, key) {
            convertedStore[key] = _(array).pluck('element');
          });
          return convertedStore;
        }
        return _(store).has(key) ? _(store[key]).pluck('element') : null;
      },

      // Shortcut for `judge.validate(judge.store.getDOM(key));`.
      // Returns null if no stored elements are found for the given key.
      validate: function(key, callback) {
        var elements = judge.store.getDOM(key);
        return (key && !_(elements).isNull()) ? judge.validate(elements, callback) : null;
      },

      // Wipes the entire store object, or wipes all watchers stored against 
      // the given key.
      clear: function(key) {
        if (_(key).isUndefined()) {
          store = {};
        } else {
          if (!_(store).has(key)) { return null; }
          delete store[key];
        }
        return store;
      }

    };
  })();

}).call(this);