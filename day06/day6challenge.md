# Day 6: Lanternfish (Challenge Solutions)

### AOC 2021 Big Inputs: 9999999
My original, [unoptimized solution](day6part2.js) runs 9999999 in about 440 seconds. I thought that I'd cut that down with [some heavy optimization](day6challenge1.js), but it still takes the exact same time. Some loose profiling shows that most of the time is actually spent waiting for memory accesses, not in the CPU. I guess that's due to all the BigInts.