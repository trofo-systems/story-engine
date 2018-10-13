// Generated automatically by nearley, version 2.15.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

var itemAt = function (a) { return function (d) { return d[a]; } };
var appendItemChar = function (a, b) { return function (d) {return d[a] + d[b]; } };
var empty = function (d) { return []; };
var emptyStr = function (d) { return ""; };
var buildState = function(name, text, prompt){state = {name: name, text:text};if(prompt){state.prompt=prompt};return state;};
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "story", "symbols": ["title", "newline", "states"], "postprocess": function(d){return {title: d[0], states: d[2]}}},
    {"name": "title$string$1", "symbols": [{"literal":"T"}, {"literal":"i"}, {"literal":"t"}, {"literal":"l"}, {"literal":"e"}, {"literal":":"}, {"literal":" "}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "title", "symbols": ["title$string$1", "non_empty_string"], "postprocess": itemAt(1)},
    {"name": "states", "symbols": ["state"], "postprocess": function(d){return [d]}},
    {"name": "states", "symbols": ["states", "newline", "state"], "postprocess": function(d){d[0].push(d[2])}},
    {"name": "state", "symbols": ["non_actionable_state"]},
    {"name": "state", "symbols": ["actionable_state"], "postprocess": id},
    {"name": "actionable_state", "symbols": ["non_actionable_state", "newline", "actions"], "postprocess": function(d){d[0].actions = d[2]}},
    {"name": "non_actionable_state$ebnf$1", "symbols": []},
    {"name": "non_actionable_state$ebnf$1", "symbols": ["non_actionable_state$ebnf$1", "newline"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "non_actionable_state", "symbols": ["state_name", "newline", "non_empty_string", "non_actionable_state$ebnf$1", "prompt"], "postprocess": function(d){return buildState(d[0], d[2], d[4])}},
    {"name": "non_actionable_state$ebnf$2", "symbols": []},
    {"name": "non_actionable_state$ebnf$2", "symbols": ["non_actionable_state$ebnf$2", "newline"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "non_actionable_state", "symbols": ["non_empty_string", "non_actionable_state$ebnf$2", "prompt"], "postprocess": function(d){return buildState(null, d[0], d[2])}},
    {"name": "prompt", "symbols": [], "postprocess": empty},
    {"name": "prompt$ebnf$1", "symbols": []},
    {"name": "prompt$ebnf$1", "symbols": ["prompt$ebnf$1", /[\s]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "prompt", "symbols": [{"literal":">"}, "prompt$ebnf$1", "non_empty_string"], "postprocess": itemAt(2)},
    {"name": "state_name$string$1", "symbols": [{"literal":"#"}, {"literal":" "}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "state_name", "symbols": ["state_name$string$1", "non_empty_string"], "postprocess": itemAt(1)},
    {"name": "newline$ebnf$1", "symbols": []},
    {"name": "newline$ebnf$1", "symbols": ["newline$ebnf$1", /[\n\s]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "newline", "symbols": [{"literal":"\n"}, "newline$ebnf$1"], "postprocess": emptyStr},
    {"name": "actions", "symbols": ["action"]},
    {"name": "actions", "symbols": ["actions", "newline", "action"]},
    {"name": "intention$string$1", "symbols": [{"literal":" "}, {"literal":"-"}, {"literal":">"}, {"literal":" "}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "intention", "symbols": [{"literal":":"}, "non_empty_string", "intention$string$1", "non_empty_string"], "postprocess": itemAt(1)},
    {"name": "action", "symbols": ["intention"]},
    {"name": "non_empty_string$ebnf$1", "symbols": ["letter"]},
    {"name": "non_empty_string$ebnf$1", "symbols": ["non_empty_string$ebnf$1", "letter"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "non_empty_string", "symbols": ["non_empty_string$ebnf$1", "string"], "postprocess": function(d){return d[0].join("") + d[1]}},
    {"name": "letter", "symbols": [/[A-Za-z]/], "postprocess": function(d){return d[0]}},
    {"name": "string", "symbols": [], "postprocess": emptyStr},
    {"name": "string", "symbols": ["string", /[^\n\r]/], "postprocess": appendItemChar(0,1)}
]
  , ParserStart: "story"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
