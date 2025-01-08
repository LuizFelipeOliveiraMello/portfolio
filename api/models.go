package main

type Projeto struct {
    ID              int       `json:"id"`
    Nome            string    `json:"nome"`
    BreveDescricao  string    `json:"breve_descricao"`
    Link            string    `json:"link"`
    ImagemDoProjeto string    `json:"imagem_do_projeto"`
    Ferramentas     []string  `json:"ferramentas"` // Lista de ferramentas usadas no projeto
    Tipo            string    `json:"tipo"`
}

type Ferramenta struct {
    ID   int    `json:"id"`
    Nome string `json:"nome"`
}
