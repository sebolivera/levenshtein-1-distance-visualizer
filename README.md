# Levenshtein Distance Visualizer
 [![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://reactjs.org/) [![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/) [![MUI](https://img.shields.io/badge/MUI-%230081CB.svg?style=for-the-badge&logo=mui&logoColor=white)](https://mui.com) [![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/) [![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/) [![Go](https://img.shields.io/badge/go-%2300ADD8.svg?style=for-the-badge&logo=go&logoColor=white)](https://go.dev)

## Who

Me.

## What

[Levenshtein Distance](https://en.wikipedia.org/wiki/Levenshtein_distance) Visualizer is a simple app showing the immediate neighbors of any word present in the english dictionary.

Currently it only displays immediate neighbors for a given word, but I plan on creating a "true" graph visualizer at some point.

Made with Go so that I could get used to it.

### Why

![Uhhhh...](https://i.kym-cdn.com/photos/images/original/000/859/202/790.png)

Excellent question.

## Setup

- Install [Go v1.20](https://go.dev/) and the latest version of [nodejs/npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) (if you haven't already).
- Run `npm run install-go-dep`(or `cd api` and then `go get ./...`) to install the API's dependencies.
- Run `npm i` to install the front-end dependencies.

## Launching the app (dev)

- Run `npm run dev` to start up the react app.
- Run `npm run backend-dev` (or `cd api` followed by `go run api.go`).


## Known issues

> *"You shall use tables for everything, as they are me, and as I am of the most perfect shape, so are they. And also because they look more professional"*.

\- God, soon after inventing KANBAN.

|Issue Name |Detail |Status |
---|:---|:---
|Clunky Backend|The Go "backend" is clunky and needs heavy refractoring|`Will work on it soon™`|
|Go packages misuse|Go package structure isn't made for what I did, I know. I just ordered it that way so that it would be familiar visual while I learn the language.|`Might fix it`|
|Use of insertion sort|Returned list is sorted using insertion sort instead of more "performant" sorting algorithms.|`Won't change it` It works well enough for the supplied samples.|
|Data management|Data is currently cached by Go and only supports the english dictionary in the english_dictionary.txt file.|`Unknown`|
|React Spaghetti| The React front-end is a mess | `I know`|
