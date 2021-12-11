# Day 11: Dumbo Octopus

### Part 1
For part 1, I implemented the naive approach with just two nested loops. The outer loop runs once for each step (100 times) and the inner loop repeats the step until no octopus flashes. The number of flashes is accumulated across both loops and becomes the answer.

### Part 2
For part 2, I was able to reuse so much of my part 1 code that I decided to factor it out into a shared module. The parsing and stepping logic is 100% identical, including the inner loop's flash counter. I just replaced the outer "100 steps" loop with one that continues until the number of flashes for any step equals the number of octopuses in the grid.