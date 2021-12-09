# Day 4: Giant Squid (Challenge Solutions)

### AOC 2021 Big Inputs: 900-15
I was able to mostly reuse my exising part1 and part2 solutions. I just merged them together and cleaned up the tracking of winning/losing numbers.

### AOC 2021 Big Inputs: 3600-30
This challenge required one small change to my code - I had to remove the array copy hack in favor of a better solution. I still have to actually remove winning boards from the list, otherwise there would be 12,960,000 iterations needed! But copying an array of 3,600 objects 3,600 times is not an option anymore. Instead, I deferred the remove operation to the end of each outer loop (looping through each number) and accumulated a set of boards to remove. This allowed me to modify the array in a single `filter()` call instead of `splice()`ing out individual elements mid-loop.