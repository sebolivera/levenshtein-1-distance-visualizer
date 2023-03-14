package file_processor

import (
	"bufio"
	"fmt"
	"os"
	"path/filepath"
	"runtime"
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

func File_processor(basePath string, args []string) []string {
	var readFile *os.File
	var err error
	var absPath string
	var filePath string
	dirname := basePath
	absPath, _ = filepath.Abs(dirname + "\\..\\words.txt")
	if len(args) > 1 {
		filePath = args[1]
		absPath, _ = filepath.Abs(filePath)
		readFile, err = os.Open(absPath)
		if err == nil {
			absPath, _ = filepath.Abs(filePath)
			readFile, err = os.Open(absPath)
			if err != nil {
				fmt.Println("Notice: the provided dictionary couldn't be found. Using words.txt by default.")
				absPath, _ = filepath.Abs("..\\words.txt")
				readFile, err = os.Open(absPath)
			} else {
				readFile, err = os.Open(absPath)
			}
			return file_to_lines(readFile)
		}
		panic("Something went wrong during the opening of file " + absPath)
	} else {
		_, fileName, _, ok := runtime.Caller(0)
		if !ok {
			fmt.Println("Unable to get the current fileName")
		}
		dirname := filepath.Dir(fileName)
		filePath, _ = filepath.Abs(dirname + "\\..\\words.txt")
		fmt.Println("Notice: no path was specified. Using " + filePath + " by default.")
		readFile, err = os.Open(filePath)
		return file_to_lines(readFile)
	}

	panic("File couldn't be read")
}
