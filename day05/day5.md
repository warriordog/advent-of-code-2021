# Day 5: Hydrothermal Venture

### Part 1
To track overlaps, I implemented a sparse grid structure with two nested maps. It indexes x -> y -> number of vents with a `Map<number, Map<number, number>>`. I could have just used nested arrays, but I wanted to be safe in case part two decided to dramatically increase the range of numbers or something. Then I just looped through each vent, computed the x,y coordinate of all locations that it crosses, and incremented the numbers as those locations. To get the final result, I looped through the entire grid and counted each number that was at least 2.

### Part 2
My part 1 code was nearly enough for part 2, but it turned out that my line code was bugged for non-axis-aligned inputs. Once I fixed that, I realized that I'd also introduced an off-by-one error that excluded the last point of each line. I fixed it with this ugly hack:

```javascript
const xInc = computeIncrement(line.x1, line.x2);
const yInc = computeIncrement(line.y1, line.y2);
let x = line.x1;
let y = line.y1;

do {
    this.increment(x, y);

    x += xInc
    y += yInc;

    // Hacky special case to handle inclusive ending points
    if (x === line.x2 && y === line.y2) {
        this.increment(x, y);
    }
} while (x !== line.x2 || y !== line.y2);
```