const nearley = require("nearley");
const grammar = require("../grammar/story-markdown");
const chai = require('chai');
const expect = chai.expect;
const fs = require('fs');
describe('Grammar', function () {

    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

    it('compare markdowns and expected jsons', function (done) {

        var grammarFolder = './test/grammar/';
        fs.readdirSync(grammarFolder).filter(file => file.endsWith(".smd"))
            .forEach(file => {
                console.log("parsing " + file);
                parser.feed(fs.readFileSync(grammarFolder + file, 'utf8'));

                //TODO compare to .js

            });

        done();
    });

    it('should unambiguously parse simple story', function () {
        expect(new Set(parser.feed("Title: My Sweet Story\n# My story\nOnce upon a time, in a farm.")
            .results.map(it => JSON.stringify(it))).size).to.eql(1);
    });
});