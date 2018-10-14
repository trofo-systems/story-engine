@{%
var itemAt = function (a) { return function (d) {return d[a]; } };
var buildMap = function(a,b) {return function(d){ actions = {}; actions[d[a]] = d[b]; return actions; }};
var emptyStr = function (d) { return ""; };
var buildState = function(name, text, prompt){state = {name: name[0], text:text};return state;};
var mergeMap = function(map, element){ return function(d){ for (var property in d[element]) {
                                                               if (d[element].hasOwnProperty(property)) {
                                                                   d[map][property] = d[element][property];
                                                               }
                                                           }
                                                           return d[map];}};
%}

story -> title newline states {% function(d){return {title: d[0], states: d[2]}}%}

title -> "Title: " non_empty_string {% itemAt(1) %}

states -> state {% function(d){return [d]} %}
          | state newline states {% function(d){  return d[2].concat(d[0]); } %}

state -> non_actionable_state {% itemAt(0) %}
          | actionable_state {% itemAt(0) %}

actionable_state -> non_actionable_state prompt:* newline actions newline default_action:? {% function(d){d[0].actions = d[3];return d[0];} %}

non_actionable_state -> state_name:* non_empty_string newline:* "##":* {% function(d){return buildState(d[0], d[1])} %}

prompt ->  ">" [\s]:*  non_empty_string {% itemAt(2) %}

state_name -> "# " non_empty_string newline {% itemAt(1) %}

newline -> "\n" [\n\s]:*  {% emptyStr %}

actions -> action {% itemAt(0) %}
 |  action  newline actions {% mergeMap(2,0) %}

action ->  ":" non_empty_string  " -> " non_empty_string {% buildMap(1,3) %}

default_action -> "-->" non_empty_string

non_empty_string ->  [A-Za-z] [^\n\r]:* {% function(d){return d[0]+ d[1].join("") } %}