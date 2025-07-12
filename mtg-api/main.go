package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

// Card to be written to MySQL
type Card struct {
	Name       string   `json:"name"`
	TypeLine   string   `json:"type_line"`
	Power      int      `json:"power"`
	Toughness  int      `json:"toughness"`
	Colors     []string `json:"colors"`
	Rarity     string   `json:"rarity"`
	ReleasedAt string   `json:"released_at"`
	Img        string   `json:"img"`
}

type Fullcard struct {
	ID         int      `json:"id"`
	Name       string   `json:"name"`
	TypeLine   string   `json:"type_line"`
	Power      int      `json:"power"`
	Toughness  int      `json:"toughness"`
	Colors     []string `json:"colors"`
	Rarity     string   `json:"rarity"`
	ReleasedAt string   `json:"released_at"`
	Img        string   `json:"img"`
}

type Hello struct {
	ID    int    `json:"id"`
	Hello string `json:"hello"`
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

func cardColors(w http.ResponseWriter, r *http.Request) {
	log.Println("cardColors called")

	var req struct {
		Color string `json:"color"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON payload", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	db, err := sql.Open("mysql", "kalaj-mtg:kalaj-mtg-pass@tcp(127.0.0.1:3306)/kalaj-mtg")
	if err != nil {
		log.Println("db open error:", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	defer db.Close()

	rows, err := db.Query(`SELECT * FROM card WHERE JSON_CONTAINS(colors, JSON_ARRAY(?))`, req.Color)
	if err != nil {
		log.Println("query error:", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var results []Fullcard
	for rows.Next() {
		var c Fullcard
		var rawColors []byte
		if err := rows.Scan(
			&c.ID,
			&c.Name,
			&c.TypeLine,
			&c.Power,
			&c.Toughness,
			&rawColors,
			&c.Rarity,
			&c.ReleasedAt,
			&c.Img,
		); err != nil {
			log.Println("scan error:", err)
			http.Error(w, "Server error", http.StatusInternalServerError)
			return
		}
		if err := json.Unmarshal(rawColors, &c.Colors); err != nil {
			log.Println("unmarshal colors:", err)
			http.Error(w, "Server error", http.StatusInternalServerError)
			return
		}
		results = append(results, c)
	}
	if err := rows.Err(); err != nil {
		log.Println("rows iteration error:", err)
		http.Error(w, "Server error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(results); err != nil {
		log.Println("json encode error:", err)
	}
}

func total(w http.ResponseWriter, r *http.Request) {
	db, err := sql.Open("mysql", "kalaj-mtg:kalaj-mtg-pass@tcp(127.0.0.1:3306)/kalaj-mtg")
	if err != nil {
		log.Println("db open error:", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	defer db.Close()

	var cnt int
	if err := db.QueryRow(`SELECT COUNT(*) FROM card`).Scan(&cnt); err != nil {
		log.Println("total query error:", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]int{"total": cnt})
}

func totalUniq(w http.ResponseWriter, r *http.Request) {
	db, err := sql.Open("mysql", "kalaj-mtg:kalaj-mtg-pass@tcp(127.0.0.1:3306)/kalaj-mtg")
	if err != nil {
		log.Println("db open error:", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	defer db.Close()

	var cnt int
	if err := db.QueryRow(`SELECT COUNT(*) FROM (SELECT DISTINCT name FROM card) as Derived`).Scan(&cnt); err != nil {
		log.Println("total query error:", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]int{"total": cnt})
}

func getCard(w http.ResponseWriter, r *http.Request) {
	log.Println("getCard called")

	var ID struct {
		ID int `json:"id"`
	}

	if err := json.NewDecoder(r.Body).Decode(&ID); err != nil {
		http.Error(w, "Invalid JSON payload", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	db, err := sql.Open("mysql", "kalaj-mtg:kalaj-mtg-pass@tcp(127.0.0.1:3306)/kalaj-mtg")
	if err != nil {
		log.Println("db open error:", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	defer db.Close()

	rows, err := db.Query(`SELECT * FROM card WHERE id = ?`, ID.ID)
	if err != nil {
		log.Println("query error:", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var results []Fullcard
	for rows.Next() {
		var c Fullcard
		var rawColors []byte
		if err := rows.Scan(
			&c.ID,
			&c.Name,
			&c.TypeLine,
			&c.Power,
			&c.Toughness,
			&rawColors,
			&c.Rarity,
			&c.ReleasedAt,
			&c.Img,
		); err != nil {
			log.Println("scan error:", err)
			http.Error(w, "Server error", http.StatusInternalServerError)
			return
		}
		if err := json.Unmarshal(rawColors, &c.Colors); err != nil {
			log.Println("unmarshal colors:", err)
			http.Error(w, "Server error", http.StatusInternalServerError)
			return
		}
		results = append(results, c)
	}
	if err := rows.Err(); err != nil {
		log.Println("rows iteration error:", err)
		http.Error(w, "Server error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(results); err != nil {
		log.Println("json encode error:", err)
	}
}

func main() {
	r := mux.NewRouter()

	r.HandleFunc("/card", addCard).Methods("POST")
	r.HandleFunc("/cards", countCards).Methods("GET")
	r.HandleFunc("/total", total).Methods("GET")
	r.HandleFunc("/totaluniq", totalUniq).Methods("GET")
	r.HandleFunc("/cardcolors", cardColors).Methods("POST")
	r.HandleFunc("/getcard", getCard).Methods("POST")
	r.HandleFunc("/hello", helloWorld).Methods("GET")

	c := cors.New(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedMethods: []string{http.MethodGet, http.MethodPost, http.MethodPut, http.MethodPatch, http.MethodDelete, http.MethodOptions, http.MethodHead},
		AllowedHeaders: []string{"*"},
	})

	handler := c.Handler(r)
	log.Fatal(http.ListenAndServe(":8000", handler))
}
