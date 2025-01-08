window.addEventListener("load", () => {
         async function fetchProjects() {
            try {
                const response = await fetch('http://localhost:8080/projetos');
                if (!response.ok) {
                    throw new Error('Erro ao buscar projetos');
                }
                const projetos = await response.json();
                displayProjects(projetos);
            } catch (error) {
                console.error('Erro:', error);
            }
        }

        // Função para exibir os projetos na página
        function displayProjects(projetos) {
            const projectsGrid = document.querySelector('.projects-grid');
            if (projetos.length === 0) {
                projectsGrid.innerHTML = '<p>Nenhum projeto encontrado.</p>';
                return;
            }

                projetos.forEach(projeto => {
                const projectCard = document.createElement('div');
                projectCard.className = 'project-card';
                projectCard.setAttribute('data-category', projeto.tipo); // Você pode ajustar a categoria conforme necessário

                const projImageContainer = document.createElement('div');
                projImageContainer.className = 'proj-image-container';
                const img = document.createElement('img');
                img.src = projeto.imagem_do_projeto || 'https://via.placeholder.com/400x250/CCCCCC/000000?text=Sem+Imagem';
                img.alt = `Imagem do ${projeto.nome}`;
                projImageContainer.appendChild(img);

                const projContent = document.createElement('div');
                projContent.className = 'proj-content';
                
                const h3 = document.createElement('h3');
                h3.textContent = projeto.nome;
                
                const p = document.createElement('p');
                p.textContent = projeto.breve_descricao || 'Descrição não disponível.';
                
                const techIcons = document.createElement('div');
                techIcons.className = 'tech-icons';
                // Aqui você pode adicionar as ferramentas/tecnologias usadas no projeto
                if (projeto.ferramentas && projeto.ferramentas.length > 0) {
                    projeto.ferramentas.forEach(ferramenta => {
                        const span = document.createElement('span');
                        span.textContent = ferramenta;
                        techIcons.appendChild(span);
                    });
                } else {
                    techIcons.innerHTML = '<span>Nenhuma ferramenta associada</span>';
                }
                
                const a = document.createElement('a');
                a.href = projeto.link || '#';
                a.target = '_blank';
                a.textContent = 'Acessar Projeto';

                projContent.appendChild(h3);
                projContent.appendChild(p);
                projContent.appendChild(techIcons);
                projContent.appendChild(a);

                projectCard.appendChild(projImageContainer);
                projectCard.appendChild(projContent);

                projectsGrid.appendChild(projectCard);
            });
        }

        // Chama a função para buscar os projetos quando a página carrega

        fetchProjects();
})


