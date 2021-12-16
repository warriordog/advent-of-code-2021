# Day 15: Chiton

### Part 1
I don't think my part 1 solution is actually _correct_, but it does get the right result. It uses some basic parsing to read the input into a graph, and then runs Dijkstra's algorithm to find the solution.

### Part 2
Part 2 works the same way as part 1, however I had to fix a very subtle bug in my Dijkstra implementation. When the algorithm says `select the unvisited node that is marked with the smallest tentative distance`, the word **smallest** is apparently important. Without that check, the algorithm will work for part 1 and the test file of part 2, but not the actual input of part 2 (the result is very slightly wrong).

To handle the repeating grid, I just loop through each number and "project" it 24 times into each of the mirrored positions. There's probably a better way to handle it, but this works.