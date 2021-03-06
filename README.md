[![Build Status](https://travis-ci.org/trofo-systems/story-engine.svg?branch=master)](https://travis-ci.org/trofo-systems/story-engine)
[![NPM version](https://img.shields.io/npm/v/story-engine.svg)](https://www.npmjs.com/package/story-engine)
[![Known Vulnerabilities](https://snyk.io/test/github/trofo-systems/story-engine/badge.svg?targetFile=package.json)](https://snyk.io/test/github/trofo-systems/story-engine?targetFile=package.json)
[![Coverage Status](https://coveralls.io/repos/github/trofo-systems/story-engine/badge.svg?branch=master)](https://coveralls.io/github/trofo-systems/story-engine?branch=master)
# story-engine
An engine to support user decision driven stories using Alexa skills

This code was initially part of a personal Alexa Skill. I believe there's a good opportunity to make it a component, but it requires some polishing. I'll keep it under version 0.x until I consider it ready for shipping.

# Example

You can find an example alexa skill running on story-engine on [story-engine-skill-example](https://github.com/trofo-systems/story-engine-skill-example). This project is under ask-cli format already, making it easy to be deployed and tested on real echo devices.

```
Title: Lost in a romm

# home

You woke up in an empty room. There's only a locked door and an open window ahead of you. Would you like to knock the door or jump out of the window?

:Knock -> door
:Check the door -> door
:Jump out -> window
:Escape through the window -> window

# door

You knock on the door several times, but you can hear nothing but silence. You move then to the window.

--> window

# window

You get close to the window and you can feel a cold gust. It is very dark but today you are feeling specially brave. For some reason, you think it is a good idea to jump through the window <audio src='https://s3.amazonaws.com/ask-soundlibrary/magic/amzn_sfx_magic_blast_1x_01.mp3'/> and then you find yourself back in your bed. It was just a dream.

##
```

This text above is following story-engines's own custom grammar. [Click here to see the grammar rail road diagram](docs/grammar-rail-road.png)


You can also build a story as if it was a series of states and its possible transitions.

```json
{
    "title": "Lost in a room",
    "states": [
        {
            "name": "home",
            "text": "You woke up in an empty room. There's only a locked door and an open window ahead of you. Would you like to knock the door or jump out of the window?",
            "actions": {
                "KnockDoorhIntent": "door",
                "JumpWindowIntent": "window"
            },
            "start": true
        }, {
            "name": "door",
            "text": "You knock on the door several times, but you can hear nothing but silence. You move then to the window.",
            "nextAction": "window"
        }, {
            "name": "window",
            "text": "You get close to the window and you can feel a cold gust. It is very dark but today you are feeling specially brave. For some reason, you think it is a good idea to jump through the window <audio src='https://s3.amazonaws.com/ask-soundlibrary/magic/amzn_sfx_magic_blast_1x_01.mp3'/> and then you find yourself back in your bed. It was just a dream.",
            "final": true
        }
    ]
}

```
# State's properties

Every state has to have a `name` and a `text`. And optionally it can also have:

* `prompt`: If the user simply stays quiet after a question, the text on "prompt" will kick in. This can be a better a experience than just replaying all the state text.
* `nextActiont`: for automatic transitions. No user input required. This is the same as a state concatenation.
* `actions`: a map between the user intent and the respective state. This is really where the possible transitions are mapped. If the user inputed an intent not mapped for the current state, the skill will just reply with an error and request another user input.
* `defaultAction`: This is actioned when the user did provide some input, i.e. an intent was identified, but it is not mapped on the current state.
* `start`: Every story should have one and only one startting point.
* `final`: true/false. Your story can have several different endings. At least one is mandatory.

# Publishing the story

story-engine uses [alexa-app](https://github.com/alexa-js/alexa-app) under the hood, and it will return an instance of `app` when the stories are loaded.
If you are exposing your backend using lambdas, you could do something like this

```javascript
exports.handler = require('story-engine')([{"states":[]}]).lambda();
```

Of course stories will be quite big objects, so it might be a good idea putting them into separate files and then just using require to pass them to story-engine

```javascript
const storyEngine = require('story-engine');
const stories = [
                    require('./my-story')
                ];
exports.handler = storyEngine(stories).lambda();
```

# Serving several stories

`story-engine` has support for multiple stories. In the current implementation you can load as many different stories as you like and the engine will randomly pick one whenever a session starts and stick to it until the session terminates.

```javascript
const storyEngine = require('story-engine');
const stories = [
                    require('./storyA'),
                    require('./storyB')
                ];
exports.handler = storyEngine(stories).lambda();
```

# Adherance to Amazon standards

Following Amzon's guidelines (missing reference), some intents will be implemented by default.

## AMAZON.StopIntent and AMAZON.CancelIntent

Simply stop the skill immediately with a short goodbye message.

## AMAZON.HelpIntent

Required by Amazon. The name is self-explanatory; it provides a short explanation of the app dynamic and start a new story right away.

## AMAZON.RepeatIntent

This is also required by Amazon and it has to repeat the previous response entirely. I tried to just play only the values defined on the `prompt` property and that got rejected as part of the certification process.

# Testing your story

`story-engine` also helps to ensure your story is consistent and enjoyable. As long as you have `mocha` and `chai` in your test dependencies scope, you can pull in some automatic tests. If you don't, just run the following:

```bash
npm i mocha --save-dev
npm i chai --save-dev
```

And then simply create a file in your test folder with something like this:

```javascript
let app = require('story-engine')([require('../walk-on-the-beach-story')]);
app.testStories();
app.testModel(require("../../../models/en-US"));
```

This will automatically check your story and your model against the following items:

```
  story structure
    ✓ has no dead ends
    ✓ has no unreachable states
    ✓ has no duplicate states
    ✓ has one and only one start
    ✓ has no super long repeats in non-final states

  Models
    ✓ should not have undeclared intents
    ✓ model should not have duplicate utterance samples
```

The idea is that the test names should be meaningful enough to highlight what's wrong. If not, let's make them better together.