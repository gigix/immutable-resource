require.config({
    paths: {
        'html-local-storage': '../js/storage/html-local-storage',
        'manual-snapshot-strategy': '../js/storage/snapshot/manual-snapshot-strategy',
        'repository': '../js/repository'
    }
});

require(['html-local-storage', 'manual-snapshot-strategy', 'repository'], function() {
    var storage = new HtmlLocalStorage(ManualSnapshotStrategy);
    var repository = new Repository(storage, 'bulamu');

    var newHousehold = {
        owner: 'Renee Orser'
    };
    repository.create(newHousehold, function (error, id) {
        repository.load(id, function (error, household) {
            document.write(household.owner);
        });
    });
});
