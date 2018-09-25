function Story(storyScript) {
    this.intents = new Map();

    this.getTitle = function () {
        return storyScript.title || "untitled";
    };

    this.getAllStates = function () {
        return storyScript.states;
    };

    this.getIntents = function (intentName) {
        if (!this.intents.get(intentName)) {
            this.intents.set(intentName, []);
        }
        return this.intents.get(intentName);
    };

    this.isIntentValid = function (intent, state) {
        return this.intents.get(intent).indexOf(state.name) >= 0
    };

    this.getState = function (stateName) {
        return storyScript.states.find(it => it.name === stateName);
    };

    storyScript.states.forEach(state => {
        for (let property in state.actions) {
            if (state.actions.hasOwnProperty(property)) {
                this.getIntents(property).push(state.name);
            }
        }
    });

    this.getInitialState = function () {
        return storyScript.states.find(it => it.start)
    }
}

module.exports = Story;