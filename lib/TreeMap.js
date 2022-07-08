class TreeMap {
  constructor(tree) {
    this.tree = {};
    if (tree) this.tree = tree;
  }
  /**
   *  Stores object in asked address. Raises Error if address is already storing an object.
   * @param {Array <String>|String} keyArray
   * @param {any} toStore
   */
  store(keyArray, toStore) {
    this.#storeInTreemap(this.tree, keyArray, toStore);
  }
  /**
   * Returns object stored in asked address. If asked address is empty or not valid, returns "undefined".
   * @param {Array <String>} keyArray
   * @returns {any}
   */
  get(keyArray) {
    return this.#getInTreemap(this.tree, keyArray);
  }

  /**
   * Removes object stored in asked address and clean branch if empty.
   * @param {*} keyArray
   * @param {*} [key]
   * @returns
   */
  remove(keyArray, key) {
    return this.#removeFromTreemap(this.tree, keyArray, key);
  }
  /**
   *
   * @param {Object} treemap
   * @param {Array<String>|String} keyArray
   * @param {Object} [toStore]
   * @returns
   */
  #storeInTreemap(treemap, keyArray, toStore) {
    var toReturn = treemap;
    if (!treemap) toReturn = {};
    var pointer = toReturn;
    for (var keyB of keyArray.slice(0, -1)) {
      if (!pointer.hasOwnProperty(keyB)) pointer[keyB] = {};
      pointer = pointer[keyB];
    }
    if (pointer.hasOwnProperty(keyArray.at(-1)))
      throw new Error("Asked Value already stores data.");
    var toStoreB = {};
    toStoreB[keyArray.at(-1)] = toStore ? toStore : true;
    Object.assign(pointer, toStoreB);
    return toReturn;
  }

  /**
   *
   * @param {Object} treemap
   * @param {Array} keyArray
   * @returns {Boolean | Object}
   */
  #getInTreemap(treemap, keyArray) {
    var toReturn = treemap;
    var pointer = toReturn;
    for (var key of keyArray) {
      if (!pointer.hasOwnProperty(key)) return undefined;
      pointer = pointer[key];
    }
    return pointer;
  }
  #removeFromTreemap(treemap, pkeyArray, pkey) {
    var toReturn = treemap;
    var pointer = toReturn;
    var keyArray = [].concat(pkeyArray);
    if (pkey) keyArray.concat(pkey);
    for (var keyB of keyArray.slice(0, -1)) {
      //TODO write errors
      if (!pointer.hasOwnProperty(keyB))
        throw new Error("The following key was not found >>> " + keyB + " .");
      pointer = pointer[keyB];
    }
    delete pointer[keyArray.at(-1)];
    var keyArrayB = keyArray;
    function removeIfNoKey(array) {
      var tempPointer = treemap;
      for (var tar of array) tempPointer[tar];
      if (Object.keys(tempPointer).length == 0) {
        delete tempPointer[tar];
        array.pop();
        tempPointer = null;
        removeIfNoKey(array);
      }
    }
    removeIfNoKey(keyArrayB);
  }
}
module.exports = TreeMap;
