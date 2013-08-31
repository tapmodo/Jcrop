#!/bin/bash

pushd `dirname $0` > /dev/null

export JCROP_VERSION=${JCROP_VERSION-`cat VERSION`}
export JCROP_BUILD=${JCROP_BUILD-`date +"%Y%m%d"`}
BASH=${BASH-/bin/bash}

echo "Building Jcrop version $JCROP_VERSION"
echo
cat ../MIT-LICENSE.txt
echo "Building all Jcrop related files"

$BASH compile-css.bash
$BASH minimize-css.bash
$BASH minimize-js.bash

popd > /dev/null

echo "Done processing Jcrop build"
