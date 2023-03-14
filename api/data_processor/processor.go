// package data_processor provides utility functions for the building and comparison of data

package dp

import (
	utils "LevenshteinDistance/data_processor/utils"
	"fmt"
	"sync"
	"time"
)

func FindLinkedWords(wordsByLength map[int][]string, word string, currentWords map[string][]string) map[string][]string {
	// Takes in a map of words, indexed by their lengths, a candidate word, and the current processed map. Sends back the current processed map with the results generated from the current candidate.
	// Notes:
	// - Is recursive
	// - Ignores cases when the candidate has already been read
	var start time.Time
	flag := false
	if len(currentWords) == 0 {
		fmt.Printf("Finding linked words for " + word + "...")
		start = time.Now()
		flag = true
	}
	if _, ok := currentWords[word]; !ok {
		currentWords[word] = OneLetterDiff(append(wordsByLength[len(word)-1], append(wordsByLength[len(word)], wordsByLength[len(word)+1]...)...), word)
		for i := 0; i < len(currentWords[word]); i++ {
			if _, ok2 := currentWords[currentWords[word][i]]; !ok2 {
				currentWords = FindLinkedWords(wordsByLength, currentWords[word][i], currentWords)
				//currentWords[currentWords[word][i]] = oneLetterDiff(append(wordsByLength[len(currentWords[word][i])-1], append(wordsByLength[len(currentWords[word][i])], wordsByLength[len(currentWords[word][i])+1]...)...), currentWords[word][i])
			}
		}
	}
	if flag {
		elapsed := time.Since(start)
		fmt.Println(" done! Took: " + elapsed.String())
	}
	return currentWords
}

func findLinkedWordsThread(wordsByLength map[int][]string, word string, currentWords *sync.Map, wg *sync.WaitGroup) {
	// finds an array of Levenshtein distance candidates for a word

	var currentWordsIn []string = make([]string, 0)
	var v, _ = currentWords.Load(word)
	if v != nil {
		currentWordsIn = v.([]string)
	}
	if _, ok := currentWords.Load(word); ok {
		return
	}
	var letterDiffWords []string = OneLetterDiff(append(wordsByLength[len(word)-1], append(wordsByLength[len(word)], wordsByLength[len(word)+1]...)...), word)
	currentWords.Store(word, letterDiffWords) // concurrency happens here

	var hasLooped bool = false
	for i := 0; i < len(letterDiffWords); i++ {
		if len(letterDiffWords) == 0 || !utils.Contains(currentWordsIn, letterDiffWords[i]) {
			defer wg.Done()
			wg.Add(1)
			hasLooped = true
			go findLinkedWordsThread(wordsByLength, letterDiffWords[i], currentWords, wg)
		}
	}
	if hasLooped {
		wg.Wait()
	}
}

func FindLinkedWordsThreaded(wordsByLength map[int][]string, word string, wg *sync.WaitGroup) map[string][]string {
	fmt.Printf("Polling...")
	var start time.Time
	var currentWords sync.Map = sync.Map{}
	var wg2 sync.WaitGroup
	var retMap map[string][]string = make(map[string][]string)
	wg2.Add(1)
	go func() {
		defer wg2.Done()
		findLinkedWordsThread(wordsByLength, word, &currentWords, &wg2)
	}()
	wg2.Wait()
	wg.Add(1)
	go func() {
		defer wg.Done()
		currentWords.Range(func(k, v interface{}) bool {
			retMap[k.(string)] = v.([]string)
			return true
		})
	}()
	wg.Wait()
	elapsed := time.Since(start)
	fmt.Println(" done! Took: " + elapsed.String())
	return retMap
}

func OneLetterDiff(arrayIn []string, word string) []string {
	//
	var oneLetterDiffString []string
	for i := 0; i < len(arrayIn); i++ {
		if utils.IsOneDiffLetter(arrayIn[i], word) && word != arrayIn[i] {
			oneLetterDiffString = append(oneLetterDiffString, arrayIn[i])
		}
	}
	return oneLetterDiffString
}
