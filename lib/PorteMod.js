const TreeMap = require("./TreeMap");
/**
 * A PorteMod can turn any object from a class into in impostor object, redirecting initial class methods from that object to another functions.
 */
class PorteMod {
  constructor() {
    /**
     * An object storing methods from scanned Class
     * @type {TreeMap}
     *
     */
    this.myMods = new TreeMap();
    /**
     * An object linking a functional type to a determined class type.
     * @type {TreeMap}
     */
    this.functionalMods = new TreeMap();
  }
  removeMod(path) {
    this.myMods.remove(path);
  }
  /**
   * Copy a class into myMods.
   *
   * @param {Object} clss
   * @param {Array<String>} IDAddress
   */
  registerClassAsMod(clss, IDAddress) {
    var toStore = {};
    var cl = clss.prototype || clss;
    for (var method of Object.getOwnPropertyNames(cl)) {
      toStore[method] = cl[method];
    }

    this.myMods.store(IDAddress, toStore);
  }

  /**
   * Set an IDAdress of a scanner class to a functionalAdress
   * @param {Array<String>} IDAddress
   * @param {Array<String>} fAddress
   */
  setModToFunctionalAddress(IDAddress, fAddress) {
    var mod = this.myMods.get(IDAddress);
    if (mod === undefined) throw new Error("No mod found at asked IDAddress.");
    if (this.functionalMods.get(fAddress) !== undefined)
      throw new Error("Asked FAddress already has mod.");
    for (var method of Object.getOwnPropertyNames(mod)) {
      //console.log(fAddress.concat(method));
      this.functionalMods.store(
        fAddress.concat(method),
        IDAddress.concat(method)
      );
    }
  }

  /**
   * Set an IDAdress of a scanner class to a functionalAdress
   * @param {Array<String>|Array<Array<String>>} IDAddressPlusMethodName
   * @param {Array<String>} fAddress
   */
  addMethodsToFunctionalAddress(IDAddressPlusMethodName, fAddress, methodName) {
    var tmp = this.functionalMods.get(fAddress.concat(methodName));
    var mod = this.myMods.get(tmp);
    if (typeof mod === "function") {
      this.functionalMods.remove(fAddress);
      this.functionalMods.store(
        fAddress.concat(methodName),
        IDAddressPlusMethodName.reverse().concat([tmp])
      );
    } else if (typeof mod === "function") mod.unshift(IDAddressPlusMethodName);
    else if (mod === undefined || typeof mod === "object")
      throw new Error("Wrong functional address.");
  }

  /**
   * transform an object into an imposter object, replaces all the methods of an object by the PorteMod hook
   * @param {Object} obj1
   * @param {Array<String>} functionalAddress
   */
  turnIntoPMUser(obj1, functionalAddress) {
    try {
      var pm = this;
      for (var methodToChange of Object.getOwnPropertyNames(
        obj1.constructor.prototype
      )) {
        if (methodToChange !== "constructor") {
          var functions = [];
          var IDAddressS = pm.functionalMods.get(
            functionalAddress.concat([methodToChange])
          );
          if (!Array.isArray(IDAddressS[0]))
            functions = pm.myMods.get(IDAddressS);
          else for (var add of IDAddressS) functions.push(pm.myMods.get(add));

          var newF = function (...p) {
            var toReturn;
            var param = p;
            if (!Array.isArray(functions)) return functions.apply(obj1, param);
            for (var func of functions) {
              try {
                if (Array.isArray(param)) param = func.apply(obj1, param);
                else param = func.apply(obj1);
              } catch (error) {
                if (error.message === "Stop PorteMod") break;
                else throw new Error(error);
              }
            }
            return param;
          };
          obj1[methodToChange] = newF;
          /* obj1[methodToChange] = pm.myMods.get(
            pm.functionalMods.get(functionalAddress)
          ).prototype[methodToChange]; */
        }
      }
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = PorteMod;
