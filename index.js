const alexa = require('alexa-app');
const Story = require('./stories');
const plainStory = require('./grammar');
const crypto = require('crypto');

module.exports = function (storyScripts) {

    const app = new alexa.app('story-box');
    let availableStories = [];

    var newStory = function (req, res) {
        const storyId = Math.floor(Math.random() * Object.keys(availableStories).length);
        const state = availableStories[storyId].getInitialState();
        req.getSession().set("storyId", storyId);

        playState(state, req, res);
    };

    app.launch(function (req, res) {
        newStory(req, res);
    });

    function playState(state, req, res) {
        if (state) {
            res.shouldEndSession(state.final === true);
            req.getSession().set("state", state.name);
            res.say(state.text);
            if (state.prompt) {
                res.say(' ' + state.prompt);
                res.reprompt(state.prompt);
            }
            if (state.nextAction) {
                let story = availableStories[req.getSession().get('storyId')];
                const nextState = story.getState(state.nextAction);

                playState(nextState, req, res);
            }
        } else {
            res.shouldEndSession(false);
            res.say("Try again!")
        }
    }

    let listener = function (intent) {
        app.intent(intent, function (req, res) {
            let session = req.getSession();
            let story = availableStories[session.get('storyId')];
            const state = story.getState(session.get("state"));

            let nextState;

            if (story.isIntentValid(intent, state)) {
                nextState = story.getState(state.actions[intent]);
            } else if (state.defaultAction) {
                nextState = story.getState(state.defaultAction);
            }
            playState(nextState, req, res);
        });
    };

    app.intent('AMAZON.HelpIntent', function (req, res) {
        res.shouldEndSession(false);
        res.say("On Story Box you'll be invited to join adventures where your decisions will be the key complete quests and find hidden treasures. Feel free to jump out at any time by saying STOP or CANCEL.")
            .pause('2s');
        newStory(req, res);
    });

    app.intent('AMAZON.StopIntent', function (req, res) {
        res.say('Alright, come back soon for more adventures!');
    });

    app.intent('AMAZON.RepeatIntent', function (req, res) {
        let session = req.getSession();
        let story = availableStories[session.get('storyId')];
        const state = story.getState(session.get("state"));

        playState(state, req, res);
    });

    app.intent('AMAZON.CancelIntent', function (req, res) {
        res.say('Alright, come back soon for more adventures!');
    });

    app.error = function (e, req, res) {
        res.shouldEndSession(false);
        res.say("Try again!");
    };

    function md5(value) {
        return crypto.createHash('md5').update(value).digest("hex").replace(/[0-9]/g, '');
    }

    function mapIntents(story) {
        let mappings = [];

        story.states.forEach(state => {
            let actions = {};

            for (let property in state.plainActions) {
                if (state.plainActions.hasOwnProperty(property)) {
                    var samples = state.plainActions[property];
                    var intentKey = "SE_"+md5(JSON.stringify(samples));
                    actions[intentKey] = property;

                    mappings.push({name: intentKey, samples: samples})

                }
            }
            state.actions = actions;
        });
        //TODO this info is valuable but not exposed enough
        console.log("Ensure you have this in your model: " + JSON.stringify(mappings));
    }

    storyScripts.forEach(it => {
        if (typeof it === 'string') {
            let plain = plainStory(it);

            mapIntents(plain);

            availableStories.push(new Story(plain));
        } else {
            availableStories.push(new Story(it));
        }
    });

    availableStories.forEach(it => {
        for (let intent of it.intents.keys()) {
            listener(intent);
        }
    });

    app.stories = availableStories;

    app.testStories = function () {
        availableStories.forEach(story => require('./validate-story')(story));
    };

    app.testModel = function (model) {
        availableStories.forEach(story => require('./validate-model')(story, model));
    };

    return app;

};
