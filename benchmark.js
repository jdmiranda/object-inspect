var inspect = require('./index.js');

// Benchmark utility
function benchmark(name, fn, iterations) {
    var start = Date.now();
    for (var i = 0; i < iterations; i++) {
        fn();
    }
    var end = Date.now();
    var duration = end - start;
    var opsPerSec = Math.floor((iterations / duration) * 1000);
    console.log(name + ': ' + opsPerSec.toLocaleString() + ' ops/sec (' + iterations.toLocaleString() + ' iterations in ' + duration + 'ms)');
}

var iterations = 100000;

console.log('=== Object Inspection Performance Benchmark ===\n');

// Primitive types
console.log('--- Primitives ---');
benchmark('undefined', function() { inspect(undefined); }, iterations);
benchmark('null', function() { inspect(null); }, iterations);
benchmark('boolean (true)', function() { inspect(true); }, iterations);
benchmark('boolean (false)', function() { inspect(false); }, iterations);
benchmark('number (42)', function() { inspect(42); }, iterations);
benchmark('number (0)', function() { inspect(0); }, iterations);
benchmark('number (-0)', function() { inspect(-0); }, iterations);
benchmark('string (short)', function() { inspect('hello'); }, iterations);
benchmark('string (long)', function() { inspect('hello world this is a longer string for testing'); }, iterations);
benchmark('bigint', function() { inspect(BigInt(12345)); }, iterations);

console.log('\n--- Objects ---');
var simpleObj = { a: 1, b: 2, c: 3 };
var complexObj = { a: 1, b: { c: 2, d: { e: 3 } }, f: [1, 2, 3] };
var largeObj = {};
for (var i = 0; i < 50; i++) {
    largeObj['key' + i] = i;
}

benchmark('simple object', function() { inspect(simpleObj); }, iterations);
benchmark('nested object', function() { inspect(complexObj); }, iterations);
benchmark('large object (50 keys)', function() { inspect(largeObj); }, iterations / 10);

console.log('\n--- Arrays ---');
var emptyArray = [];
var smallArray = [1, 2, 3, 4, 5];
var largeArray = [];
for (var i = 0; i < 100; i++) {
    largeArray.push(i);
}
var nestedArray = [[1, 2], [3, 4], [5, 6]];

benchmark('empty array', function() { inspect(emptyArray); }, iterations);
benchmark('small array', function() { inspect(smallArray); }, iterations);
benchmark('large array (100 elements)', function() { inspect(largeArray); }, iterations / 10);
benchmark('nested array', function() { inspect(nestedArray); }, iterations);

console.log('\n--- Collections ---');
if (typeof Map !== 'undefined') {
    var map = new Map();
    map.set('a', 1);
    map.set('b', 2);
    map.set('c', 3);
    benchmark('Map (3 entries)', function() { inspect(map); }, iterations);
}

if (typeof Set !== 'undefined') {
    var set = new Set();
    set.add(1);
    set.add(2);
    set.add(3);
    benchmark('Set (3 entries)', function() { inspect(set); }, iterations);
}

if (typeof WeakMap !== 'undefined') {
    var weakMap = new WeakMap();
    benchmark('WeakMap', function() { inspect(weakMap); }, iterations);
}

console.log('\n--- Functions ---');
function testFunc() { return 42; }
function namedFunc() { return 'test'; }
var arrowFunc = function() { return 'arrow'; };

benchmark('function (named)', function() { inspect(testFunc); }, iterations);
benchmark('function (anonymous)', function() { inspect(arrowFunc); }, iterations);

console.log('\n--- Circular References ---');
var circular = { a: 1 };
circular.self = circular;
benchmark('circular reference', function() { inspect(circular); }, iterations / 10);

console.log('\n--- Special Values ---');
benchmark('Date', function() { inspect(new Date()); }, iterations);
benchmark('RegExp', function() { inspect(/test/g); }, iterations);
benchmark('Error', function() { inspect(new Error('test')); }, iterations);

if (typeof Symbol !== 'undefined') {
    var sym = Symbol('test');
    benchmark('Symbol', function() { inspect(sym); }, iterations);
}

console.log('\n=== Benchmark Complete ===');
