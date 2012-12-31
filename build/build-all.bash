#!/bin/bash

pushd `dirname $0`

export JCROP_VERSION=${JCROP_VERSION-`cat VERSION`}
export JCROP_BUILD=${JCROP_BUILD-`date +"%Y%m%d"`}

lessc less/main.less > ../demos/demo_files/main.css;
lessc less/demos.less > ../demos/demo_files/demos.css;

pushd demos;
php -q build.php;

#lessc less/docs.less > ../demos/demo_files/docs.css

popd
popd

