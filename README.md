# Levenshtein 1-Distance Visualizer
 [![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://reactjs.org/) [![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/) [![MUI](https://img.shields.io/badge/MUI-%230081CB.svg?style=for-the-badge&logo=mui&logoColor=white)](https://mui.com) [![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/) [![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/) [![Go](https://img.shields.io/badge/go-%2300ADD8.svg?style=for-the-badge&logo=go&logoColor=white)](https://go.dev)

## What is it?

[Levenshtein 1-Distance](https://en.wikipedia.org/wiki/Levenshtein_distance) Visualizer is a simple app showing the immediate neighbors of any word present in the english dictionary.

Currently it only displays immediate neighbors for a given word, but I plan on creating a "true" graph visualizer at some point.

Made with Go so that I could get used to it.

Currently, this serves no purpose other than satisfying my curiosity.

## Setup

> **IMPORTANT**: Before installing anything, be sure to have at least [GoLang v1.20]() on your os, and that it is properly configured.

- Run `npm run install-go-dep`(or `cd api` and then `go get ./...`) to install the API's dependencies.
- Run `npm i` to install the front-end dependencies.

## Launching the app (dev)

- Run `npm run dev` to start up the react app.
- Run `npm run backend-dev` (or `cd api` followed by `go run api.go`).


### Known issues

- The Go "backend" is clunky and needs heavy refractoring. I will work on it soon™.
- Go packages aren't used properly, I will fix it at some point in the future.
- The recursive "threaded" version of the largest script (which is not used by the API) crashes (and improperly uses a shared map). I do not intend to work on it anymore, but left it in case anyone is curious.
- Word orders are sorted using insertion sort instead of a more "efficient" one, the reason for that is that with given small samples, it will go fast enough for any purposes.
- Data is only cached by Goji at the moment because I don't want to bother adding any kind of database, and I don't intend for this to be perfect anyway.
