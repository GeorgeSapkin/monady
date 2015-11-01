'use strict'

const assert = require('assert');
const co     = require('co');
const R      = require('ramda');

const F = require('..');

describe('Some co', function(){
    describe('RejectWhen', () => {
        const rejectWhenNothing = R.curry(F.rejectWhen)(
            val => val === F.nothing,
            ()  => new Error('value rejected'));

        describe('when not nothing', () => {
            it('should return same value', () => {
                return co(function* () {
                    return rejectWhenNothing(F.maybe(5));
                }).then(
                    val => assert.equal(val, 5),
                    err => assert.ifError(err)
                );
            });
        });

        describe('when Promise resolves to not nothing', () => {
            it('should return same value', () => {
                return co(function* () {
                    return rejectWhenNothing(F.maybe(Promise.resolve(5)));
                }).then(
                    val => assert.equal(val, 5),
                    err => assert.ifError(err)
                );
            });
        });

        describe('when nothing', () => {
            it('should reject', () => {
                return co(function* () {
                    return rejectWhenNothing(F.nothing);
                }).then(
                    val => assert(false),
                    err => assert(err instanceof Error)
                );
            });
        });

        describe('when Promise resolves to nothing', () => {
            it('should reject', () => {
                return co(function* () {
                    return rejectWhenNothing(Promise.resolve(F.nothing));
                }).then(
                    val => assert(false),
                    err => assert(err instanceof Error)
                );
            });
        });
    });
});
