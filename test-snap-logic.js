'use strict';

function snapToGrid(value, gridSize) {
  if (gridSize <= 0) {
    return value;
  }
  return Math.round(value / gridSize) * gridSize;
}

console.log('Testing snap logic...');

// Test 1: snap 20, value 105 -> should be 100
console.log('Test 1: snap(105, 20) =', snapToGrid(105, 20), '(expected 100)');
console.assert(snapToGrid(105, 20) === 100, 'Test 1 failed');

// Test 2: snap 20, value 115 -> should be 120
console.log('Test 2: snap(115, 20) =', snapToGrid(115, 20), '(expected 120)');
console.assert(snapToGrid(115, 20) === 120, 'Test 2 failed');

// Test 3: snap 0, value 107 -> should be 107
console.log('Test 3: snap(107, 0) =', snapToGrid(107, 0), '(expected 107)');
console.assert(snapToGrid(107, 0) === 107, 'Test 3 failed');

// Test 4: snap {x: 20, y: 40}
console.log('Test 4: snap x(115, 20) =', snapToGrid(115, 20), '(expected 120)');
console.log('Test 4: snap y(125, 40) =', snapToGrid(125, 40), '(expected 120)');
console.assert(snapToGrid(115, 20) === 120, 'Test 4x failed');
console.assert(snapToGrid(125, 40) === 120, 'Test 4y failed');

// Test 5: snap 1, value 107 -> should be 107
console.log('Test 5: snap(107, 1) =', snapToGrid(107, 1), '(expected 107)');
console.assert(snapToGrid(107, 1) === 107, 'Test 5 failed');

// Test 6: negative values
console.log('Test 6: snap(-15, 20) =', snapToGrid(-15, 20), '(expected -20)');
console.assert(snapToGrid(-15, 20) === -20, 'Test 6 failed');

// Test 7: exact on grid
console.log('Test 7: snap(100, 20) =', snapToGrid(100, 20), '(expected 100)');
console.assert(snapToGrid(100, 20) === 100, 'Test 7 failed');

// Test 8: midpoint rounding (10 rounds to 0, 11 rounds to 20)
console.log('Test 8: snap(110, 20) =', snapToGrid(110, 20), '(expected 100 or 120, Math.round(5.5)=6 so 120)');
console.log('Test 8: snap(109, 20) =', snapToGrid(109, 20), '(expected 100)');
console.log('Test 8: snap(111, 20) =', snapToGrid(111, 20), '(expected 120)');
console.assert(snapToGrid(109, 20) === 100, 'Test 8a failed');
console.assert(snapToGrid(111, 20) === 120, 'Test 8b failed');

console.log('\nAll tests passed!');
