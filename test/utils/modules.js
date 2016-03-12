/* eslint-disable no-var,object-shorthand,prefer-arrow-callback,prefer-template */

'use strict';

var modules = require('../../lib/utils/modules.js');
var test = require('tape');

test('Module whitelisting', function moduleWhitelisting(t) {
  var myModule = {
    'dope-module': '^1.0.0',
  };

  t.notOk(
    modules.isPermitted('dope-module', '1.0.0'),
    'New module isn’t permitted'
  );
  modules.whitelist(myModule);
  t.notOk(
    modules.isPermitted('dope-module', '0.5.0'),
    'New whitelisted module is version-checked'
  );
  t.ok(
    modules.isPermitted('dope-module', '1.0.0'),
    'Add new module to whitelist'
  );
  modules._clearUserWhitelist(); // Clean up

  t.end();
});
