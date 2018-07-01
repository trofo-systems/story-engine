const express = require('express');
const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const storyEngine = require('../index');

function invokeIntent(server, intent, state = "home") {
    return request(server)
        .post('/story-box')
        .send({
            "session": {
                "new": false,
                "sessionId": "amzn1.echo-api.session.c357467e-8fb0-4241-a28c-10c95443ae77",
                "application": {
                    "applicationId": "amzn1.ask.skill.a0fedd27-bee4-42c3-957f-fc5c58a28f64"
                },
                "attributes": {
                    "state": state,
                    "storyId": "0"
                },
                "user": {
                    "userId": "amzn1.ask.account.AG7K6IQQR4FCV6PADAHG34C2UIHJRQSSS25ROLYZQIZXPX3BCI5IBVCLHG6RYRYHTJ4ZGEYEIAANDLXOLTTN5EPOFP2PTCJLQTN6N5COPROJM5OXQPVI7OQ34PHVJKIIITSWI4UIIVOSLBAESFWUR55CVHXMYSIBSYA4GJN5A6TEUB36NVANZMM4VVG3BJ3UQ3K2OADW2LDC5VA"
                }
            },
            request: {
                type: 'IntentRequest',
                intent: {
                    name: intent
                }
            }
        })
        .expect(200);
}

function statelessRequest(server, intent) {
    return request(server)
        .post('/story-box')
        .send({
            request: {
                type: 'IntentRequest',
                intent: {
                    name: intent
                }
            }
        });
}

describe('Story box', function() {
    let server;

    beforeEach(function() {
        const app = express();

        storyEngine([require('./sample-story-script-02.js')]); // unrelated engine just to ensure instances are isolated
        var storyApp = storyEngine([require('./sample-story-script.js')]);
        storyEngine([require('./sample-story-script-02.js')]); // unrelated engine just to ensure instances are isolated

        expect(storyApp.stories.length).to.eql(1);


        storyApp.express({
            expressApp: app,
            debug: true,
            checkCert: false
        });
        server = app.listen(3000);
    });

    afterEach(function() {
        server.close();
    });

    it('responds to invalid data', function() {
        return request(server)
            .post('/story-box')
            .send({})
            .expect(200).then(function(response) {
                return expect(response.body).to.eql({
                    version: '1.0',
                    response: {
                        directives: [],
                        shouldEndSession: false,
                        outputSpeech: {
                            type: 'SSML',
                            ssml: '<speak>Try again!</speak>'
                        }
                    },
                    sessionAttributes: {}
                });
            });
    });

    it('responds to a launch event', function() {
        return request(server)
            .post('/story-box')
            .send({
                "session": {
                    "new": true,
                    "sessionId": "amzn1.echo-api.session.355db8a7-ba3d-49db-843d-86ba41b045d3",
                    "application": {
                        "applicationId": "amzn1.ask.skill.a0fedd27-bee4-42c3-957f-fc5c58a28f64"
                    },
                    "user": {
                        "userId": "amzn1.ask.account.6OA"
                    }
                },
                request: {
                    type: 'LaunchRequest',
                }
            })
            .expect(200).then(function(response) {
                const ssml = response.body.response.outputSpeech.ssml;
                return expect(ssml).to.eql('<speak>Hello. Would you like to go to the river or to the beach?</speak>');
            });
    });

    it('responds to a help request', function() {
        return request(server)
            .post('/story-box')
            .send({
                "session": {
                    "new": true,
                    "sessionId": "amzn1.echo-api.session.355db8a7-ba3d-49db-843d-86ba41b045d3",
                    "application": {
                        "applicationId": "amzn1.ask.skill.a0fedd27-bee4-42c3-957f-fc5c58a28f64"
                    },
                    "user": {
                        "userId": "amzn1.ask.account.6OA"
                    }
                },
                request: {
                    type: 'IntentRequest',
                    intent: {
                        name: 'AMAZON.HelpIntent'
                    }
                }
            })
            .expect(200).then(function(response) {
                const ssml = response.body.response.outputSpeech.ssml;
                return expect(ssml).to.contain('On Story Box you\'ll be invited to join adventures where your decisions will be the key complete quests and find hidden treasures. Feel free to jump out at any time by saying STOP or CANCEL');
            });
    });

    it('responds to stop request', function () {
        return statelessRequest(server, 'AMAZON.StopIntent')
            .expect(200).then(function (response) {
                expect(response.body.response.shouldEndSession).to.eql(true);
                const ssml = response.body.response.outputSpeech.ssml;
                return expect(ssml).to.eql('<speak>Alright, come back soon for more adventures!</speak>');
            });
    });

    it('responds to cancel request', function () {
        return statelessRequest(server, 'AMAZON.CancelIntent')
            .expect(200).then(function (response) {
                expect(response.body.response.shouldEndSession).to.eql(true);
                const ssml = response.body.response.outputSpeech.ssml;
                return expect(ssml).to.eql('<speak>Alright, come back soon for more adventures!</speak>');
            });
    });

    it('should not change state for invalid transition', function () {
        return invokeIntent(server, 'GoToRiverIntent', "river").then(function (response) {
            expect(response.body.response.shouldEndSession).to.eql(false);
            return expect(response.body.response.outputSpeech.ssml).to.eql('<speak>Try again!</speak>');
        });
    });

    it('should activate default action', function () {
        return invokeIntent(server, 'GoToRiverIntent', "wait").then(function (response) {
            return expect(response.body.response.outputSpeech.ssml).to.eql('<speak>You are now in the beach!. Congratulations!</speak>');
        });
    });

    it('should go to next action', function () {
        return invokeIntent(server, 'GoBySeaWalkIntent', "home").then(function (response) {
            expect(response.body.response.outputSpeech.ssml).to.contain('You do the seawalk.');
            return expect(response.body.response.outputSpeech.ssml).to.contain('You are now in the beach!. Congratulations!');
        });
    });

    it('should reprompt when prompt tag present', function () {
        return invokeIntent(server, 'GoToRiverIntent', "home").then(function (response) {
            return expect(response.body.response.reprompt.outputSpeech.ssml).to.contain('What about going to the beach?');
        });
    });

    it('should repeat action completely even if prompt is present', function () {
        return invokeIntent(server, 'AMAZON.RepeatIntent', "home").then(function (response) {
            return expect(response.body.response.outputSpeech.ssml).to.eql('<speak>Hello. Would you like to go to the river or to the beach?</speak>');
        });
    });

    it('should repeat entire action when prompt not present', function () {
        return invokeIntent(server, 'AMAZON.RepeatIntent', "river").then(function (response) {
            return expect(response.body.response.outputSpeech.ssml).to.eql('<speak>You are now in the river. But there is nothing to do here. What about going to the beach?</speak>');
        });
    });

    it('should change state', function () {
        return invokeIntent(server, 'GoToBeachIntent', "river").then(function (response) {
            expect(response.body.response.shouldEndSession).to.eql(true);
            return expect(response.body.response.outputSpeech.ssml).to.eql('<speak>You are now in the beach!. Congratulations!</speak>');
        });
    });
});