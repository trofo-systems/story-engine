var chai = require('chai');
var expect = chai.expect;

const differ = (set1, set2) => [...set1].filter(num => !set2.has(num));


module.exports = function (story, model) {
    describe('Models', function () {

        it('should not have undeclared intents', function () {
            var storyIntents = new Set();
            story.getAllStates().forEach(
                state => {
                    for (var property in state.actions) {
                        storyIntents.add(property);
                    }
                }
            );

            var registeredIntents = new Set(model.interactionModel.languageModel.intents.map(it => it.name));

            expect(differ(storyIntents, registeredIntents)).to.be.empty;

        });

        // TODO this does not need to run for every story
        it('Model should not have duplicate utterance samples', function (done) {
                const samples = new Set();
                var obj = model;
                var error = false;

                obj.interactionModel.languageModel.intents.forEach(intent => {
                    if (intent.samples) {
                        intent.samples.forEach(sample => {
                            if (samples.has(sample)) {
                                error = true;
                                done("Duplicate sample " + sample + " on intent " + intent.name + ' on model ' + modelFile);
                            }
                            samples.add(sample);
                        });
                    }
                });
                if (!error) done();
            }
        );

    });
};