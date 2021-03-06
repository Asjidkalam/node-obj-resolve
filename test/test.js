var chai = require('chai');
var expect = chai.expect;
var resolve = require('..');

var obj = {
  'part1' : {
    'name': 'Part 1',
    'size': 20,
    'qty' : 50
  },
  'part2' : {
    'name': 'Part 2',
    'size': 15,
    'qty' : 60
  },
  'part3' : [
    {
      'name': 'Part 3A',
      'size': 10,
      'qty' : 20
    }, {
      'name': 'Part 3B',
      'size': 5,
      'qty' : 20
    }, {
      'name': 'Part 3C',
      'size': 7.5,
      'qty' : 20
    }
  ],
  'part4': {},
  'part5': {
    'parent': {
      'name': 'Kyle'
    }
  }
};

describe("resolve", function () {

  it('should get a string field\'s value', function () {
    var expected = "Part 1",
        actual

    actual = resolve(obj, 'part1.name')
    expect(actual).to.equal(expected);
  });

  it('should get a number field\'s value', function () {
    var expected = 60,
        actual

    actual = resolve(obj, 'part2.qty')
    expect(actual).to.equal(expected);
  });

  it('should get an array element\'s field value', function () {
    var expected = "Part 3A",
        actual

    actual = resolve(obj, 'part3[0].name')
    expect(actual).to.equal(expected);
  });

  it('should return undefined if source is undefined/null', function () {
    var expected = undefined,
        actual

    var empty
    actual = resolve(empty, 'something.somewhere')
    expect(actual).to.equal(expected);

    empty = null
    actual = resolve(empty, 'something.somewhere')
    expect(actual).to.equal(expected);
  });

  it('should return undefined for non-existant array entries', function () {
    var expected = undefined,
        actual

    actual = resolve(obj, 'part3[4].name')
    expect(actual).to.equal(expected);
  });

  it('should return undefined for non-existant fields', function () {
    var expected = undefined,
        actual

    actual = resolve(obj, 'partX.name')
    expect(actual).to.equal(expected);

    actual = resolve({}, 'part1.nameX')
    expect(actual).to.equal(expected);

    actual = resolve({result: undefined, error: undefined}, 'result.failed')
    expect(actual).to.equal(expected);
  });

  it('should set existing fields', function () {
    var expected = "Mary",
        actual

    actual = resolve(obj, 'part2.name', "Mary")
    expect(actual).to.equal(expected);

    actual = resolve(obj, 'part2.name')
    expect(actual).to.equal(expected);
  });

  it('should set existing array element fields', function () {
    var expected = "3B",
        actual

    actual = resolve(obj, 'part3[1].name', "3B")
    expect(actual).to.equal(expected);

    actual = resolve(obj, 'part3[1].name')
    expect(actual).to.equal(expected);
  });

  it('should set new field on existing field', function () {
    var expected = "Mary",
        actual

    actual = resolve(obj, 'part4.name', "Mary")
    expect(actual).to.equal(expected);

    actual = resolve(obj, 'part4.name')
    expect(actual).to.equal(expected);
  });

  it('should set new array on existing field', function () {
    var expected = [1, 2],
        actual

    actual = resolve(obj, 'part4.arr', [1, 2])
    expect(actual).to.have.members(expected);

    actual = resolve(obj, 'part4.arr')
    expect(actual).to.have.members(expected);
  });

  it('should set deep new field', function () {
    var expected = "Mary",
        actual

    actual = resolve(obj, 'part4.friend.parent.name', expected)
    expect(actual).to.equal(expected);

    actual = resolve(obj, 'part4.friend.parent.name')
    expect(actual).to.equal(expected);
  });
  it('should not overwrite existing sibling fields', function () {
    var expected = "Kyle",
        actual

    actual = resolve(obj, 'part5.parent.age', 33)
    expect(actual).to.equal(33);

    actual = resolve(obj, 'part5.parent.name')
    expect(actual).to.equal(expected);
  });
  
});
