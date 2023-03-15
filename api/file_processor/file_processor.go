package file_processor

import (
	"bufio"
	"fmt"
	"os"
	"path/filepath"
)

func file_to_lines(readFile *os.File) []string {

	fileScanner := bufio.NewScanner(readFile)
	var fileLines []string

	fileScanner.Split(bufio.ScanLines)

	for fileScanner.Scan() {
		fileLines = append(fileLines, fileScanner.Text())
	}
	return fileLines
}

func File_Processor(basePath string, fp string) []string {
	var readFile *os.File
	var err error
	var absPath string
	var filePath string
	if len(fp) > 0 {
		filePath = fp
		absPath, _ = filepath.Abs(filePath)
		readFile, err = os.Open(absPath)
		if err == nil {
			return file_to_lines(readFile)
		} else {
			fmt.Println("Notice: the provided dictionary couldn't be found. Using english_dictionary.txt by default.")
		}
	}
	absPath, _ = filepath.Abs("english_dictionary.txt")
	readFile, err = os.Open(absPath)
	if err != nil {
		pAbsPath := absPath
		absPath, _ = filepath.Abs("..\\english_dictionary.txt")
		readFile, err = os.Open(absPath)
		if err != nil {
			panic("Neither file '" + absPath + "' nor file '" + pAbsPath + "' could be read")
		}
	}
	return file_to_lines(readFile)

}
