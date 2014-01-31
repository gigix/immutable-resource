describe('Repository', function () {
    var memoryStorage = require('../js/storage/memory');

    var EsStorage = require('../js/storage/es');
    var esStorage = new EsStorage('http://localhost:9200', 'immutable-resource');

    [memoryStorage, esStorage].forEach(function (storage) {
        testRepositoryUponStorage(storage);
    });
});

function testRepositoryUponStorage(storage) {
    describe('upon [' + storage.name + '] storage', function () {
        var Repository = require('../js/repository');
        var patientRepository = new Repository(storage, 'patient');

        beforeEach(function (done) {
            patientRepository.clear(done);
            patientRepository.all(function (error, resources) {
                expect(resources.length).toEqual(0);
                done();
            });
        });

        describe('create', function () {
            it('should create a new resource', function (done) {
                var newPatient = {
                    firstName: 'Jeff',
                    lastName: 'Xiong'
                };
                patientRepository.create(newPatient, function (error, persistedPatientId) {
                    expect(error).toEqual(null);
                    expect(persistedPatientId).not.toEqual(undefined);
                    patientRepository.load(persistedPatientId, function (error, loadedPatient) {
                        expect(loadedPatient.firstName).toEqual('Jeff');
                        done();
                    });
                });
            });
        });

        describe('update', function () {
            it('should update final state of resource', function (done) {
                var newPatient = {
                    firstName: 'Jie',
                    lastName: 'Xiong'
                };
                patientRepository.create(newPatient, function (error, persistedPatientId) {
                    patientRepository.load(persistedPatientId, function (error, loadedPatient) {
                        patientRepository.update(loadedPatient.id, {firstName: 'Jeff'}, function (error) {
                            patientRepository.load(persistedPatientId, function (error, updatedPatient) {
                                expect(updatedPatient.firstName).toEqual('Jeff');
                                done();
                            });
                        });
                    });
                });
            });
        });

        describe('delete', function() {
            it("should return true if delete was successful", function (done) {
                var newPatient = {
                    firstName: 'Jie',
                    lastName: 'Xiong'
                };
                patientRepository.create(newPatient, function(error, persistedPatientId) {
                    patientRepository.delete(persistedPatientId, function(resourceDeleted) {
                        expect(resourceDeleted).toBe(true);
                        patientRepository.load(persistedPatientId, function (error, loadedPatient){
                            expect(error).not.toBeNull();
                            expect(loadedPatient).toBeNull();
                            done();
                        });
                    });
                });
            });
        })
    });
}


