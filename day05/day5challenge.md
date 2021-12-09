# Day 5: Hydrothermal Venture (Challenge Solutions)

### AOC 2021 Big Inputs: 20000-6400
I was able to solve this challenge using my existing Day5 Part2 solution, with only minimal changes. This algorithm works as-is because Javascript utilizes sparse arrays.<sup>[1]</sup> The sparse arrays effectively implement memory compression "for free" so I am able to process a very large amount of lines without running out of memory.

I implemented a few optimizations to speed up the runtime:
1. I replaced the `Grid` class with a basic 2D array of numbers to reduce memory usage.
2. To avoid having to scan and count the whole grid, I count during the line processing. If at any point a cell is set to *exactly* 2, then I increment the counter. Future increases are ignored as they are greater than 2.
3. To save further time, parts 1 and 2 are computed at the same time. I split the input into two sets, one containing axis-aligned (horizontal / vertical) lines, and the other contains diagonal lines. The axis-aligned lines are processed first, and the current counter is saved as the result for part 1. Finally, the diagonal lines are processed against the existing grid and counter without resetting them. The resulting counter value is the answer for part 2

[1] Technically, this is a property of the V8 runtime rather than of Javascript itself. However, V8 is used by NodeJS and all Chromium-based web browsers.

### AOC 2021 Big Inputs: 50000-10000
I was able to use the exact same code from 20000-6400 to solve this challenge.