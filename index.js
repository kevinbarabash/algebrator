let {
    Expression,
    Literal,
    Product,
    Fraction,
    Identifier,
    Operator,
    Equation
} = require('./src/ast.js');

let {
    layout,
    render,
    lerpLayout,
    ctx,
    hitTest
} = require('./src/renderer.js');

const {getMetrics, createLayout, flatten} = require("./src/layout.js");

let { add, sub, removeExtraParens } = require('./src/operations.js');

var expr1, expr2, expr3, sum, diff;

expr1 = add(new Literal(1), new Literal(3));
expr2 = sub(new Literal(5), new Literal(-2));
expr3 = add(new Literal(7), new Literal(8));

sum = add(add(expr1, expr2), expr3);
console.log(`sum = ${sum.toString()}`);

console.log('----------------------');

expr1 = add(new Literal(1), new Literal(3));
expr2 = sub(new Literal(5), new Literal(-2));

diff = sub(expr1, expr2);
console.log(`diff = ${diff.toString()}`);

console.log('----------------------');


// reset everything
expr1 = add(new Literal(1), new Literal(3));
expr2 = sub(new Literal(5), new Literal(-2));

var eqn1 = new Equation(expr1, expr2);
let l1 = layout(eqn1);

var ids = Object.keys(l1);
var id = eqn1.id;
eqn1 = add(eqn1, new Literal(25));
eqn1.id = id;
//eqn1.add(new Literal(25));
let l2 = layout(eqn1);

console.log(eqn1.toString());

console.log(l1);
console.log(l2);

let diffLayout = layout(diff);

let equalsWidth = ctx.measureText("=").width;

var t = 0;

// TODO: figure out a better way to handle a series of animations

function easeQuadratic(t) {
    return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function easeCubic(t) {
    return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}

function easeInCubic(t) {
    return t * t * t;
}

function easeOutCubic(t) {
    return (--t) * t * t + 1;
}

function findEquals(layout) {
    let result = null;
    Object.keys(layout).forEach(id => {
        let leaf = layout[id];
        if (leaf.text === '=') {
            result = leaf;
        }
    });
    return result;
}

function drawAxes(ctx) {
    let width = 1200;
    let height = 700;
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();
}

function draw1() {
    ctx.clearRect(0, 0, 1200, 700);
    drawAxes(ctx);

    let l3 = lerpLayout(l1, l2, ids, easeCubic(t));
    let equals = findEquals(l3);

    ctx.save();
    ctx.translate(600 - equals.x - equalsWidth / 2, 366);
    render(l3, ids);
    ctx.restore();

    ctx.save();
    ctx.translate(0, 200);
    render(diffLayout);
    ctx.restore();

    if (t < 1) {
        t += 0.03;
        requestAnimationFrame(draw1);
    } else {
        t = 0;
        requestAnimationFrame(draw2);
    }
}

function draw2() {
    ctx.clearRect(0, 0, 1200, 700);
    drawAxes(ctx);

    let equals = findEquals(l2);

    ctx.save();
    ctx.translate(600 - equals.x - equalsWidth / 2, 366);
    render(l2, ids, easeOutCubic(t));
    ctx.restore();

    ctx.save();
    ctx.translate(0, 200);
    render(diffLayout);
    ctx.restore();

    if (t < 1) {
        t += 0.03;
        requestAnimationFrame(draw2);
    } else {

    }
}

//document.addEventListener('click', function(e) {
//    var {pageX:x, pageY:y} = e;
//
//    let equals = findEquals(l2);
//
//    x -= 600 - equals.x - equalsWidth / 2;
//    y -= 366;
//
//    let leaf = hitTest(l2, x, y);
//
//    ctx.clearRect(0, 0, 1200, 700);
//    drawAxes(ctx);
//
//    ctx.save();
//    ctx.translate(600 - equals.x - equalsWidth / 2, 366);
//    if (leaf) {
//        ctx.fillStyle = 'rgba(255,255,0,0.5)';
//        ctx.fillRect(leaf.x, leaf.y - leaf.height, leaf.width, leaf.height);
//    }
//    render(l2, ids, easeOutCubic(t));
//    ctx.restore();
//
//    ctx.save();
//    ctx.translate(0, 200);
//    render(diffLayout);
//    ctx.restore();
//});

//draw1();

ctx.save();
ctx.translate(100,100);


expr1 = add(new Literal(25), new Product(new Literal(2), new Identifier('pi'), new Identifier('r')));
expr1 = add(expr1, new Identifier('theta'));
expr2 = sub(new Fraction(new Identifier('y'), add(new Literal(5), new Identifier('x'))), new Literal(-2));

eqn1 = new Equation(expr1, expr2);

var newLayout = createLayout(eqn1, 72);
newLayout.render(ctx);

ctx.translate(0, 300);

var flattenedLayout = flatten(newLayout);
flattenedLayout.render(ctx);

ctx.restore();

document.addEventListener('click', function(e) {
    var x = e.pageX - 100;
    var y = e.pageY - 100;

    const layoutNode = newLayout.hitTest(x, y);
    console.log(layoutNode);

    // TODO: implement findNode
    // const expressionNode = findNode(expression, id);
});

//console.log(getMetrics("a", fontSize));
