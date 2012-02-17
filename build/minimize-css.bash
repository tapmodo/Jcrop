#!/bin/bash

echo 'Running Jcrop CSS minimization script'

MYDATE=`date +"%Y%m%d"`
JCVER=`head js/jquery.Jcrop.js|grep Jcrop.js`
MYBUILD=`echo "$JCVER (build:$MYDATE)"`
echo "$MYBUILD */" | sed -e 's/^.*jquery\.Jcrop\.js/\/\* jquery.Jcrop.min.css/' > css/jquery.Jcrop.min.css
csstidy css/jquery.Jcrop.css --silent=true --template=high --sort_properties=true >> css/jquery.Jcrop.min.css
git add css/jquery.Jcrop.min.css
