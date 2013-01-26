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

echo -n "Building main CSS..."

if lessc less/main.less > ../demos/demo_files/main.css
then
  echo "OK"
else
  echo "FAILED"
fi

echo -n "Building additional Jcrop demo CSS..."

if lessc less/demos.less > ../demos/demo_files/demos.css
then
  echo "OK"
else
  echo "FAILED"
fi

pushd demos > /dev/null

echo "Now building demo HTML"
php -q build.php;
echo "Done building demo HTML"

#lessc less/docs.less > ../demos/demo_files/docs.css

popd > /dev/null
popd > /dev/null

echo "Done processing Jcrop build"
