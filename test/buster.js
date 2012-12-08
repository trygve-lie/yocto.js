var config = module.exports;

config["Client tests"] = {
    rootPath: "./",
    environment: "browser",
    sources: [
        "../src/es5.js",
        "../src/yocto.js"
    ],
    tests: [
        "yocto.core.test.js",
        "yocto.put.test.js",
        "yocto.get.test.js"
    ]
};
