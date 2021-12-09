# Day 1: Sonar Sweep

### Part 1
A basic, naive solution. Just read all lines into an array of integers and loop through to count increases.

### Part 2
Mostly the same code, but I first expand the list of integers into a list of windows. Part 2 tripped me up because I had an off-by-one error in my loops. I had to make the outer loop `<=` instead of just `<`, otherwise the final window was skipped.