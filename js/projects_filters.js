window.addEventListener("load", () => {
    
    const filterButtons = document.querySelectorAll(".category-filter button");
    const noProjectsMsg = document.querySelector(".no-projects");

    const category = new Map();
   
    
    filterButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const projectCards = document.querySelectorAll(".project-card");
        if (btn.classList.contains("active")){
                btn.classList.remove("active");
                category.delete(btn.getAttribute("data-category"));
        } else {
                btn.classList.add("active");
                category.set(btn.getAttribute("data-category"), "active");
        }

        // Verifica a categoria
        let countVisible = 0;

        projectCards.forEach(card => {
          const cardCategory = card.getAttribute("data-category");

          if (category.get(cardCategory) == "active") {
            card.style.display = "block";
            countVisible++;
          } 
          if (category.get(cardCategory) != "active"){
                card.style.display = "none";
          }
          
          if (category.get("all") == "active"){
                card.style.display = "block";
          }
          
          if (category.get("front-end") == "active" || category.get("back-end") == "active"){
                if(cardCategory == "Full-Stack"){
                        card.style.display = "block";
                } 
          }
            
        });

        // Mostra ou esconde mensagem de "Nenhum projeto"
        noProjectsMsg.style.display = countVisible === 0 ? "block" : "none";
      });
    });

})
