var config = module.exports;

config["Client tests"] = {
    rootPath: "./",
    environment: "browser",
    sources: [
        "src/yocto.js"
    ],
    tests: [
        "test/yocto.test.js"
    ]
};
