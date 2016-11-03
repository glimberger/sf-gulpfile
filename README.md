# sf-gulpfile - Essential gulp tasks for Symfony projects

> Disclaimer: If you update node to 7.0.0+, please do install sf-gulpfile v1.1.0+.
> You should upgrade npm to v4, node 7.0.0 ships 3.10.8 by default so make sure to run `npm i -g npm@4`.

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

Test: Run `node -v` . A version number should be returned.

This library has been tested using the 5.6.0 version. 

Use node.js versions prior to 5.6.0 at your own risk.  


#### Update NPM (Node Package Manager):

Node comes with npm installed so you should have a version of npm. However, npm gets updated more frequently than Node does.

``` sh
$ npm install npm -g
```

Test: Run `npm -v` . A version number should be returned.

This library has been tested using the 3.8.8 version.


#### Clone the repository

```sh
$ git clone https://github.com/glimberger/sf-gulpfile.git
```

If you have a previous version of `sf-gulpfile` installed in your project, you should save a copy of the `config.json` file, then remove the `f-gulpfile` directory, clone the repository, and finally drag the `config.json` to its original place.


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

If you've already got a configured `config.json` you're good. Othewise you should

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
$ gulp:watch
```
will watch for changes in directories declared in the config file (i.e. scss files).


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

Inside the extras folder you can find an example of Bower configuration.
Bower is a front-end package manager.
Files need to be copied at the root of your project.

Install bower:
```sh
$ npm install -g bower
```

Install packages:
```sh
$ gulp bower:install
```

This command install a `vendor` directory in `web`.

```sh
$ gulp bower:update
```
will update bower packages.