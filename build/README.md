Jcrop Build Folder
=================

The files in this folder are used by git and .git/hooks/pre-commit script.
Unless you are developing with Jcrop and git, you can ignore what's here.

### Build process requirements

* Twitter Bootstrap (as git submodule; see below)
* `bash` (for running build scripts)
* `php` (runnable from command line for build scripts)
* `csstidy` (for CSS minimization)
* `ugilfy` (for Javascript minimization)

### Initializing submodules

The demos and included HTML for this project use Twitter Bootstrap.

To build the project files using the scripts included in the `build`
directory, you must init and update the git submodules used by this project.

    $ git submodule init
    $ git submodule update

This will retrieve the submodules used by the Jcrop build process.

### Setting up the minimization pre-commit hook

If you would like to use this as a pre-commit hook, I have included the
pre-commit hook that I use named pre-commit.bash

    $ cp build/pre-commit.bash .git/hooks/pre-commit
    $ chmod +x !$

When you commit either `jquery.Jcrop.js` or `jquery.Jcrop.css`, the pre-commit
hook will automatically build and commit the minimized file as part of the same
commit.

##Your milage may vary!
