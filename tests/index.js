import assert from "assert";
import {
  add,
  subtract,
  multiply,
  factorial,
  filterEmptyStrings,
  filterEvenNumbers,
  filterOddNumbers,
} from "../assembly/build/release.js";

assert.strictEqual(add(1, 2), 3);
assert.strictEqual(subtract(1, 1), 0);
assert.strictEqual(multiply(2, 4), 8);
assert.strictEqual(factorial(3), 6);
assert.strictEqual(factorial(22), 2192834560);

console.log("calculator.js ok");

assert.deepEqual(filterEmptyStrings(["", "a", "b", "c"]), ["a", "b", "c"]);
assert.deepEqual(filterEvenNumbers([1, 2, 3, 4, 5, 6]), [2, 4, 6]);
assert.deepEqual(filterOddNumbers([1, 2, 3, 4, 5, 6]), [1, 3, 5]);

console.log("filter.js ok");
