'use strict'

const {
  wellknownHeaderNames,
  headerNameLowerCasedRecord
} = require('./constants')

class TstNode {
  /** @type {any} */
  value = null
  /** @type {null | TstNode} */
  left = null
  /** @type {null | TstNode} */
  middle = null
  /** @type {null | TstNode} */
  right = null
  /** @type {number} */
  code
  /**
   * @param {Uint8Array} key
   * @param {any} value
   * @param {number} index
   */
  constructor (key, value, index) {
    if (index === undefined || index >= key.length) {
      throw new TypeError('Unreachable')
    }
    this.code = key[index]
    if (key.length !== ++index) {
      this.middle = new TstNode(key, value, index)
    } else {
      this.value = value
    }
  }

  /**
   * @param {Uint8Array} key
   * @param {any} value
   */
  add (key, value) {
    const length = key.length
    if (length === 0) {
      throw new TypeError('Unreachable')
    }
    let index = 0
    let node = this
    while (true) {
      const code = key[index]
      if (node.code === code) {
        if (length === ++index) {
          node.value = value
          break
        } else if (node.middle !== null) {
          node = node.middle
        } else {
          node.middle = new TstNode(key, value, index)
          break
        }
      } else if (node.code < code) {
        if (node.left !== null) {
          node = node.left
        } else {
          node.left = new TstNode(key, value, index)
          break
        }
      } else if (node.right !== null) {
        node = node.right
      } else {
        node.right = new TstNode(key, value, index)
        break
      }
    }
  }

  /**
   * @param {Uint8Array} key
   * @return {TstNode | null}
   */
  search (key) {
    const keylength = key.length
    let index = 0
    let node = this
    while (node !== null && index < keylength) {
      let code = key[index]
      // A-Z
      if (code >= 0x41 && code <= 0x5a) {
        // Lowercase for uppercase.
        code |= 32
      }
      while (node !== null) {
        if (code === node.code) {
          if (keylength === ++index) {
            // Returns Node since it is the last key.
            return node
          }
          node = node.middle
          break
        }
        node = node.code < code ? node.left : node.right
      }
    }
    return null
  }
}

class TernarySearchTree {
  /** @type {TstNode | null} */
  node = null

  /**
   * @param {Uint8Array} key
   * @param {any} value
   * */
  insert (key, value) {
    if (this.node === null) {
      this.node = new TstNode(key, value, 0)
    } else {
      this.node.add(key, value)
    }
  }

  /**
   * @param {Uint8Array} key
   */
  lookup (key) {
    return this.node?.search(key)?.value ?? null
  }
}

const tree = new TernarySearchTree()

for (let i = 0; i < wellknownHeaderNames.length; ++i) {
  const key = headerNameLowerCasedRecord[wellknownHeaderNames[i]]
  tree.insert(Buffer.from(key), key)
}

module.exports = {
  TernarySearchTree,
  tree
}
