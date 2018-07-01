const express = require('express');
const request = require('supertest');
const async = require('async');
const storyEngine = require('../index');

describe('Story box', function () {
    let server;

    beforeEach(function () {
        const app = express();

        var storyApp = storyEngine([require('./sample-story-script.js'), require('././sample-story-script-02.js')]);
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

    it('should pick a random story when none is indicated', function (done) {
        const requests = [];

        for (let i = 0; i < 10; i++) {
            requests.push(function (callback) {
                request(server)
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
                    .expect(200).then(function (response) {
                    callback(null, response.body.sessionAttributes.storyId);
                });
            });
        }
        async.parallel(requests, function (err, results) {
            const storyIds = new Set(results);
            if(storyIds.size>1){
                done();
            } else {
                done("It seems we can only get the same story back");
            }
        });
    });
});