# Day 3: Binary Diagnostic

### Part 1
I was able to greatly simplify my code through the fact that the LCB is equal to the opposite of the MCB. I only had to compute one and then the other was just a simple flip (1 => 0 or 0 => 1).

### Part 2
Part 2 took me longer than it should have because I didn't immediately realize that the most common bit was recomputed each time. After fixing that, it was just a matter of looping until all bits are consumed.