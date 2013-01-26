#!/bin/bash

pushd `dirname $0` > /dev/null

echo 'Running Jcrop minimization script'

export JCROP_VERSION=${JCROP_VERSION-`cat VERSION`}
export JCROP_BUILD=${JCROP_BUILD-`date +"%Y%m%d"`}

OUTFILE=jquery.Jcrop.min.js
MYBUILD="${JCROP_VERSION} (build:${JCROP_BUILD})"

cat LICENSE | sed \
  -e "s/__BUILD__/${MYBUILD}/" \
  -e "s/__OUTFILE__/${OUTFILE}/" \
  > ../js/${OUTFILE}

uglifyjs --max-line-len 1024 -nc < ../js/jquery.Jcrop.js >> ../js/${OUTFILE}

popd > /dev/null

