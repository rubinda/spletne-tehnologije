# Node News

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.1.4. It represents an Angular app for displaying news articles. It represents a frontend for the previous two tasks ([5-REST](https://github.com/rubinda/spletne-tehnologije/tree/master/5-rest-oauth) or [6-GraphQL](https://github.com/rubinda/spletne-tehnologije/tree/master/6-graphql)). For a full slovenian description of the app see the [readme in the parent folder](../README.md).

## Requirements

For running this app you require a backend from the previous tasks ([5-REST](https://github.com/rubinda/spletne-tehnologije/tree/master/5-rest-oauth) or [6-GraphQL](https://github.com/rubinda/spletne-tehnologije/tree/master/6-graphql))

Please note, that there was a problem with bootstrap typings, so I've manually imported JQuery. Without this import `ng serve` would return an error claiming JQuery is a type only but is being used as a namespace all over the file node_modules/@types/bootstrap/index.d.ts. For a temporary fix add the next line to the begining of the previously menitoned file:
```typescript
import * as JQuery from "../../jquery";
```

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

