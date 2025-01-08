window.addEventListener('load', () => {
         const tagInputField = document.querySelector("#tag-input-field");
    let pageSelected = 0;
    const list = document.querySelector("nav");
    
    const bottomLine = document.getElementById("bottomLine");
    const menuLinks = document.querySelectorAll("nav a");
    
    const firstPage = document.querySelector(".firstPage");
    const secondPage = document.querySelector(".secondPage"); 
    const aboutmePage = document.querySelector(".about-me"); 
    
    const savePagePos = firstPage.getBoundingClientRect().width + 'px';
    const savePageLeft = firstPage.getBoundingClientRect().left + 'px';
               
    bottomLine.style.width = `${list.children[0].getBoundingClientRect().width}px`;
    bottomLine.style.left = `${list.children[0].getBoundingClientRect().left - list.children[0].parentElement.getBoundingClientRect().left}px`;
    aboutmePage.style.display = "none";
    secondPage.style.display = "none";
    firstPage.style.display = "flex";
    
    menuLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault(); // Evita que links recarreguem a página
        const targetLink = e.target;
        firstPage.style.left = `600px`;
        
        
        if(e.target.getAttribute('data-target') == 'about-me'){
                firstPage.style.display = "none";
                secondPage.style.display = "none";
                aboutmePage.style.display = "flex";
        
                aboutmePage.style.order = 1;
                firstPage.style.order = 2;
                secondPage.style.order = 3;
                
                aboutmePage.style.left = savePageLeft;
                firstPage.style.left = "2000px";
                secondPage.style.left = "2000px";
        } else if(e.target.getAttribute('data-target') == 'search') {
                aboutmePage.style.display = "none";
                secondPage.style.display = "none";
                firstPage.style.display = "flex";
        
                firstPage.style.order = 1;
                secondPage.style.order = 2;      
                aboutmePage.style.order = 3;  
                
                aboutmePage.style.left = "2000px";
                firstPage.style.left = savePageLeft;
                secondPage.style.left = "2000px";
        } else if(e.target.getAttribute('data-target') == 'projects') {
                aboutmePage.style.display = "none";
                firstPage.style.display = "none";
                secondPage.style.display = "flex";
        
                secondPage.style.order = 1;        
                firstPage.style.order = 2;
                aboutmePage.style.order = 3;
            
                aboutmePage.style.left = "2000px";
                firstPage.style.left = "2000px";
                secondPage.style.left = savePageLeft;
        }
        
        // Atualiza a posição da linha inferior
        const linkRect = targetLink.getBoundingClientRect();
        const menuRect = targetLink.parentElement.getBoundingClientRect();

        bottomLine.style.width = `${linkRect.width}px`;
        bottomLine.style.left = `${linkRect.left - menuRect.left}px`;
      });
    });
    
    // Função para estilizar o texto enquanto o usuário digita
    const styleInputText = () => {
      const text = tagInputField.innerText.replace(/\n/g, ""); // Remove quebras de linha
      
      const style = text.split();
      
   
      const styledText = text
        .split(" ")
        .map((word) => {
          if (word.includes(':')) {
            return `<span class="tag"><span class="left">${word.split(':')[0]}</span><span class="right">:${word.split(':')[1]}</span></span>`; // Adiciona a classe "tag" para estilizar em azul
          }
          return word; // Texto normal, sem estilização
        })
        .join(" ");

      // Substitui o HTML do campo editável para aplicar a estilização
      tagInputField.innerHTML = styledText;

      // Move o cursor para o final do texto após atualização
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(tagInputField);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    };

    // Aplica a estilização quando o usuário digita
    tagInputField.addEventListener("input", styleInputText);

    // Pressionar Enter para buscar e exibir resultados
    tagInputField.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();

        const text = tagInputField.innerText.trim();
        const tags = text.split(" ").filter((word) => word.startsWith("tag:"));
        const left = text.split(":")[0];
        const rigth = text.split(":")[1];
        
        // Esconde todos os resultados inicialmente
        document.querySelectorAll(".result").forEach((result) => {
          result.style.display = "none";
        });

        // Exibe resultados específicos com base nas tags
        if (tags.includes("tag:js")) {
          document.querySelector("#result-js").style.display = "block";
        }
        if (tags.includes("tag:html")) {
          document.querySelector("#result-html").style.display = "block";
        }
        if (tags.includes("tag:css")) {
          document.querySelector("#result-css").style.display = "block";
        }

        // Caso não haja tags válidas, exibe um alerta
        if (tags.length === 0) {
          alert("Nenhuma tag válida detectada na sua pesquisa.");
        }
      }
    });

})
