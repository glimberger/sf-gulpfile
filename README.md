# SF-Gulpfile - Gulpfile for Symfony projects

This is an implementation for Symfony projects of [Gulp](http://gulpjs.com/) the well-named task runner, build upon [Node.js](https://nodejs.org/en/).
A  pre-configured `gulpfile.js` is provided (this is mandatory for Gulp), along with the package definitions for NPM. 
Also a template `gulpconfig.json` that contains all asset and pattern declarations is provided.

The AsseticBundle needs to be installed in your project
[Install Assetic](http://symfony.com/doc/current/cookbook/assetic/asset_management.html#installing-and-enabling-assetic)
[Basic configuration](#assetic-configuration)


## Installation

#### Install Node.js: 

* [Download for Windows](https://nodejs.org/en/download/package-manager/#windows)

* [Download for OSX](https://nodejs.org/en/download/package-manager/#osx)

Test: run `node -v` . The version should be higher than 5.6.0


#### Update NPM (Node Package Manager):

Node comes with npm installed so you should have a version of npm. However, npm gets updated more frequently than Node does.

``` sh
$ npm install npm -g
```

Test: run `npm -v` . The version should be higher than 3.8.8


#### Clone files from repository

Files have to be cloned at the root of your project.

Note: To clone a single file on Github, we need `svn` to operate. Mac OSX has a pre-installed version.

Clone `gulpfile.js`:
```sh
$ svn export https://github.com/glimberger/sf-gulpfile.git/trunk/src/gulpfile.js
```

Clone `package.json`:
```sh
$ svn export https://github.com/glimberger/sf-gulpfile.git/trunk/src/package.json
```

Clone the template `gulpconfig.json`:
```sh
$ svn export https://github.com/glimberger/sf-gulpfile.git/trunk/src/gulpconfig.json
```


#### Install gulp:

```sh
$ npm install --global gulp-cli
```


#### Install packages
```sh
$ npm install
```


## Usage

```
$ gulp
```


## Extras

#### Assetic configuration
A basic configuration :
```yaml
# app/config.yml
assetic:
    debug:            "%kernel.debug%"
    use_controller:   false
    bundles:
        - YourBundle
        - YourOtherBundle
    filters:
        cssrewrite: ~
```

#### Bower to manage front-end libraries

Bower is a front-end package manager.
Files need to be copied at the root of your project

Clone bower runcom file:
```sh
$ svn export https://github.com/glimberger/sf-gulpfile.git/trunk/extras/.bowerrc
```

Clone bower config file:
```sh
$ svn export https://github.com/glimberger/sf-gulpfile.git/trunk/extras/bower.json
```

Install bower:
```sh
$ npm install -g bower
```

Install packages:
```sh
$ bower install
```

This command install a `vendor` directory in `web`.