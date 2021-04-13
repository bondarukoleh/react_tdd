### Commit early and often
If you’re starting out with TDD, I’d recommend committing to source control after every single test.
That might seem like overkill for your projects at work, but as you're learning, it can be a very effective tool.
With git, you can use `git add` to effectively save your code. This saves a snapshot of your code but does not commit it.
If you make a mess in the next test, you can revert to the last banked state. \
Committing early and often simplifies commit messages. If you have just one test in a commit, then you can use the test
description as your commit message. No thinking is required.

### Bringing in React and Babel
React makes heavy use of JavaScript XML (JSX), which we need Babel to transpile for us. Babel also transpiles our
modern ES6 and ES7 constructs for us. Thankfully, Jest already includes Babel, so we just need to install presets and
plugins:
```shell
npm i -ED @babel/preset-env @babel/preset-react @babel/plugin-transform-runtime 
npm i -E @babel/runtime
```
A Babel preset is a set of plugins. Each plugin enables a specific feature of the ECMAScript
standards, or a preprocessor such as JSX.

