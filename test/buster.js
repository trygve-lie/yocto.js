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
        "test/yocto.sort.test.js",
        "test/yocto.each.test.js",
        "test/yocto.drop.test.js",
        "test/yocto.persist.test.js",
        "test/yocto.autosave.test.js",
        "test/yocto.uuid.test.js",
        "test/yocto.timestamp.test.js",
        "test/yocto.status.test.js"
    ]
};

config["Server tests"] = {
    rootPath: "../",
    environment: "node",
    sources: [
        "src/yocto.js"
    ],
    tests: [
        "test/yocto.core.test.js",
        "test/yocto.put.test.js",
        "test/yocto.get.test.js",
        "test/yocto.take.test.js",
        "test/yocto.sort.test.js",
        "test/yocto.each.test.js",
        "test/yocto.drop.test.js",
        "test/yocto.uuid.test.js",
        "test/yocto.timestamp.test.js",
        "test/yocto.status.test.js"
    ]
};