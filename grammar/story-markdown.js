// Generated automatically by nearley, version 2.15.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

var itemAt = function (a) { return function (d) {return d[a]; } };
var appendItemChar = function (a, b) { return function (d) {return d[a] + d[b]; } };
var empty = function (d) { return []; };
var emptyStr = function (d) { return ""; };
var buildState = function(name, text, prompt){state = {name: name, text:text};return state;};
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "story", "symbols": ["title", "newline", "states"], "postprocess": function(d){return {title: d[0], states: d[2]}}},
    {"name": "title$string$1", "symbols": [{"literal":"T"}, {"literal":"i"}, {"literal":"t"}, {"literal":"l"}, {"literal":"e"}, {"literal":":"}, {"literal":" "}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "title", "symbols": ["title$string$1", "non_empty_string"], "postprocess": itemAt(1)},
    {"name": "states", "symbols": ["state"], "postprocess": function(d){return [d]}},
    {"name": "states", "symbols": ["state", "newline", "states"], "postprocess": function(d){  d[2].push(d[0]); return d[2];}},
    {"name": "state", "symbols": ["non_actionable_state"], "postprocess": itemAt(0)},
    {"name": "state", "symbols": ["actionable_state"], "postprocess": itemAt(0)},
    {"name": "actionable_state$ebnf$1", "symbols": []},
    {"name": "actionable_state$ebnf$1", "symbols": ["actionable_state$ebnf$1", "prompt"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "actionable_state", "symbols": ["non_actionable_state", "actionable_state$ebnf$1", "newline", "actions"], "postprocess": function(d){d[0].actions = d[4];return d[2];}},
    {"name": "non_actionable_state$ebnf$1", "symbols": []},
    {"name": "non_actionable_state$ebnf$1", "symbols": ["non_actionable_state$ebnf$1", "state_name"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "non_actionable_state$ebnf$2", "symbols": []},
    {"name": "non_actionable_state$ebnf$2", "symbols": ["non_actionable_state$ebnf$2", "newline"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "non_actionable_state$ebnf$3", "symbols": []},
    {"name": "non_actionable_state$ebnf$3$string$1", "symbols": [{"literal":"#"}, {"literal":"#"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "non_actionable_state$ebnf$3", "symbols": ["non_actionable_state$ebnf$3", "non_actionable_state$ebnf$3$string$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "non_actionable_state", "symbols": ["non_actionable_state$ebnf$1", "non_empty_string", "non_actionable_state$ebnf$2", "non_actionable_state$ebnf$3"], "postprocess": function(d){return buildState(d[0], d[1])}},
    {"name": "prompt$ebnf$1", "symbols": []},
    {"name": "prompt$ebnf$1", "symbols": ["prompt$ebnf$1", /[\s]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "prompt", "symbols": [{"literal":">"}, "prompt$ebnf$1", "non_empty_string"], "postprocess": itemAt(2)},
    {"name": "state_name$string$1", "symbols": [{"literal":"#"}, {"literal":" "}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "state_name", "symbols": ["state_name$string$1", "non_empty_string", "newline"], "postprocess": itemAt(1)},
    {"name": "newline$ebnf$1", "symbols": []},
    {"name": "newline$ebnf$1", "symbols": ["newline$ebnf$1", /[\n\s]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "newline", "symbols": [{"literal":"\n"}, "newline$ebnf$1"], "postprocess": emptyStr},
    {"name": "actions", "symbols": ["action"]},
    {"name": "actions", "symbols": ["action", "newline", "actions"]},
    {"name": "intention$string$1", "symbols": [{"literal":" "}, {"literal":"-"}, {"literal":">"}, {"literal":" "}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "intention", "symbols": [{"literal":":"}, "non_empty_string", "intention$string$1", "non_empty_string"], "postprocess": itemAt(1)},
    {"name": "action", "symbols": ["intention"]},
    {"name": "action$string$1", "symbols": [{"literal":"-"}, {"literal":"-"}, {"literal":">"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "action", "symbols": ["action$string$1", "non_empty_string"]},
    {"name": "non_empty_string$ebnf$1", "symbols": []},
    {"name": "non_empty_string$ebnf$1", "symbols": ["non_empty_string$ebnf$1", /[^\n\r]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "non_empty_string", "symbols": [/[A-Za-z]/, "non_empty_string$ebnf$1"], "postprocess": function(d){return d[0]+ d[1].join("") }}
]
  , ParserStart: "story"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
