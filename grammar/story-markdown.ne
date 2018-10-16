@{%
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
%}

story -> title newline state newline:* states {% function(d){d[2].start = true;
var states;
if(d[4]){
states = d[4].concat([d[2]])
}else{
states = [d[2]];
}

return {title: d[0], states: states}}%}

title -> "Title: " non_empty_string {% itemAt(1) %}

states -> null | states newline state  {% function(d){  return d[0].concat(d[2]); } %}

state -> non_actionable_state {% itemAt(0) %}
          | actionable_state {% itemAt(0) %}

actionable_state -> non_actionable_state prompt:* newline actions newline default_action:? {% actionableState %}

non_actionable_state -> state_name:* non_empty_string newline:* ("##" | next_action ):? {% function(d){
  var final = (d[3] && d[3].length > 0 && d[3][0] == "##");
  if(!final){
    var nextAction = d[3]? d[3][0]:null;
  }
  return buildState(d[0], d[1],null,final, nextAction);
} %}

prompt ->  ">" [\s]:*  non_empty_string {% itemAt(2) %}

state_name -> "# " non_empty_string newline {% itemAt(1) %}

newline -> "\n" [\n\s]:*  {% emptyStr %}

actions -> action {% itemAt(0) %}
 |  action  newline actions {% mergeMap(2,0) %}

action ->  ":" non_empty_string  " -> " non_empty_string {% buildMap(1,3) %}

default_action -> "-->" non_empty_string {% itemAt(1) %}

next_action-> "--->" non_empty_string {% itemAt(1) %}

non_empty_string ->  [A-Za-z] [^\n\r]:* {% function(d){return d[0]+ d[1].join("") } %}