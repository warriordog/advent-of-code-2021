# Day 10: Syntax Scoring

### Part 1
I immediately recognized this as a parsing problem, so I implemented a shared `tokenize` function with the expectation that it might be needed for part 2. The tokenizer is a [generator function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*) that `yield`s each "token" of the input. Internally, it tracks the bracket stack and detects corrupt and incomplete lines. The `Token` interface supports interleaved errors so the main problem solution is quite simple. Just loop through each input, and then loop through the generator output until we reach a `TYPE_UNEXPECTED` response. Then grab the current character (from the same token object) and increment the score accordingly.


### Part 2
My Part 1 implementation ended up being way overkill, but it gave me part 2's solution "for free" so that was nice. It turns out that my internal `expectedClosingTags` stack just so happened to contain the exact sequence of characters that should form the autocomplete response. I just added that to the `Token` interface and was 90% done. The only catch was that the order was reversed, but the solution was as simple as replacing `push()` and `pop()` with `unshift()` and `shift()`.

This was possible because of a single, random design decision. To simplify the tokenizer and avoid lookups, I chose to store the bracket stack inverted. Rather than store the open tags and compute the expected closing tag as-needed, the tokenizer just stores the expected closing tag directly. By pure luck, this is exactly the same as the autocomplete string. And because `expectedClosingTags` is already an array of single-character strings, the score calculation was just a single call to `reduce()`.