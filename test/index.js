'use strict';

var licenses = require('../lib/utils/licenses.js');
var licenz = require('../lib/index.js');
var modules = require('../lib/utils/modules.js');
var path = require('path');
var test = require('tape');

/**
 * Path to the `licenz-a` mock module. This module contains sub-modules with
 * licenses in various formats, all of which should pass.
 *
 * @type {string}
 */
var mockAPath = path.join(__dirname, 'mocks', 'licenz-a');

/**
 * Path to the `licenz-b` mock module.  This module contains sub-modules with
 * nonexistant or bad licenses. It shouldn't pass, but white-listing the edge
 * cases should allow it to pass.
 *
 * @type {string}
 */
var mockBPath = path.join(__dirname, 'mocks', 'licenz-b');

test('Passes with known licences', function(t) {
    t.plan(1);

    licenz({
        path: mockAPath,
    }, function(err, res) {
        if (err) {
            return t.end(err);
        }

        t.notOk(res.length, 'Has no bad licenses');
    });
});

test('Promise interface', function(t) {
    t.plan(1);

    licenz({ path: mockAPath })
        .then(function(res) {
            t.notOk(res.length, 'Has no bad licenses');
        })
        .catch(t.end);
});

test('Errors with unknown licenses', function(t) {
    t.plan(2);

    licenz({
        path: mockBPath,
    }, function(err, res) {
        if (err) {
            return t.end(err);
        }

        t.ok(res, 'Unknown licenses result in report');

        var expected = [{
            name: 'licenz-b-a-a',
            version: '1.0.0',
        }, {
            name: 'licenz-b-b',
            version: '1.0.0',
        }, {
            name: 'licenz-b-c',
            version: '1.0.0',
        }];
        var reported = res
            .map(function(item) {
                return {
                    name: item.name,
                    version: item.version,
                }
            })
            .sort(function(a, b) {
                return a.name > b.name;
            });

        t.deepEqual(
            reported,
            expected,
            'Reports unpermitted packages by name and version'
        );
    });
});

test('Whitelist modules', function(t) {
    t.plan(1);

    licenz({
        path: mockBPath,
        whitelistModules: {
            'licenz-b-a-a': '^1.0.0',
            'licenz-b-b': '^1.0.0',
            'licenz-b-c': '^1.0.0',
        },
    }, function(err, res) {
        if (err) {
            t.end(err);
        }

        modules._clearUserWhitelist(); // Clean up

        t.notOk(res.length, 'Filters whitelisted modules');
    });
});

test('Whitelist licences', function(t) {
    t.plan(2);

    licenz({
        path: mockBPath,
        whitelistLicenses: ['RANDO_LICENSE_DUDE'],
    }, function(err, res) {
        if (err) {
            return t.end(err);
        }

        var expectedResponse = {
            name: 'licenz-b-b',
            version: '1.0.0',
        };
        var filteredResponse = {
            name: res[0].name,
            version: res[0].version,
        };

        licenses._clearUserWhitelist(); // Clean up

        t.equal(res.length, 1, 'Filters modules with whitelisted license');
        t.deepEqual(
            filteredResponse,
            expectedResponse,
            'Reports remaining non-passing module'
        );
    });
});

test.skip('CLI passes with known licenses', function(t) {

});

test.skip('CLI errors with unknown licenses', function(t) {

});
