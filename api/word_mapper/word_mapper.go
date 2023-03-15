package word_mapper

import (
	dp "LevenshteinDistance/data_processor"
	utils "LevenshteinDistance/data_processor/utils"
)

func GetOne(word string, wordsByLength map[int][]string) []string {
	return utils.RemoveDuplicates(dp.OneLetterDiff(append(wordsByLength[len(word)-1], append(wordsByLength[len(word)], wordsByLength[len(word)+1]...)...), word))
}

func GetN(word string, wordsByLength map[int][]string, n int) map[string][]string {
	retMap := make(map[string][]string)
	retMap[word] = GetOne(word, wordsByLength)
	if n > 1 {
		for _, w := range GetOne(word, wordsByLength) {
			retMap = utils.MergeMaps(retMap, GetN(w, wordsByLength, n-1))
		}
	}
	return retMap
}
