package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"fmt"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

// Card to be written to MySQL
type Card struct {
    Name       string         `json:"name"`
    TypeLine   string         `json:"type_line"`
    Power      int			  `json:"power"`      
    Toughness  int			  `json:"toughness"`  
    Colors     []string       `json:"colors"`
    Rarity     string         `json:"rarity"`
    ReleasedAt string         `json:"released_at"`
    Img string                `json:"img"`
}


type Hello struct {
	ID            int    `json:"id"`
	Hello        string    `json:"hello"`
}

func helloWorld(w http.ResponseWriter, r *http.Request) {
	log.Println("helloWorld is called")
    x := Hello{ID: 1, Hello: "world"}
    json.NewEncoder(w).Encode(x)
}

func addCard(w http.ResponseWriter, r *http.Request) {
    log.Println("addCard called")

    var card Card

    if err := json.NewDecoder(r.Body).Decode(&card); err != nil {
        http.Error(w, "Invalid JSON payload", http.StatusBadRequest)
        return
    }
    
    colors, err := json.Marshal(card.Colors)
    if err != nil {
        http.Error(w, "Failed to encode colors", http.StatusInternalServerError)
        return
    }

    
    db, err := sql.Open("mysql", "kalaj-mtg:kalaj-mtg-pass@tcp(127.0.0.1:3306)/kalaj-mtg")
    if err != nil {
        log.Fatal(err)
    }
    defer db.Close()

    tx, err := db.Begin()
    if err != nil {
        log.Fatal("tx begin:", err)
    }

    insert := `
      INSERT INTO card
        (name, type, power, toughness, colors, rarity, released_at, img)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `
    _, err = tx.Exec(
        insert,
        card.Name,
        card.TypeLine,
        card.Power,      
        card.Toughness,  
        colors,      
        card.Rarity,
        card.ReleasedAt,
        card.Img,
    )

    if err != nil {
        tx.Rollback()
        log.Fatal("insert exec:", err)
    }

    
    if err := tx.Commit(); err != nil {
        log.Fatal("tx commit:", err)
    }

    
    w.WriteHeader(http.StatusCreated)
    fmt.Fprintf(w, "Card \"%s\" added successfully", card.Name)
}

func countCards(w http.ResponseWriter, r *http.Request) {
    db, err := sql.Open("mysql", "kalaj-mtg:kalaj-mtg-pass@tcp(127.0.0.1:3306)/kalaj-mtg")
    if err != nil {
        log.Fatal("db open:", err)
    }
    defer db.Close()

    colors := []string{"W", "B", "G", "R", "U"}
    results := make(map[string]int)

    for _, col := range colors {
        var cnt int
        err := db.
            QueryRow(
                `SELECT COUNT(*) 
                   FROM card 
                  WHERE JSON_CONTAINS(colors, JSON_ARRAY(?))`,
                col,
            ).
            Scan(&cnt)
        if err != nil {
            log.Fatal("count query:", err)
        }
        results[col] = cnt
    }

    w.Header().Set("Content-Type", "application/json")
    if err := json.NewEncoder(w).Encode(results); err != nil {
        log.Fatal("json encode:", err)
    }
}


func main() {
	r := mux.NewRouter()

	r.HandleFunc("/card", addCard).Methods("POST")
    r.HandleFunc("/cards", countCards).Methods("GET")
	r.HandleFunc("/hello", helloWorld).Methods("GET")

	c := cors.New(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedMethods: []string{http.MethodGet, http.MethodPost, http.MethodPut, http.MethodPatch, http.MethodDelete, http.MethodOptions, http.MethodHead},
		AllowedHeaders: []string{"*"},
	})

	handler := c.Handler(r)
	log.Fatal(http.ListenAndServe(":8000", handler))
}