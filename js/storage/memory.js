StubLocalStorage = function () {
    var data = {};

    this.clear = function () {
        data = {};
    };

    this.getItem = function (key) {
        var item = data[key];
        if (item == undefined) {
            item = null;
        }
        return item;
    };

    this.setItem = function (key, value) {
        data[key] = value;
    };
};

var HtmlLocalStorage = require(__dirname + '/html-local-storage');
var ManualSnapshotStrategy = require(__dirname + '/snapshot/manual-snapshot-strategy');
var memoryStorage = new HtmlLocalStorage(ManualSnapshotStrategy, new StubLocalStorage());
memoryStorage.name = 'memory';

module.exports = memoryStorage;
