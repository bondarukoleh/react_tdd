## TDD info

One of the core principle of the test-driven developer is *always do the simplest thing to pass the test*.
We could rephrase this as *always do the simplest thing to fix the error you're working on*.
That includes hard-coding values, when it's possible. In order to get to the real implementation, we need to add
more tests. This process is called **triangulation**. The more specific our tests get, the more general our
production code needs to get.

Unit tests should be independent of one another. The simplest way to achieve this is to not have any shared state
between tests. Each test should only use variables that it has created itself.

The rule *"more haste; less speed"* applies to coding. If you skip the refactoring phase, your code quality will
deteriorate. If you develop a habit of skipping refactoring, your code base will soon become difficult to work with.

Test code needs as much care and attention as production code. The number one principle you'll be relying on when
refactoring your tests is Don't Repeat Yourself (DRY). **Drying up your tests**.

The parts of a test that you want to see in *it()* are the parts that differ between tests. Do your best to hide away
whatever is the same and proudly display what differs.

A good test has three distinct sections:
- Arrange: Sets up test dependencies
- Act: Executes production code under test
- Assert: Checks expectations are met

A great test is not just good but is also the following:
- Short
- Descriptive
- Independent of other tests
- Has no side-effects

The steps of the TDD cycle are as follows:
1. Write a failing test: Write a test and watch it fail. If it doesn’t fail, then it's not a good test ->
2. Make it pass: Do the simplest thing that will work. Feel free o make a mess; you can clean it up later ->
3. Refactor your code: Slow down, and resist the urge to move on to the next feature.

### Commit early and often
If you’re starting out with TDD, I’d recommend committing to source control after every single test.
That might seem like overkill for your projects at work, but as you're learning, it can be a very effective tool.
With git, you can use `git add` to effectively save your code. This saves a snapshot of your code but does not commit it.
If you make a mess in the next test, you can revert to the last banked state. \
Committing early and often simplifies commit messages. If you have just one test in a commit, then you can use the test
description as your commit message. No thinking is required.

Try to not refactor on red. Skip the test that fails -> refactor or add functionality, and then unskip it. You can easy 
control the refactoring going with green tests.
