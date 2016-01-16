'use strict';

var licenz = require('../lib/index.js');
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
    t.plan(2);

    var promise = licenz({
        path: mockAPath,
    }, function(err, res) {
        if (err) {
            return t.end(err);
        }

        t.notOk(Object.keys(res).length, 'Has no results (callback)');
    });

    promise
        .then(function(res) {
            t.notOk(Object.keys(res).length, 'Has no results (promise)');
        })
        .catch(t.end);
});

test.skip('Errors with unknown licenses', function(t) {
    t.plan(1);

    licenz({
        path: mockBPath,
    }, function(err, res) {
        if (!err) {
            return t.fail('Unknown licenses didn\'t cause error');
        }

        t.ok(res);
    });

    //TODO: test Reports unknown licenses
    //TODO: test Shows bad packages' names and versions
});

test('Whitelist packages', function(t) {
    t.plan(1);

    licenz({
        path: mockBPath,
    }, function(err, res) {
        if (err) {
            t.end(err);
        }

        t.ok(res);
    });
});

test('Whitelist licences', function(t) {
    t.plan(1);

    licenz({
        licenses: ['RANDO_LICENSE_DUDE'],
        path: mockBPath,
    }, function(err, res) {
        if (err) {
            t.end(err);
        }

        t.ok(res);
    });
});

test.skip('CLI passes with known licenses', function(t) {

});

test.skip('CLI errors with unknown licenses', function(t) {

});
