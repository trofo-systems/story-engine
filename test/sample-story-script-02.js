module.exports = {
    "states": [
        {
            "name": "home",
            "text": "Hello. Would you like to go to the river or to the beach?",
            "actions": {
                "GoToBeachIntent": "beach",
            },
            "start": true
        }, {
            "name": "beach",
            "text": "You are now in the beach!. Congratulations!",
            "final": true
        }
    ]
};