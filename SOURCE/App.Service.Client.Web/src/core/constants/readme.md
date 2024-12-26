## Developement Directions ##


### Objective ###
The objective is to avoid hard coding of any 
parameter. 



### Approach ###

The approach to take is to have everything as a series of nested Constants.

 `system.ts` is the root file, and it imports other constant files, who in turn
 import still other constant files.

The idea is that the `system.ts` file is the only file that needs to be imported
into other files.

Most component and other files import this base const file as follows:

```typescript 
import { Constants } from 'src/core/constants/system';
```
That's it.
