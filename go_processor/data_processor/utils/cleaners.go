package utils

import (
	"strings"
)

func RemoveDuplicates(inputArray []string) []string {
	finalArray := make([]string, 0)
	for i := range inputArray {
		if !Contains(finalArray, inputArray[i]) {
			finalArray = append(finalArray, inputArray[i])
		}
	}
	return finalArray
}

func lowerCaseAll(inputArray []string) {
	for i := range inputArray {
		inputArray[i] = strings.ToLower(inputArray[i])
	}
}
