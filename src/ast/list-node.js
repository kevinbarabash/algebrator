const Node = require('./node');

class ListNode extends Node {
    constructor(...nodes) {
        super();
        this.first = null;
        this.last = null;
        this.append(...nodes);
    }

    append(...nodes) {
        for (let node of nodes) {
            node.next = null;
            node.parent = this;
            if (this.first == null && this.last == null) {
                this.first = node;
                this.last = node;
                node.prev = null;
            } else {
                this.last.next = node;
                node.prev = this.last;
                this.last = node;
            }
        }
    }

    prepend(...nodes) {
        // TODO: determine if nodes should be reversed or not
        for (let node of nodes) {
            node.prev = null;
            node.parent = this;
            if (this.first == null && this.last == null) {
                this.first = node;
                this.last = node;
                node.next = null;
            } else {
                this.first.prev = node;
                node.next = this.first;
                this.first = node;
            }
        }
    }

    replace(current, replacement) {
        replacement.prev = current.prev;
        replacement.next = current.next;
        if (current.prev != null) {
            current.prev.next = replacement;
        }
        if (current.next != null) {
            current.next.prev = replacement;
        }
        current.prev = null;
        current.next = null;
        if (this.first === current) {
            this.first = replacement;
        }
        if (this.last === current) {
            this.last = replacement;
        }
    }

    remove(node) {
        if (this.first === node) {
            this.first = node.next;
            if (this.first) {
                this.first.prev = null;
            }
        } else {
            node.prev.next = node.next;
        }
        if (this.last === node) {
            this.last = node.prev;
            if (this.last) {
                this.last.next = null;
            }
        } else {
            node.next.prev = node.prev;
        }
    }

    *[Symbol.iterator]() {
        let node = this.first;
        while (node != null) {
            // grab the current node so that we can do replacements while
            // iterating
            let current = node;
            node = node.next;
            yield current;
        }
    }

    get length() {
        let count = 0;
        for (let node of this) {
            count++;
        }
        return count;
    }

    toString() {
        let result = "[";
        let first = true;
        for (let node of this) {
            if (!first) {
                result += ", ";
            } else {
                first = false;
            }
            result += node.toString();
        }
        result += "]";
        return result;
    }
}

module.exports = ListNode;
