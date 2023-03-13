package utils

import (
	"strings"
)

func Contains(s []string, str string) bool {
	for _, v := range s {
		if v == str {
			return true
		}
	}
	return false
}

func IsOneDiffLetterSameLength(word1 string, word2 string) bool {
	if len(word1) != len(word2) {
		return false
	}
	for i := 0; i < len(word1); i++ {
		if strings.ToLower(word1)[i] != strings.ToLower(word2)[i] {
			return false
		}
	}
	return true
}

func IsOneDiffLetter(word1 string, word2 string) bool {
	diffCounter := 0
	var w1, w2 string
	if len(word1) >= len(word2) {
		w1 = word1
		w2 = word2
	} else {
		w1 = word2
		w2 = word1
	}
	for i := 0; i < len(w1); i++ {
		if i < len(w2) {
			if strings.ToLower(w1)[i] != strings.ToLower(w2)[i] {
				diffCounter++
				if diffCounter > 1 {
					return false
				}
				if i < len(w1) && IsOneDiffLetterSameLength(w1[:i]+w1[i+1:], w2) {
					return true
				}
			}
		} else {
			diffCounter++
		}
	}
	return diffCounter == 1
}

func CompareIgnoreCase(wordIn1 string, wordIn2 string) int {
	// returns -1 if w1 is "smaller" than w2, 1 if it's the opposite, 0 if they're the same (shouldn't happen)
	w1 := strings.ToLower(wordIn1)
	w2 := strings.ToLower(wordIn2)
	w1AsBytes := []byte(w1)
	w2AsBytes := []byte(w2)
	for i := range w1AsBytes {
		if i >= len(w2AsBytes) || w1[i] > w2[i] { // if w1 is longer than w2 and it hasn't returned until now, it means w2 comes before
			return 1
		}
		if w1[i] < w2[i] {
			return -1
		}
	}
	if len(w2) > len(w1) {
		return -1
	}
	return 0
}
