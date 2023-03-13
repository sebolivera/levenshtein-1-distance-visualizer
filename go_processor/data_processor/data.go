package dp

import (
	utils "LevenshteinDistance/data_processor/utils"
	"fmt"
	"regexp"
	"sync"
	"time"
)

func MakeMap(arrayIn []string) map[int][]string { //indexes strings by their lenghts
	finalMap := make(map[int][]string)
	start := time.Now()
	fmt.Printf("Mapping...")
	for i := 0; i < len(arrayIn); i++ {
		if _, ok := finalMap[len(arrayIn[i])]; ok {
			finalMap[len(arrayIn[i])] = append(finalMap[len(arrayIn[i])], arrayIn[i])
		} else {
			finalMap[len(arrayIn[i])] = []string{arrayIn[i]}
		}
	}
	elapsed := time.Since(start)
	fmt.Println(" done! Took: " + elapsed.String())
	return finalMap
}

func CleanArray(strIn []string) []string {
	var cleanedStr []string

	fmt.Printf("Cleaning up...")
	start := time.Now()
	for i := 0; i < len(strIn); i++ {
		if len(regexp.MustCompile(`[^A-Za-z0-9'-]+`).ReplaceAllString(strIn[i], "")) == len(strIn[i]) { //checks whether the number has other characters
			cleanedStr = append(cleanedStr, strIn[i])
		} else if len(strIn[i]) > 3 { //if the word was less than 2 characters short and it had a special character, we ignore it (ex: o')
			cleanedStr = append(cleanedStr, regexp.MustCompile(`[^A-Za-z0-9'-]+`).ReplaceAllString(strIn[i], ""))
		}
	}

	elapsed := time.Since(start)
	fmt.Println(" done! Took: " + elapsed.String())
	return cleanedStr
}

func BuildSyncMapFromMap(inMap map[int][]string) *sync.Map {
	var syncedMap sync.Map = sync.Map{}
	for k := range inMap {
		syncedMap.Store(k, inMap[k])
	}
	return &syncedMap
}

func InsertionSort(items []string) {
	// works better than other alternatives since we work with relatively small arrays
	// considers uppercase letters as their lowercase equivalent for simplicity, but could be tweaked to separate them
	var n = len(items)
	for i := 1; i < n; i++ {
		j := i
		for j > 0 {
			if utils.CompareIgnoreCase(items[j-1], items[j]) == 1 {
				items[j-1], items[j] = items[j], items[j-1]
			}
			j = j - 1
		}
	}
}
