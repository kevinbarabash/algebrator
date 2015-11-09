import Node from './node'

export default class Identifier extends Node {
    constructor(name, options = {}) {
        super();
        this.type = 'Identifier';
        this.name = name;
        this.subscript = options.subscript || null;
        this.accent = options.accent || null;
    }

    toString() {
        return `${this.type}:${this.name}`;
    }

    clone() {
        return new Identifier(this.value);
    }
}
