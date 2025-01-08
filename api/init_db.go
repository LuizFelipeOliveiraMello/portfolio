package main

import (
    "database/sql"
    "log"

    _ "github.com/mattn/go-sqlite3"
)

func initDB() *sql.DB {
    db, err := sql.Open("sqlite3", "./portfolio.db")
    if err != nil {
        log.Fatal(err)
    }

    // Cria a tabela de projetos
    _, err = db.Exec(`
        CREATE TABLE IF NOT EXISTS projetos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            breve_descricao TEXT,
            link TEXT,
            imagem_do_projeto TEXT,
            tipo TEXT
        );
    `)
    if err != nil {
        log.Fatal(err)
    }

    // Cria a tabela de ferramentas
    _, err = db.Exec(`
        CREATE TABLE IF NOT EXISTS ferramentas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL
        );
    `)
    if err != nil {
        log.Fatal(err)
    }

    // Cria a tabela de relacionamento entre projetos e ferramentas
    _, err = db.Exec(`
        CREATE TABLE IF NOT EXISTS projeto_ferramentas (
            projeto_id INTEGER NOT NULL,
            ferramenta_id INTEGER NOT NULL,
            FOREIGN KEY (projeto_id) REFERENCES projetos (id),
            FOREIGN KEY (ferramenta_id) REFERENCES ferramentas (id)
        );
    `)
    if err != nil {
        log.Fatal(err)
    }

    return db
}
