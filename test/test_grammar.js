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
                var results = parser.feed(fs.readFileSync(grammarFolder + file, 'utf8')).results;
                expect(new Set(results.map(it => JSON.stringify(it))).size).to.eql(1);

                expect(results[0]).to.eql(require('../test/grammar/sample-story-01.json'));
            });

        done();
    });

    it('should unambiguously parse simple story', function () {
        expect(new Set(parser.feed("Title: My Sweet Story\n# My story\nOnce upon a time, in a farm.")
            .results.map(it => JSON.stringify(it))).size).to.eql(1);
    });
});