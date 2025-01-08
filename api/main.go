package main

import (
    "database/sql"
    "log"
    "net/http"

    "github.com/gin-contrib/cors"
    "github.com/gin-gonic/gin"
    _ "github.com/mattn/go-sqlite3"
)

var db *sql.DB

func main() {
    // Inicializa o banco de dados
    db = initDB()
    defer db.Close()

    // Configura o roteador Gin
    r := gin.Default()

    // Configura o middleware de CORS
    r.Use(cors.New(cors.Config{
        AllowOrigins:     []string{"*"}, // Permite todas as origens (não recomendado para produção)
        AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
        AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
        ExposeHeaders:    []string{"Content-Length"},
        AllowCredentials: true,
    }))

    // Define as rotas
    r.POST("/projetos", addProjeto)
    r.GET("/projetos", getProjetos)

    // Inicia o servidor
    if err := r.Run("https://portfolio-mxuxva.fly.dev/projetos"); err != nil {
        log.Fatal(err)
    }
}

func addProjeto(c *gin.Context) {
    var projeto struct {
        Nome            string   `json:"nome"`
        BreveDescricao  string   `json:"breve_descricao"`
        Link            string   `json:"link"`
        ImagemDoProjeto string   `json:"imagem_do_projeto"`
        Ferramentas     []string `json:"ferramentas"` // Lista de ferramentas
        Tipo            string   `json:"tipo"`
    }

    if err := c.ShouldBindJSON(&projeto); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // Inicia uma transação
    tx, err := db.Begin()
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    // Insere o projeto
    result, err := tx.Exec(`
        INSERT INTO projetos (nome, breve_descricao, link, imagem_do_projeto, tipo)
        VALUES (?, ?, ?, ?, ?)
    `, projeto.Nome, projeto.BreveDescricao, projeto.Link, projeto.ImagemDoProjeto, projeto.Tipo)
    if err != nil {
        tx.Rollback()
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    // Obtém o ID do projeto inserido
    projetoID, _ := result.LastInsertId()

    // Insere as ferramentas e as associa ao projeto
    for _, ferramentaNome := range projeto.Ferramentas {
        // Verifica se a ferramenta já existe
        var ferramentaID int64
        err := tx.QueryRow("SELECT id FROM ferramentas WHERE nome = ?", ferramentaNome).Scan(&ferramentaID)
        if err != nil {
            // Se a ferramenta não existir, insere uma nova
            result, err := tx.Exec("INSERT INTO ferramentas (nome) VALUES (?)", ferramentaNome)
            if err != nil {
                tx.Rollback()
                c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
                return
            }
            ferramentaID, _ = result.LastInsertId()
        }

        // Associa a ferramenta ao projeto
        _, err = tx.Exec("INSERT INTO projeto_ferramentas (projeto_id, ferramenta_id) VALUES (?, ?)", projetoID, ferramentaID)
        if err != nil {
            tx.Rollback()
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }
    }

    // Commit da transação
    if err := tx.Commit(); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "id":              projetoID,
        "nome":            projeto.Nome,
        "breve_descricao": projeto.BreveDescricao,
        "link":            projeto.Link,
        "imagem_do_projeto": projeto.ImagemDoProjeto,
        "ferramentas":     projeto.Ferramentas,
        "tipe":            projeto.Tipo,
    })
}

func getProjetos(c *gin.Context) {
    // Busca todos os projetos
    rows, err := db.Query("SELECT id, nome, breve_descricao, link, imagem_do_projeto, tipo FROM projetos")
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    defer rows.Close()

    var projetos []Projeto
    for rows.Next() {
        var projeto Projeto
        if err := rows.Scan(&projeto.ID, &projeto.Nome, &projeto.BreveDescricao, &projeto.Link, &projeto.ImagemDoProjeto, &projeto.Tipo); err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }

        // Busca as ferramentas associadas ao projeto
        ferramentasRows, err := db.Query(`
            SELECT f.nome
            FROM ferramentas f
            JOIN projeto_ferramentas pf ON f.id = pf.ferramenta_id
            WHERE pf.projeto_id = ?
        `, projeto.ID)
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }
        defer ferramentasRows.Close()

        var ferramentas []string
        for ferramentasRows.Next() {
            var ferramenta string
            if err := ferramentasRows.Scan(&ferramenta); err != nil {
                c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
                return
            }
            ferramentas = append(ferramentas, ferramenta)
        }

        projeto.Ferramentas = ferramentas
        projetos = append(projetos, projeto)
    }

    c.JSON(http.StatusOK, projetos)
}
