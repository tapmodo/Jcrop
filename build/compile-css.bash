#!/bin/bash

echo "Running Jcrop CSS compilation script using LESS"
echo "More information here: http://lesscss.org"

pushd `dirname $0` > /dev/null

export JCROP_VERSION=${JCROP_VERSION-`cat VERSION`}
export JCROP_BUILD=${JCROP_BUILD-`date +"%Y%m%d"`}

echo -n "Building Jcrop CSS..."
if lessc less/Jcrop.less > ../css/jquery.Jcrop.css
then
  echo "OK"
else
  echo "FAILED"
fi

popd > /dev/null

echo "Jcrop CSS compilation finished"
