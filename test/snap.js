'use strict';

var test = require('tape');
var events = require('./lib/events');
var dragula = require('..');

test('snap as number aligns mirror position to grid', function (t) {
  var div = document.createElement('div');
  var item = document.createElement('div');
  var drake = dragula([div], { snap: 20 });
  div.appendChild(item);
  document.body.appendChild(div);

  drake.on('cloned', function (mirror) {
    events.raise(item, 'mousemove', { which: 1, clientX: 105, clientY: 105 });
    var left = parseInt(mirror.style.left, 10);
    var top = parseInt(mirror.style.top, 10);
    t.equal(left % 20, 0, 'left position is snapped to 20px grid');
    t.equal(top % 20, 0, 'top position is snapped to 20px grid');
    t.ok(Math.abs(left - 105) <= 10, 'left is snapped to nearest grid point');
    t.ok(Math.abs(top - 105) <= 10, 'top is snapped to nearest grid point');
  });

  events.raise(item, 'mousedown', { which: 1, clientX: 100, clientY: 100 });
  events.raise(item, 'mousemove', { which: 1, clientX: 100, clientY: 100 });

  drake.end();
  cleanup(div);
  t.end();
});

test('snap as object with x and y aligns each axis independently', function (t) {
  var div = document.createElement('div');
  var item = document.createElement('div');
  var drake = dragula([div], { snap: { x: 20, y: 40 } });
  div.appendChild(item);
  document.body.appendChild(div);

  drake.on('cloned', function (mirror) {
    events.raise(item, 'mousemove', { which: 1, clientX: 115, clientY: 125 });
    var left = parseInt(mirror.style.left, 10);
    var top = parseInt(mirror.style.top, 10);
    t.equal(left % 20, 0, 'left position is snapped to 20px x-grid');
    t.equal(top % 40, 0, 'top position is snapped to 40px y-grid');
    t.ok(Math.abs(left - 115) <= 10, 'left is snapped to nearest x-grid point');
    t.ok(Math.abs(top - 125) <= 20, 'top is snapped to nearest y-grid point');
  });

  events.raise(item, 'mousedown', { which: 1, clientX: 100, clientY: 100 });
  events.raise(item, 'mousemove', { which: 1, clientX: 100, clientY: 100 });

  drake.end();
  cleanup(div);
  t.end();
});

test('snap x: 0 disables horizontal snapping', function (t) {
  var div = document.createElement('div');
  var item = document.createElement('div');
  var drake = dragula([div], { snap: { x: 0, y: 20 } });
  div.appendChild(item);
  document.body.appendChild(div);

  drake.on('cloned', function (mirror) {
    events.raise(item, 'mousemove', { which: 1, clientX: 107, clientY: 113 });
    var left = parseInt(mirror.style.left, 10);
    var top = parseInt(mirror.style.top, 10);
    t.equal(left, 7, 'left position is not snapped (x: 0)');
    t.equal(top % 20, 0, 'top position is snapped to 20px y-grid');
  });

  events.raise(item, 'mousedown', { which: 1, clientX: 100, clientY: 100 });
  events.raise(item, 'mousemove', { which: 1, clientX: 100, clientY: 100 });

  drake.end();
  cleanup(div);
  t.end();
});

test('snap y: 0 disables vertical snapping', function (t) {
  var div = document.createElement('div');
  var item = document.createElement('div');
  var drake = dragula([div], { snap: { x: 20, y: 0 } });
  div.appendChild(item);
  document.body.appendChild(div);

  drake.on('cloned', function (mirror) {
    events.raise(item, 'mousemove', { which: 1, clientX: 107, clientY: 113 });
    var left = parseInt(mirror.style.left, 10);
    var top = parseInt(mirror.style.top, 10);
    t.equal(left % 20, 0, 'left position is snapped to 20px x-grid');
    t.equal(top, 13, 'top position is not snapped (y: 0)');
  });

  events.raise(item, 'mousedown', { which: 1, clientX: 100, clientY: 100 });
  events.raise(item, 'mousemove', { which: 1, clientX: 100, clientY: 100 });

  drake.end();
  cleanup(div);
  t.end();
});

