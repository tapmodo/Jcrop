#!/bin/bash

echo 'Running pre-commit hook'
if git diff --no-ext-diff --cached --exit-code js/jquery.Jcrop.js > /dev/null
then
  echo 'No changes made to Jcrop javascript'
else
  echo 'Building minimized Jcrop javascript file'
  bash build/minimize-js.bash
fi

if git diff --no-ext-diff --cached --exit-code css/jquery.Jcrop.css > /dev/null
then
  echo 'No changes made to Jcrop CSS file'
else
  echo 'Building minimized Jcrop CSS file'
  bash build/minimize-css.bash
fi

