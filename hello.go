package main

import (
	"fmt"
	"net/http"
)

func main() {
	fmt.Println("YOYO, uiuiui!")
	http.ListenAndServe(":8000", nil)
}
