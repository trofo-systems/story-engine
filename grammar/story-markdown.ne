@{%
var itemAt = function (a) { return function (d) {return d[a]; } };
var appendItemChar = function (a, b) { return function (d) {return d[a] + d[b]; } };
var empty = function (d) { return []; };
var emptyStr = function (d) { return ""; };
var buildState = function(name, text, prompt){state = {name: name, text:text};if(prompt){state.prompt=prompt};return state;};
%}

story -> title newline states {% function(d){return {title: d[0], states: d[2]}}%}

title -> "Title: " non_empty_string {% itemAt(1) %}

states -> state {% function(d){return [d]} %}
          | state newline states {% function(d){  d[2].push(d[0]); return d[2];} %}

state -> non_actionable_state {% itemAt(0) %}
          | actionable_state {% itemAt(0) %}

actionable_state -> non_actionable_state newline actions {% function(d){d[0].actions = d[2];return d[0];} %}

non_actionable_state -> state_name newline non_empty_string newline:* prompt:* {% function(d){return buildState(d[0], d[2], d[4])} %}
                          | non_empty_string newline:* prompt:* {% function(d){return buildState(null, d[0], d[2])} %}

prompt ->  ">" [\s]:*  non_empty_string {% itemAt(2) %}

state_name -> "# " non_empty_string {% itemAt(1) %}

newline -> "\n" [\n\s]:*  {% emptyStr %}

actions -> action |  action  newline actions

intention ->  ":" non_empty_string  " -> " non_empty_string {% itemAt(1)%}

action -> intention

non_empty_string ->  [A-Za-z] [^\n\r]:* {% function(d){return d[0]+ d[1].join("") } %}
