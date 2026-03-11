---
label: "every abstraction is a bet on what won't change"
description: "the layer you introduce assumes something is stable.\nwhen it isn't, the abstraction becomes the problem."
tags: [design]
---

# Every abstraction is a bet on what won't change

you extract a function because the pattern repeats. you create an interface because the implementations vary. each abstraction encodes a prediction: this part stays stable while that part varies. when the prediction holds, the abstraction saves work. when it doesn't — when the stable thing moves — you're now fighting the layer you built to help you.

## See also

- [the frozen thing and moving reality](/fragments/the-frozen-thing-and-moving-reality)
- [specifics calcify into invisible assumptions](/fragments/specifics-calcify-into-invisible-assumptions)
