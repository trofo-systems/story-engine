// Generated automatically by nearley, version 2.15.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

var itemAt = function (a) { return function (d) {return d[a]; } };
var buildMap = function(a,b) {return function(d){ actions = {}; actions[d[a]] = d[b]; return actions; }};
var emptyStr = function (d) { return ""; };
var buildState = function(name, text, prompt, final, nextAction){
state = {name: name[0], text:text};

if(final === true) {state.final = true;}
if(nextAction) {state.nextAction = nextAction}
 return state;
};

var mergeMap = function(map, element){ return function(d){ for (var property in d[element]) {
                                                               if (d[element].hasOwnProperty(property)) {
                                                                   d[map][property] = d[element][property];
                                                               }
                                                           }
                                                           return d[map];}};

const actionableState = function(d){d[0].actions = d[3];
    if(d[1].length > 0)d[0].prompt = d[1][0];
    if(d[5]) d[0].defaultAction = d[5];
    return d[0];};
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "story$ebnf$1", "symbols": []},
    {"name": "story$ebnf$1", "symbols": ["story$ebnf$1", "newline"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "story", "symbols": ["title", "newline", "state", "story$ebnf$1", "states"], "postprocess":  function(d){d[2].start = true;
        var states;
        if(d[4]){
        states = d[4].concat([d[2]])
        }else{
        states = [d[2]];
        }
        
        return {title: d[0], states: states}}},
    {"name": "title$string$1", "symbols": [{"literal":"T"}, {"literal":"i"}, {"literal":"t"}, {"literal":"l"}, {"literal":"e"}, {"literal":":"}, {"literal":" "}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "title", "symbols": ["title$string$1", "non_empty_string"], "postprocess": itemAt(1)},
    {"name": "states", "symbols": []},
    {"name": "states", "symbols": ["states", "newline", "state"], "postprocess": function(d){  return d[0].concat(d[2]); }},
    {"name": "state", "symbols": ["non_actionable_state"], "postprocess": itemAt(0)},
    {"name": "state", "symbols": ["actionable_state"], "postprocess": itemAt(0)},
    {"name": "actionable_state$ebnf$1", "symbols": []},
    {"name": "actionable_state$ebnf$1", "symbols": ["actionable_state$ebnf$1", "prompt"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "actionable_state$ebnf$2", "symbols": ["default_action"], "postprocess": id},
    {"name": "actionable_state$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "actionable_state", "symbols": ["non_actionable_state", "actionable_state$ebnf$1", "newline", "actions", "newline", "actionable_state$ebnf$2"], "postprocess": actionableState},
    {"name": "non_actionable_state$ebnf$1", "symbols": []},
    {"name": "non_actionable_state$ebnf$1", "symbols": ["non_actionable_state$ebnf$1", "state_name"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "non_actionable_state$ebnf$2", "symbols": []},
    {"name": "non_actionable_state$ebnf$2", "symbols": ["non_actionable_state$ebnf$2", "newline"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "non_actionable_state$ebnf$3$subexpression$1$string$1", "symbols": [{"literal":"#"}, {"literal":"#"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "non_actionable_state$ebnf$3$subexpression$1", "symbols": ["non_actionable_state$ebnf$3$subexpression$1$string$1"]},
    {"name": "non_actionable_state$ebnf$3$subexpression$1", "symbols": ["next_action"]},
    {"name": "non_actionable_state$ebnf$3", "symbols": ["non_actionable_state$ebnf$3$subexpression$1"], "postprocess": id},
    {"name": "non_actionable_state$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "non_actionable_state", "symbols": ["non_actionable_state$ebnf$1", "non_empty_string", "non_actionable_state$ebnf$2", "non_actionable_state$ebnf$3"], "postprocess":  function(d){
          var final = (d[3] && d[3].length > 0 && d[3][0] == "##");
          if(!final){
            var nextAction = d[3]? d[3][0]:null;
          }
          return buildState(d[0], d[1],null,final, nextAction);
        } },
    {"name": "prompt$ebnf$1", "symbols": []},
    {"name": "prompt$ebnf$1", "symbols": ["prompt$ebnf$1", /[\s]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "prompt", "symbols": [{"literal":">"}, "prompt$ebnf$1", "non_empty_string"], "postprocess": itemAt(2)},
    {"name": "state_name$string$1", "symbols": [{"literal":"#"}, {"literal":" "}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "state_name", "symbols": ["state_name$string$1", "non_empty_string", "newline"], "postprocess": itemAt(1)},
    {"name": "newline$ebnf$1", "symbols": []},
    {"name": "newline$ebnf$1", "symbols": ["newline$ebnf$1", /[\n\s]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "newline", "symbols": [{"literal":"\n"}, "newline$ebnf$1"], "postprocess": emptyStr},
    {"name": "actions", "symbols": ["action"], "postprocess": itemAt(0)},
    {"name": "actions", "symbols": ["action", "newline", "actions"], "postprocess": mergeMap(2,0)},
    {"name": "action$string$1", "symbols": [{"literal":" "}, {"literal":"-"}, {"literal":">"}, {"literal":" "}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "action", "symbols": [{"literal":":"}, "non_empty_string", "action$string$1", "non_empty_string"], "postprocess": buildMap(1,3)},
    {"name": "default_action$string$1", "symbols": [{"literal":"-"}, {"literal":"-"}, {"literal":">"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "default_action", "symbols": ["default_action$string$1", "non_empty_string"], "postprocess": itemAt(1)},
    {"name": "next_action$string$1", "symbols": [{"literal":"-"}, {"literal":"-"}, {"literal":"-"}, {"literal":">"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "next_action", "symbols": ["next_action$string$1", "non_empty_string"], "postprocess": itemAt(1)},
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
