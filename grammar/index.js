const grammar = require("./story-markdown");
const fs = require('fs');
const nearley = require("nearley");
const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

function PlainStory(smdFile, encoding = 'utf8') {
    return parser.feed(fs.readFileSync(smdFile, encoding)).results[0];
}

module.exports = PlainStory;