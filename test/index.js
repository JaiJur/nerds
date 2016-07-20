'use strict';
const nerds = require('../dist/nerds');
const expect = require('chai').expect;
const ALL_TOPICS = require('../dist/topics');
const CORE_METHODS = ['resolve','fields','include','exclude','asArray','asPromise','asGenerator']

describe('nerdsJS', function () {
	describe('API: nerds', function () {
		it('should be an object', function () {
			expect(nerds).to.be.an('object');
		});

		it('should include the core methods', function () {
			expect(nerds).to.have.all.keys(CORE_METHODS);
		});
	});

	describe('METHOD: resolve()', function () {
		it('should return an array of strings', function () {
			expect(nerds.resolve()).to.satisfy(isArrayOfStrings);
			function isArrayOfStrings (array) {
				return array.every(function (topic) {
					return typeof topic === 'string';
				});
			}
		});

		it('should return all valid topics', function () {
			expect(nerds.resolve()).to.have.members(Object.keys(ALL_TOPICS));
		});
	});

	describe('METHOD: resolve(<topic>)', function () {
		it('should return the nerds context by default', function () {
			expect(nerds.resolve("Harry Potter")).to.deep.equal(nerds);
		});
	});

	describe('METHOD: resolve(<topic>, <results>)', function () {
		it('should return the correct number of results (<results> not passed)', function () {
			expect(nerds.resolve("Harry Potter").asArray()).to.have.lengthOf(1);
		});

		it('should return the correct number of results (<results> passed)', function () {
			expect(nerds.resolve("Harry Potter", 3).asArray()).to.have.lengthOf(3);
		});
	});

	describe('METHOD: fields()', function () {
		it('should return an array of valid fields', function () {
			expect(
				nerds
					.resolve("Harry Potter")
					.fields()
				).to.have.members(ALL_TOPICS["Harry Potter"].keys);
		});
	});

	describe('METHOD: include(<fields>)', function () {
		it('should only return the chosen fields', function () {
			expect(
				nerds
					.resolve("Harry Potter")
					.include(['full', 'wand', 'house'])
					.asArray()[0]
				).to.have.all.keys(['full', 'wand', 'house']);
		});
	});

	describe('METHOD: exclude(<fields>)', function () {
		it('should only return the fields not excluded', function () {
			expect(
				nerds
					.resolve("Harry Potter")
					.exclude(['last','full','blood_status','birthday','gender','house','wand'])
					.asArray()[0]
			).to.have.key('first');
		});
	});

	describe('METHOD: asArray()', function () {
		it('should return an array of objects', function () {
			expect(nerds.resolve("Harry Potter", 3).asArray()).to.satisfy(isArrayOfObjects);
			function isArrayOfObjects (array) {
				return array.every(function (result) {
					return typeof result === 'object';
				})
			}
		});
	});

	describe('METHOD: asPromise()', function () {
		it('should return a promise', function () {
			expect(nerds.resolve("Harry Potter").asPromise()).to.satisfy(isPromise);
			function isPromise (p) {
				return typeof p.then === 'function';
			}
		});
	});

	describe('METHOD: asGenerator()', function () {
		it('should return a generator', function () {
			expect(nerds.resolve("Harry Potter").asGenerator()).to.satisfy(isGenerator);
			function isGenerator (gen) {
				return typeof(gen.next) !== 'undefined' && typeof gen.next === 'function';
			}
		});
	});
});