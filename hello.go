package main

import (
	"fmt"
	"net/http"
)

func indexHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println(w, "so great !")
}
func main() {
	fmt.Println("server started!")
	http.HandleFunc("/", indexHandler)
	http.ListenAndServe(":8000", nil)

}
