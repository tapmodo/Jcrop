#!/bin/bash

JSFILE=js/jquery.Jcrop.js
CSSFILE=css/jquery.Jcrop.css

echo 'Running pre-commit hook'
if git diff --no-ext-diff --cached --exit-code "${JSFILE}" > /dev/null
then
  echo 'No changes made to Jcrop javascript'
else
  echo 'Building minimized Jcrop javascript file'
  bash build/minimize-js.bash
  git add "${JSFILE}"
fi

if git diff --no-ext-diff --cached --exit-code "${CSSFILE}" > /dev/null
then
  echo 'No changes made to Jcrop CSS file'
else
  echo 'Building minimized Jcrop CSS file'
  bash build/minimize-css.bash
  git add "${CSSFILE}"
fi

