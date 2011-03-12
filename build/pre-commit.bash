#!/bin/bash

echo 'Running pre-commit hook'
if git diff --cached --exit-code js/jquery.Jcrop.js > /dev/null
then
  echo 'No changes made to Jcrop javascript'
else
  echo 'Building minimized Jcrop javascript file'
  bash build/minimize.bash
fi

