# Day 14: Extended Polymerization

### Part 1
I used a linked list for part 1. I thought this was clever, since the problem is mostly a large number of inserts into a fairly large list of elements. In other words, the ideal case for a linked list. This did work quite well, although it ended up being the wrong choice for part 2.

### Part 2
Obviously, part 2 is not solvable with any kind of list. As with the lanternfish, you need to compute operations in bulk. I created a dictionary that maps 2-element pairs to the number of occurrences of that pair within the input. Then I can compute an insertion in O(1) time:

1. Lookup the number of occurrences for the pair.
2. Generate two new pairs by joining the insertion element with each element in the pair. For example, `AB -> C` becomes `AC` and `CB`.
3. For each of those pairs, increment their count by the number of occurrences from step 1.
4. Finally, reset the pair to zero occurrences.

To handle the insertions running in parallel, the increments are delayed until the end of each step. Resets can happen immediately because each pair is only processed once per step.