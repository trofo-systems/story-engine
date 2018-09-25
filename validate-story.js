var chai = require('chai');
var expect = chai.expect;

const differ = (set1, set2) => [...set1].filter(num => !set2.has(num));

module.exports = function (storyInTest) {

    describe('Checking structure of story '+storyInTest.getTitle(), function () {

        var storyStates = storyInTest.getAllStates();

        var allStates = new Set(storyStates.map(it => it.name));

        var getInitialState = function () {
            return storyStates.filter(it => it.start)[0];
        };

        var getState = function (state) {
            return storyStates.filter(it => it.name === state)[0];
        };

        it('has no dead ends', function () {

            function extracted(map, key) {
                var d = map.get(key);
                if (!d) {
                    d = [];
                    map.set(key, d);
                }
                return d;
            }

            var map = new Map();

            storyStates.forEach(state => {
                for (var property in state.actions) {
                    extracted(map, state.actions[property]).push(state.name)
                }

                if (state.defaultAction) extracted(map, state.defaultAction).push(state.name);
                if (state.nextAction) extracted(map, state.nextAction).push(state.name);
            });

            var canReachFinal = new Set();

            function iterate(state) {
                if (!canReachFinal.has(state)) {
                    canReachFinal.add(state);

                    var newVar = map.get(state);
                    if (newVar) newVar.forEach(sn => iterate(sn))
                }
            }

            storyStates.filter(s => s.final).forEach(s => iterate(s.name));

            expect(differ(allStates, canReachFinal)).to.be.empty;
        });

        it('has no unreachable states', function () {
            var reachedStates = new Set();

            var iterate = function (stateName) {
                if (!reachedStates.has(stateName)) {
                    reachedStates.add(stateName);
                    var actions = getState(stateName).actions;

                    for (var property in actions) {
                        iterate(actions[property]);
                    }
                }
            };

            iterate(getInitialState().name);

            var difference = differ(allStates, reachedStates);

            expect(difference).to.be.empty;
        });

        it('has no duplicate states', function () {
            expect(allStates.size).to.eql(storyStates.length);
        });


        it('has one and only one start', function () {
            return expect(storyStates.filter(it => it.start)).to.have.length(1);
        });

        it('has no super long repeats in non-final states', function () {
            let longStates = storyStates.filter(it => !it.prompt && it.text.length > 300 && !it.final && !it.nextAction);
            if (longStates.length > 0) {
                console.log(`States that should had a propmpt property because their text is too long: ${longStates.map(it => it.name)}`);
            }
            return expect(longStates).to.have.length(0);
        });
    });
};