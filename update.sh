#!/bin/bash

hash git 2>/dev/null || { echo >&2 "git is required but not installed.  Aborting."; exit 1; }

git fetch origin