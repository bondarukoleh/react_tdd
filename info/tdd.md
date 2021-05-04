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

**Consider React warnings** to be a **test failure**. Don't proceed without first fixing the warning.

#### Test Doubles
When we're writing tests, we isolate the unit under test. Sometimes that means we avoid exercising any of the
``collaborating`` objects. Sometimes it's because those `collaborating` objects have side-effects that would
complicate our tests. i.e., with React components we sometimes want to avoid rendering child components because
they perform network requests when they are mounted. A **test double** is an **object** that acts in place of a
`collaborating` object, i.e. onSubmit function - we can use a **test double** in place of the real function.

**Test doubles** is at the edges of our system, when our code interacts with the outside world.
Any kind of operating system resource is a candidate: filesystem access, network access, sockets, HTTP calls, and so on.
Test doubles are categorized into a number of different types: `spies, stubs, mocks, dummies, and fakes`.

**Avoiding fakes** \
A fake is any test double that has any kind of logic or control structure within it, such as conditional statements or
loops. Other types of test object, such as spies and stubs, are made up entirely of variable assignments and function
calls. Fakes are useful when testing complex collaborations between two units. We'll often start by using spies and
stubs and then refactor to a fake once the code starts to feel unwieldy. A single fake can cover a whole set of tests,
which is simpler than maintaining a whole bunch of spies and stubs. \
We avoid fakes for these reasons:
 - Any logic requires tests, which means we must write tests for fakes, even though they are part of the test code.
   Spies and stubs don't require tests.
 - Often spies and stubs work in place of fakes. Only a small category of testing is simpler when we use fakes.
 - Fakes increase test brittleness because they are shared between tests, unlike other test doubles.

A **spy** is a test double that records the arguments it is called with so that those values can be inspected later on.

A **stub** is a test double that always returns the same value when it is invoked. You decide what this value is when
you construct the stub.

