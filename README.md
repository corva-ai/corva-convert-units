convert-units
=============

A handy utility for converting between quantities in different units.

### Fork/Duplication Information

This was forked by Corva to add support for things needed internally.
Credit goes to Ben Ng as the original developer/maintainer of this module.

### Contribution

#### Releasing changes

- Create a PR, merge it to `master` branch
- CI will create a version bump & changelog update pull request
- Merge this auto-generated release PR
- CI will publish the new version to NPM + make a GitHub release

#### Testing changes

If local package linking is not enough - you can publish a test version of your branch package. 
To do so - you need to manually dispatch the publish GitHub action selecting your branch

This job will publish a test version to NPM, the version will look like 0.0.0-[hash] 

License
-------
Copyright (c) 2013-2017 Corva http://corva.ai ; Ben Ng, Jasper Miles, and Contributors, http://benng.me

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