test('snap false disables snapping entirely', function (t) {
  var div = document.createElement('div');
  var item = document.createElement('div');
  var drake = dragula([div], { snap: false });
  div.appendChild(item);
  document.body.appendChild(div);

  drake.on('cloned', function (mirror) {
    events.raise(item, 'mousemove', { which: 1, clientX: 107, clientY: 113 });
    var left = parseInt(mirror.style.left, 10);
    var top = parseInt(mirror.style.top, 10);
    t.equal(left, 7, 'left position is not snapped (snap: false)');
    t.equal(top, 13, 'top position is not snapped (snap: false)');
  });

  events.raise(item, 'mousedown', { which: 1, clientX: 100, clientY: 100 });
  events.raise(item, 'mousemove', { which: 1, clientX: 100, clientY: 100 });

  drake.end();
  cleanup(div);
  t.end();
});

test('snap does not affect drag event parameters', function (t) {
  var div = document.createElement('div');
  var item = document.createElement('div');
  var drake = dragula([div], { snap: 20 });
  div.appendChild(item);
  document.body.appendChild(div);

  drake.on('drag', function (dragItem, container) {
    t.equal(dragItem, item, 'drag event receives correct item');
    t.equal(container, div, 'drag event receives correct container');
  });

  events.raise(item, 'mousedown', { which: 1, clientX: 100, clientY: 100 });
  events.raise(item, 'mousemove', { which: 1, clientX: 100, clientY: 100 });

  drake.end();
  cleanup(div);
  t.end();
});

test('snap does not affect drop event parameters', function (t) {
  var div = document.createElement('div');
  var div2 = document.createElement('div');
  var item = document.createElement('div');
  var drake = dragula([div, div2], { snap: 20 });
  div.appendChild(item);
  document.body.appendChild(div);
  document.body.appendChild(div2);

  drake.on('drop', function (dropItem, target, source) {
    t.equal(dropItem, item, 'drop event receives correct item');
    t.equal(target, div2, 'drop event receives correct target');
    t.equal(source, div, 'drop event receives correct source');
  });

  events.raise(item, 'mousedown', { which: 1, clientX: 100, clientY: 100 });
  events.raise(item, 'mousemove', { which: 1, clientX: 100, clientY: 100 });
  div2.appendChild(item);
  drake.end();

  cleanup(div);
  cleanup(div2);
  t.end();
});

test('snap works with multi-container drag', function (t) {
  var div = document.createElement('div');
  var div2 = document.createElement('div');
  var item = document.createElement('div');
  var drake = dragula([div, div2], { snap: 30 });
  div.appendChild(item);
  document.body.appendChild(div);
  document.body.appendChild(div2);

  drake.on('cloned', function (mirror) {
    events.raise(item, 'mousemove', { which: 1, clientX: 145, clientY: 155 });
    var left = parseInt(mirror.style.left, 10);
    var top = parseInt(mirror.style.top, 10);
    t.equal(left % 30, 0, 'left position is snapped during multi-container drag');
    t.equal(top % 30, 0, 'top position is snapped during multi-container drag');
  });

  events.raise(item, 'mousedown', { which: 1, clientX: 100, clientY: 100 });
  events.raise(item, 'mousemove', { which: 1, clientX: 100, clientY: 100 });

  drake.end();
  cleanup(div);
  cleanup(div2);
  t.end();
});

