authoring-tool
==============

This repository will include the authoring tool to create questions for the [videogular-questions](github.com/soton-ecs-2014-gdp-12/videogular-questions) plugin.

This will be a front end interface to allow generation of the required questions.json file used by this plugin.

Setup
-----

`npm install` can be run to install the npm dependencies.

The [Videogular Questions](https://github.com/soton-ecs-2014-gdp-12/videogular-questions) modules specified in the `bower.json` file have not been released yet.
 To get them, clone their repositories and run `bower link` in the root of each repository. Then, in the `authoring-tool` directory, tell Bower to use your local copy:

```sh
$ bower link videogular-questions
```

Important: This will not work without doing this.