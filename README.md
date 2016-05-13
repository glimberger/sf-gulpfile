# SF-Gulpfile - Gulpfile for Symfony projects

This is an implementation for Symfony projects of [Gulp](http://gulpjs.com/) the well-named task runner, build upon [Node.js](https://nodejs.org/en/).

It means to combine the utility of Assetic and the power of scss processor.

A  pre-configured `gulpfile.js` is provided (this is mandatory for Gulp), along with the package definitions for NPM.
Also a template `config.json`, containing all asset and pattern declarations, is provided.

The AsseticBundle should be installed in your project : 

[Install Assetic](http://symfony.com/doc/current/cookbook/assetic/asset_management.html#installing-and-enabling-assetic)

[Basic configuration](#assetic-configuration)


## Installation

Place yourself at the root of your project.

#### Install Node.js: 

[Download for Windows](https://nodejs.org/en/download/package-manager/#windows)

[Download for OSX](https://nodejs.org/en/download/package-manager/#osx)

Test: Run `node -v` . The version should be higher than 5.6.0.


#### Update NPM (Node Package Manager):

Node comes with npm installed so you should have a version of npm. However, npm gets updated more frequently than Node does.

``` sh
$ npm install npm -g
```

Test: Run `npm -v` . The version should be higher than 3.8.8.


#### Clone the repository

```sh
$ git clone https://github.com/glimberger/sf-gulpfile.git
```


#### Install gulp CLI globally:

```sh
$ npm install -g gulp-cli
```



#### Install packages

```sh
# to be run from within the 'sf-gulpfile' folder
$ npm install
```


#### Setup config.json

Create the file from the template:

```sh
# to be run from within the 'sf-gulpfile' folder
$ cp config.json.dist config.json
```

Fill the `bundles` field by targeting you bundles public folder:

```json
"bundles": [
    "Acme/YourBundle/path/to/the/public/folder",
    "Acme/YourOtherBundle/path/to/the/public/folder"
  ],
```

## Usage

Run the following commands from the `sf-gulpfile` directory.

```sh
$ gulp
```
will process scss files, copy images & fonts from bundles to the `web` folder, and then run `assetic dump` command.


```sh
$ gulp:prod
```
will process & compress scss files, copy images & fonts from bundles to the `web` folder, and then run `assetic dump` command.


```sh
$ gulp -T
```
will display the task dependency tree for the loaded gulpfile.


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

Inside the extras folder you can an example of Bower configuration
Bower is a front-end package manager.
Files need to be copied at the root of your project.

Install bower:
```sh
$ npm install -g bower
```

Install packages:
```sh
$ bower install
```

This command install a `vendor` directory in `web`.