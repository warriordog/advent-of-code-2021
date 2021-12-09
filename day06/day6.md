# Day 6: Lanternfish

### Part 1
The obvious solution - store each and every fish in a massive array. Loop through each fish and simulate it. If any new fish are spawned, then add them to the end of the array. The only potential trap here is that you need to stop looping before you reach the fish that were just added. I chose the copy the entire array (using `Array.from()`), but there are other ways to accomplish the same goal.

### Part 2
This was the first day that required a substantially different approach for part 2. Part 1's brute-force approach is computationally infeasible for part 2. There are quite literally too many fish to fit into a computer's memory.

To work around that, I created an array where the index is a timer amount and the value is the number of fish with that timer value. On each day, I pop the first element and move it to the end. At the same time, that amount is added to the timer value for 6. This runs in constant time no matter how many fish are spawned.

I ran into a few minor challenges:
* I needed to use BigInt to handle the large numbers
* So, so many off-by-one errors in the array manipulation
* I accidentally added the "reset" fish to the end of the array (timer 8) instead of timer 6.