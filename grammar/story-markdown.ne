@{%
var itemAt = function (a) { return function (d) {return d[a]; } };
var appendItemChar = function (a, b) { return function (d) {return d[a] + d[b]; } };
var empty = function (d) { return []; };
var emptyStr = function (d) { return ""; };
var buildState = function(name, text, prompt){state = {name: name, text:text};return state;};
%}

story -> title newline states {% function(d){return {title: d[0], states: d[2]}}%}

title -> "Title: " non_empty_string {% itemAt(1) %}

states -> state {% function(d){return [d]} %}
          | state newline states {% function(d){  d[2].push(d[0]); return d[2];} %}

state -> non_actionable_state {% itemAt(0) %}
          | actionable_state {% itemAt(0) %}

actionable_state -> non_actionable_state prompt:* newline actions {% function(d){d[0].actions = d[4];return d[2];} %}

non_actionable_state -> state_name:* non_empty_string newline:* "##":* {% function(d){return buildState(d[0], d[1])} %}

prompt ->  ">" [\s]:*  non_empty_string {% itemAt(2) %}

state_name -> "# " non_empty_string newline {% itemAt(1) %}

newline -> "\n" [\n\s]:*  {% emptyStr %}

actions -> action |  action  newline actions

intention ->  ":" non_empty_string  " -> " non_empty_string {% itemAt(1)%}

action -> intention | "-->" non_empty_string

non_empty_string ->  [A-Za-z] [^\n\r]:* {% function(d){return d[0]+ d[1].join("") } %}
