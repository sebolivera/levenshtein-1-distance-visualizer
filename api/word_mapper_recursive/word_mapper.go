package main

import (
	dp "LevenshteinDistance/data_processor"
	"encoding/json"
	fp "file_processor"
	"fmt"
	"os"
	"path/filepath"
	"runtime"
	"strconv"
	"strings"
	"time"
)

func main() {
	var start time.Time
	_, filename, _, ok := runtime.Caller(0)
	if !ok {
		panic("Unable to get the current filename")
	}

	var fileLines []string = fp.File_processor(filepath.Dir(filename), os.Args)
	var absPath string = filepath.Dir(filename)

	allWords := dp.CleanArray(fileLines)
	wordsByLength := dp.MakeMap(allWords)
	startWord := "a"
	//fmt.Println("Words 1 letter away from " + word + ": \n - " + strings.Join(oneLetterDiff(append(wordsByLength[len(word)-1], append(wordsByLength[len(word)], wordsByLength[len(word)+1]...)...), word), "\n - "))

	mappedValueForWord := dp.FindLinkedWords(wordsByLength, startWord, make(map[string][]string))
	jsonString, err := json.MarshalIndent(mappedValueForWord, "", "   ")
	if err != nil {
		fmt.Println("Couldn't parse JSON.")
		panic(err)
	}
	i := 0
	path, _ := filepath.Abs(absPath + "\\islands\\island" + strconv.Itoa(i) + ".json")
	_ = os.WriteFile(path, jsonString, 0644)
	fmt.Println("Done checking for initial results.")
	fmt.Println("Checking for missing values...")
	var wordFound bool = false
	var lessThanAllWords []string
	for word := range mappedValueForWord { //NOT EFFICIENT AT ALL
		wordFound = false
		for _, wordInAllWords := range allWords {
			if word == wordInAllWords {
				wordFound = true
				break
			}
		}
		if !wordFound {
			lessThanAllWords = append(lessThanAllWords, word)
		}
		i++
	}
	fmt.Println("Remaining words after first island:\n - " + strings.Join(lessThanAllWords, "\n - "))
	fmt.Println("Remaining words (len) after first island: " + strconv.Itoa(len(lessThanAllWords)))
	elapsed := time.Since(start)
	fmt.Println("Script took: " + elapsed.String())
}
