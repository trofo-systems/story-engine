module.exports = {
    "states": [
        {
            "name": "home",
            "text": "Hello.",
            "prompt": "Would you like to go to the river or to the beach?",
            "actions": {
                "GoToBeachIntent": "beach",
                "GoToRiverIntent": "river",
                "Wait": "wait",
                "GoBySeaWalkIntent": "seawalk"
            },
            "start": true
        }, {
            "name": "river",
            "text": "You are now in the river. But there is nothing to do here.",
            "prompt": "What about going to the beach?",
            "actions": {
                "GoToBeachIntent": "beach"
            }
        }, {
            "name": "seawalk",
            "text": "You do the seawalk.",
            "nextAction": "beach"
        }, {
            "name": "wait",
            "text": "You waited a bit. But now you can only go to somewhere.",
            "defaultAction": "beach"
        },
        {
            "name": "beach",
            "text": "You are now in the beach!. Congratulations!",
            "final": true
        }
    ]
};