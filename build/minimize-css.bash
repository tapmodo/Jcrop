#!/bin/bash

pushd `dirname $0` > /dev/null

echo 'Running Jcrop CSS minimization script'

export JCROP_BUILD=${JCROP_BUILD-`date +"%Y%m%d"`}
export JCROP_VERSION=${JCROP_VERSION-`cat VERSION`}

OUTFILE=jquery.Jcrop.min.css
MYBUILD="${JCROP_VERSION} (build:${JCROP_BUILD})"

echo "/* $OUTFILE $MYBUILD */" > ../css/${OUTFILE}

cleancss --s1 \
  ../css/jquery.Jcrop.css \
  >> ../css/${OUTFILE}

popd > /dev/null

