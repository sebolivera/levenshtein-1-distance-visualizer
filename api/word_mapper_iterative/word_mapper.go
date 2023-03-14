package word_mapper_iterative

import (
	dp "LevenshteinDistance/data_processor"
)

func GetOne(word string, wordsByLength map[int][]string) []string {
	return dp.OneLetterDiff(append(wordsByLength[len(word)-1], append(wordsByLength[len(word)], wordsByLength[len(word)+1]...)...), word)
}
