var config = module.exports;

config["Client tests"] = {
    rootPath: "../",
    environment: "browser",
    sources: [
        "src/es5.js",
        "src/yocto.js"
    ],
    tests: [
        "test/yocto.core.test.js",
        "test/yocto.put.test.js",
        "test/yocto.get.test.js",
        "test/yocto.take.test.js",
        "test/yocto.sort.test.js"
    ]
};

// TODO I: Take a peek at when.js how to do dual browser and node testing
// https://github.com/cujojs/when/blob/master/test/buster.js

// TODO II: Make tests run in TravisCI:
// https://github.com/azu/BusterJS_TravisCI