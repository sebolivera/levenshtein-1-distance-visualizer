package utils

func RemoveDuplicates(inputArray []string) []string {
	finalArray := make([]string, 0)
	for i := range inputArray {
		if !Contains(finalArray, inputArray[i]) {
			finalArray = append(finalArray, inputArray[i])
		}
	}
	return finalArray
}
