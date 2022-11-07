package main

import (
	"fmt"
	"net/http"
	"text/template"
)

type NewAggPage struct {
	Title string
	News  string
}

func indexHandler(w http.ResponseWriter, r *http.Request) {
	p := NewAggPage{Title: "AMAZING", News: "OK"}
	t, _ := template.ParseFiles("hello.html")
	t.Execute(w, p)
	fmt.Println(w, "so great !")
}
func main() {
	fmt.Println("server started!")
	http.HandleFunc("/", indexHandler)
	http.ListenAndServe(":8000", nil)

}
