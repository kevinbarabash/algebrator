const { Literal } = require('../ast.js');
const { compare } = require('../util/node_utils.js');

function canTransform(node) {
    // can't do anything with a single node
    return false;
}

function replace(parent, propName, newChild) {
    delete parent[propName].parent;
    parent[propName] = newChild;
    newChild.parent = parent;
}

function canTransformNodes(nodes) {
    if (nodes.length === 2) {
        const [a, b] = nodes;
        let aFrac = null;
        let bFrac = null;

        if (a.parent.type === 'Fraction') {
            aFrac = a.parent;
        } else if (a.parent.type === 'Product' && a.parent.parent.type === 'Fraction') {
            aFrac = a.parent.parent;
        } else {
            return false;
        }

        if (b.parent.type === 'Fraction') {
            bFrac = b.parent;
        } else if (b.parent.type === 'Product' && b.parent.parent.type === 'Fraction') {
            bFrac = b.parent.parent;
        } else {
            return false;
        }

        if (aFrac !== bFrac) {
            return false;
        }

        if ((a === aFrac.numerator || a.parent === aFrac.numerator) &&
            (b === bFrac.denominator || b.parent === bFrac.denominator)) {
            return compare(a, b);
        }

        if ((a === aFrac.denominator || a.parent === aFrac.denominator) &&
            (b === bFrac.numerator || b.parent === bFrac.numerator)) {
            return compare(a, b);
        }
    }
    return false;
}

function transformNodes(nodes) {
    if (canTransformNodes(nodes)) {
        const [a, b] = nodes;
        let frac = a.parent.type === 'Fraction' ? a.parent : a.parent.parent;

        if (a.parent === frac) {
            if (frac.numerator === a) {
                replace(frac, 'numerator', new Literal(1));
            } else {
                replace(frac, 'denominator', new Literal(1));
            }
        } else {
            if (a.next && !a.prev) {
                a.parent.remove(a.next);
            }
            if (a.prev) {
                a.parent.remove(a.prev);
            }
            a.parent.remove(a);
        }

        if (b.parent === frac) {
            if (frac.numerator === b) {
                replace(frac, 'numerator', new Literal(1));
            } else {
                replace(frac, 'denominator', new Literal(1));
            }
        } else {
            if (b.next && !b.prev) {
                b.parent.remove(b.next);
            }
            if (b.prev) {
                b.parent.remove(b.prev);
            }
            b.parent.remove(b);
        }

        if (frac.numerator.type === 'Product' && frac.numerator.length === 0) {
            replace(frac, 'numerator', new Literal(1));
        }

        if (frac.denominator.type === 'Product' && frac.denominator.length === 0) {
            replace(frac, 'denominator', new Literal(1));
        }
    }
}

module.exports = {
    label: 'cancel factor',
    canTransform,
    canTransformNodes,
    transformNodes
};
