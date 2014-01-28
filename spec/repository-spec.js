describe('Repository', function () {
    var Repository = require('../js/repository');
    var patientRepository = new Repository('patient');

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
});