test('snap works with accepts and isContainer options', function (t) {
  var div = document.createElement('div');
  var div2 = document.createElement('div');
  div2.className = 'valid-container';
  var div3 = document.createElement('div');
  var item = document.createElement('div');
  var drake = dragula([div], {
    snap: 25,
    isContainer: function (el) {
      return el.className === 'valid-container';
    },
    accepts: function (el, target) {
      return target.className === 'valid-container';
    }
  });
  div.appendChild(item);
  document.body.appendChild(div);
  document.body.appendChild(div2);
  document.body.appendChild(div3);

  drake.on('cloned', function (mirror) {
    events.raise(item, 'mousemove', { which: 1, clientX: 112, clientY: 138 });
    var left = parseInt(mirror.style.left, 10);
    var top = parseInt(mirror.style.top, 10);
    t.equal(left % 25, 0, 'left position is snapped with isContainer/accepts');
    t.equal(top % 25, 0, 'top position is snapped with isContainer/accepts');
  });

  events.raise(item, 'mousedown', { which: 1, clientX: 100, clientY: 100 });
  events.raise(item, 'mousemove', { which: 1, clientX: 100, clientY: 100 });

  drake.end();
  cleanup(div);
  cleanup(div2);
  cleanup(div3);
  t.end();
});

test('snap value of 1 aligns to every pixel (no practical change)', function (t) {
  var div = document.createElement('div');
  var item = document.createElement('div');
  var drake = dragula([div], { snap: 1 });
  div.appendChild(item);
  document.body.appendChild(div);

  drake.on('cloned', function (mirror) {
    events.raise(item, 'mousemove', { which: 1, clientX: 107, clientY: 113 });
    var left = parseInt(mirror.style.left, 10);
    var top = parseInt(mirror.style.top, 10);
    t.equal(left, 7, 'left position with snap: 1 equals raw offset');
    t.equal(top, 13, 'top position with snap: 1 equals raw offset');
  });

  events.raise(item, 'mousedown', { which: 1, clientX: 100, clientY: 100 });
  events.raise(item, 'mousemove', { which: 1, clientX: 100, clientY: 100 });

  drake.end();
  cleanup(div);
  t.end();
});

test('snap aligns to nearest grid point, not just floor', function (t) {
  var div = document.createElement('div');
  var item = document.createElement('div');
  var drake = dragula([div], { snap: 20 });
  div.appendChild(item);
  document.body.appendChild(div);

  drake.on('cloned', function (mirror) {
    events.raise(item, 'mousemove', { which: 1, clientX: 109, clientY: 111 });
    var left = parseInt(mirror.style.left, 10);
    var top = parseInt(mirror.style.top, 10);
    t.equal(left, 10, '9px offset rounds down to nearest 20px grid (0)');
    t.equal(top, 20, '11px offset rounds up to nearest 20px grid (20)');
  });

  events.raise(item, 'mousedown', { which: 1, clientX: 100, clientY: 100 });
  events.raise(item, 'mousemove', { which: 1, clientX: 100, clientY: 100 });

  drake.end();
  cleanup(div);
  t.end();
});

test('snap with copy option works correctly', function (t) {
  var div = document.createElement('div');
  var div2 = document.createElement('div');
  var item = document.createElement('div');
  var drake = dragula([div, div2], { snap: 20, copy: true });
  div.appendChild(item);
  document.body.appendChild(div);
  document.body.appendChild(div2);

  drake.on('cloned', function (clone, original, type) {
    if (type === 'mirror') {
      events.raise(item, 'mousemove', { which: 1, clientX: 105, clientY: 105 });
      var left = parseInt(clone.style.left, 10);
      var top = parseInt(clone.style.top, 10);
      t.equal(left % 20, 0, 'mirror left is snapped during copy drag');
      t.equal(top % 20, 0, 'mirror top is snapped during copy drag');
    }
  });

  events.raise(item, 'mousedown', { which: 1, clientX: 100, clientY: 100 });
  events.raise(item, 'mousemove', { which: 1, clientX: 100, clientY: 100 });

  drake.end();
  cleanup(div);
  cleanup(div2);
  t.end();
});

function cleanup (el) {
  if (el && el.parentNode) {
    el.parentNode.removeChild(el);
  }
}
