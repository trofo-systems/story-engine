#!/usr/bin/env bash

 watch -n 2 "nearleyc grammar/story-markdown.ne -o grammar/story-markdown.js && nearley-unparse -n 1 grammar/story-markdown.js"