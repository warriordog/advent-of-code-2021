# Day 12: Passage Pathing

I hate graph traversal problems.

### Part 1
I solved part 1 by accident. I originally implemented a memoization-based optimized search algorithm, that was actually completely broken and would result in missing _and_ incorrect paths. Fortunately, I had a typo `!visited` instead of `!visited.has(from)` which resulted in the memoization code being completely bypassed. That caused the entire cave to be searched the hard way, which yielded correct results.

### Part 2
For part 2, I tried to "simplify" my existing code by creating a complex inheritance-based data structure. This was supposed to allow for "temporary" memoization that could efficiently handle the changing paths involved with this problem. Unfortunately, that became too big and complex so I threw it out and desperately tried another brute-force approach. Fortunately, that worked. Even on my 10-year-old laptop, all 98K paths can be generated in about 3 seconds.