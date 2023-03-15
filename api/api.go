package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"path/filepath"
	"runtime"
	"strconv"

	dp "LevenshteinDistance/data_processor"
	fp "file_processor"
	wm "word_mapper"

	"goji.io"
	"goji.io/pat"
)

var wordsByLength map[int][]string

func lev_dist(w http.ResponseWriter, r *http.Request) {
	word := pat.Param(r, "word")
	if len(word) < 1 {
		fmt.Fprintln(w, "{\"\": \"\"}")
	} else {
		wbl := make(map[string][]string)
		wbl[word] = wm.GetOne(word, wordsByLength)
		dp.InsertionSort(wbl[word])

		jsonOut, _ := json.Marshal(wbl)
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
		fmt.Fprintln(w, string(jsonOut))
	}
}

func lev_dist_n(w http.ResponseWriter, r *http.Request) {
	word := pat.Param(r, "word")
	amt := pat.Param(r, "amt")
	n, err := strconv.Atoi(amt)
	if len(word) < 1 || err != nil {
		fmt.Fprintln(w, "{\"\": \"\"}")
	} else {
		wbl := wm.GetN(word, wordsByLength, n)

		jsonOut, _ := json.Marshal(wbl)
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
		fmt.Fprintln(w, string(jsonOut))
	}
}

func main() {
	fmt.Println("Setting up data...")
	_, filename, _, ok := runtime.Caller(0)
	if !ok {
		panic("Unable to get the current filename")
	}

	var fileLines []string = fp.File_Processor(filepath.Dir(filename), "")

	allWords := dp.CleanArray(fileLines)
	wordsByLength = dp.MakeMap(allWords)
	fmt.Println("API initiated!")
	mux := goji.NewMux()
	mux.HandleFunc(pat.Get("/lev_dist/:word"), lev_dist)
	mux.HandleFunc(pat.Get("/lev_dist/:word/:amt"), lev_dist_n)

	http.ListenAndServe("localhost:8000", mux)
}
