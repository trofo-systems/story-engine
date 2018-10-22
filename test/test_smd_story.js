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

describe('Story engine', function () {
    let server;

    beforeEach(function () {
        const app = express();

        var storyApp = storyEngine(['./test/grammar/sample-story-01.smd']);
        storyApp.express({
            expressApp: app,
            debug: true,
            checkCert: false
        });
        server = app.listen(3000);
    });

    afterEach(function () {
        server.close();
    });

    it('should infer all states correctly', function () {
        return invokeIntent(server, 'SE_eeaadbbbfcc', "home").then(function (response) {
            expect(response.body.response.outputSpeech.ssml).to.contain('You do the seawalk.');
            return expect(response.body.response.outputSpeech.ssml).to.contain('You are now in the beach!. Congratulations!');
        });
    });
});