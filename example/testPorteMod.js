const { PorteMod } = require("../exporter");
var pm = new PorteMod();

/**
 *  The following example show how to scan class and change the methods of an object without interfering with data structure or type.
 *  An Amongi and an Imposter class will be created and we will instantiate 2 Amongis and 1 Imposter named Red, Blue and Yellow.
 *  We will transform Blue into an Imposter and change Yellow into an Amongi. Red will be untouched.
 */
// Create two differents class
class Amongi {
  constructor() {}
  whoAreU() {
    console.log("Before, I was an", this.constructor.name + ".");
    console.log("Now, I am an Amongi. I swear !\n");
  }
}
class Imposter {
  constructor() {}
  whoAreU() {
    console.log("Before, I was an", this.constructor.name + ".");
    console.log("Now, I am an Imposter !\n");
  }
}
var Red = new Amongi();
var Blue = new Amongi();
var Yellow = new Imposter();

// Scanning the class storing methods at the designed IDAddress.
pm.registerClassAsMod(Imposter, ["DomainName", "ID-Imposter"]);
pm.registerClassAsMod(Amongi, ["DomainName", "ID-Amongi"]);

// Create a functional adress for the methods and match them with an IDAdress.
pm.setModToFunctionalAddress(
  ["DomainName", "ID-Imposter"],
  ["DomainName2", "functional-Imposter"]
);
pm.setModToFunctionalAddress(
  ["DomainName", "ID-Amongi"],
  ["DomainName2", "functional-Amongi"]
);

// Transform existing object methods by attributing functionalAdress to them.
try {
  pm.turnIntoPMUser(Blue, ["DomainName2", "functional-Imposter"]);
  pm.turnIntoPMUser(Yellow, ["DomainName2", "functional-Amongi"]);
} catch (error) {
  console.log(error);
}

// Blue and Yellow have mismatching dialogue proving that the PorteMod succesfully changed methods.
console.log("Who are you, Red ?");
Red.whoAreU();
console.log("Who are you, Blue ?");
Blue.whoAreU();
console.log("Who are you, Yellow ?");
Yellow.whoAreU();

/**
 * This example will show how you can do Aspect Programming using the PorteMod.
 */

class Counter {
  Count(a, b) {
    console.log(
      "Zero ! I have been Weavered. Here is your parameters (",
      a,
      b,
      ")."
    );
  }
}
const aspects = {
  count1: (a, b) => {
    console.log("One !");
    return [a, b];
  },
  count2: (a, b) => {
    console.log("Two !");
    //throw new Error("Stop PorteMod");
    return [a, b];
  },
  count3: (a, b) => {
    console.log("Three !");
    return [a, b];
  },
};
pm.registerClassAsMod(aspects, [
  "AxxelSoftware",
  "PorteMod",
  "ExampleMod",
  "aspectForCouter",
]);
pm.registerClassAsMod(Counter, [
  "AxxelSoftware",
  "PorteMod",
  "ExampleMod",
  "myLovelyCouter",
]);
pm.setModToFunctionalAddress(
  ["AxxelSoftware", "PorteMod", "ExampleMod", "myLovelyCouter"],
  ["myLovelyCounter"]
);

pm.addMethodsToFunctionalAddress(
  [
    ["AxxelSoftware", "PorteMod", "ExampleMod", "aspectForCouter", "count1"],
    ["AxxelSoftware", "PorteMod", "ExampleMod", "aspectForCouter", "count2"],
    ["AxxelSoftware", "PorteMod", "ExampleMod", "aspectForCouter", "count3"],
  ],
  ["myLovelyCounter"],
  "Count"
);
const counter = new Counter();

try {
  pm.turnIntoPMUser(counter, ["myLovelyCounter"]);
} catch (error) {
  console.log(error);
}

counter.Count("a", "b");
