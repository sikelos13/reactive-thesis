import { fromEvent } from "rxjs";
import { scan, map } from "rxjs/operators";

fromEvent(document, "click")
  .pipe(scan(count => count + 1, 0))
  .subscribe(count => console.log("clicked"));

fromEvent(document, "click").pipe(scan(count => count + 1, 0));

fromEvent(document, "click")
  .pipe(scan(count => count + 1, 0))
  .subscribe(count => console.log("clicked"));

fromEvent(document, "click").pipe(scan(count => count + 1, 0));

fromEvent(document, "click")
  .pipe(scan(count => count + 1, 0))
  .subscribe(count => console.log("clicked"));

fromEvent(document, "click").pipe(scan(count => count + 1, 0));
