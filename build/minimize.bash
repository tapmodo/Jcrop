#!/bin/bash

echo 'Running Jcrop minimization script'

MYDATE=`date +"%Y%m%d"`
JCVER=`head js/jquery.Jcrop.js|grep Jcrop.js`
MYBUILD=`echo "$JCVER (build:$MYDATE)"`
cat build/LICENSE | sed -e "s/__BUILD__/$MYBUILD/" -e 's/jquery.Jcrop.js/jquery.Jcrop.min.js/' > js/jquery.Jcrop.min.js
jsmin < js/jquery.Jcrop.js >> js/jquery.Jcrop.min.js
git add js/jquery.Jcrop.min.js
