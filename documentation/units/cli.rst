========
./cli.js
========



Internal Functions
==================


die (error)
~~~~~~~~~~~

Exit application in case of error

* `error`: string, error message to display

Prints the error information and exits with code -1


printHelpAndExit ()
~~~~~~~~~~~~~~~~~~~

Print help message and exit


printReadmeAndExit ()
~~~~~~~~~~~~~~~~~~~~~

Print contents of readme file and exit


Variable Declarations
=====================


let args
~~~~~~~~

* not exported
* initial value: `process.argv.slice(2)`


let inputFile
~~~~~~~~~~~~~

* not exported
* initial value: `args[0]`


let outputFile
~~~~~~~~~~~~~~

* not exported
* initial value: `args[1]`


let scriptPath
~~~~~~~~~~~~~~

* not exported
* initial value: `path.join(process.cwd(), inputFile.split("/").slice(0, -1).join("/"))`

Generated at Thu Dec 24 2020 17:53:43 GMT+0800 (Central Indonesia Time)