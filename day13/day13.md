# Day 13: Transparent Origami

### Part 1
I got stuck here for HOURS because I missed the part about "just the first fold" and kept getting the wrong answer. Other than that, it was pretty straightforward. I ended up putting my 2D array in Y,X order so that it appears correctly in my debugger.

### Part 2
Everything that I needed for part 2 was already done in part 1, so I just factored out the logic into a shared module. Then I added a loop (to count all folds instead of just one) and replaced the counter with a call to `printGrid` to get the final code. I didn't bother trying OCR or anything like that, although I did switch my "font" from "#" and "." to "░" and " " so that I could actually read the code.

It came out like this, which is quite nice and readable in a terminal:

    ░░░  ░░░░ ░  ░ ░░░   ░░    ░░ ░░░░ ░  ░
    ░  ░ ░    ░ ░  ░  ░ ░  ░    ░    ░ ░  ░
    ░░░  ░░░  ░░   ░  ░ ░       ░   ░  ░  ░
    ░  ░ ░    ░ ░  ░░░  ░       ░  ░   ░  ░
    ░  ░ ░    ░ ░  ░ ░  ░  ░ ░  ░ ░    ░  ░
    ░░░  ░    ░  ░ ░  ░  ░░   ░░  ░░░░  ░░