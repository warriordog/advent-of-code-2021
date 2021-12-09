# Day 9: Smoke Basin

### Part 1
Part 1 was simple, I just made a 2D array of numbers. Then its just a matter of looping through all x,y positions and checking if that point is lower than its neighbors. If so, then increment a counter and add its risk value to a running total.


### Part 2
For part 2, I switched to a graph structure instead of an array. Each number became a Point object with pointers (no pun intended) to each of its neighbors. Values of 9 were excluded from the grid entirely and treated the same as an exterior wall. I added an `isInBasin` property to each node (defaulting to false) which gets set whenever a node is added to any basin. This both prevents double-counting *and* simplifies my search algorithm since it doesn't need to track where its already been. Searching is done by looping through all nodes in the graph until one is found where isInBasin is false. Then a recursive search is used to expand the basin. Once all nodes are found, that basin (just an array of nodes) is recorded.

A helpful trick here was to **completely ignore the depth values for part 2**. You don't need to know *where* the low point of a basin is, because the only thing that matters is the size. And because you don't need to know the low point, you don't need to know any other depth values either. As soon as you find *any* depth that isn't in a basin, you can safely kick off a flood-fill search and rest confident that you've found the entire thing.