
Google AppEngine Runner
=======================

Tools for deploying programs to [Google AppEngine](http://code.google.com/appengine/).


Instructions
------------

See [test-app](http://github.com/cadorn/gae-runner/tree/master/packages/test-app/) for example app. To launch use:

    gae launch --package test-app --build --dev
    
**NOTE:** *You must be using Christoph Dorn's **experimental** narwhal branch for extra tusk functionality.*

To deploy use:

    tusk package --package test-app build dist


License
=======

[MIT License](http://www.opensource.org/licenses/mit-license.php)

Copyright (c) 2009 Christoph Dorn

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
