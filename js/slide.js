const slide = {
    isTransitionTerminated: true,
    /**
     * init : lancé quand la page est chargée
     */
    init: function() {
        // affectation évènement du mouvement de la molette de la souris
        // qui ne se déclenche que sur les slides de la page
        document.addEventListener('wheel', slide.handleWheelMouse);
        // récupération de tous les éléments du menu de navigation
        let navMenuElements = document.getElementsByClassName('navbar-brand');
        // on boucle dessus
        for (let i = 0; i < navMenuElements.length; i++) {
            // on affecte un élément click à chaque élément du menu
            navMenuElements[i].addEventListener('click', slide.handleClickNav);
        }
    },

    /**
     * handleWheelMouse()
     * @param {*} event 
     * évènement qui capte le roulement de la molette de la souris
     */
    handleWheelMouse: function(event) {
        // on récupère l'élément sous la souris au moment du scroll avec la molette
        let elementScrolled = event.target.closest('.slide');
        if (elementScrolled != null) {
            /**
             * Bloc d'évènements permettant d'attendre qu'une transition
             * soit terminée avant de pouvoir en lancer une autre.
             */
            // transitionstart est lancé au début de la transition : on bloque le zoom/dezoom sur d'autres éléments
            elementScrolled.addEventListener('transitionstart', () => {slide.isTransitionTerminated = false;});
            // transitionrun est lancé pendant que la transition est en cours : on bloque le zoom/dezoom sur d'autres éléments
            elementScrolled.addEventListener('transitionrun', () => {slide.isTransitionTerminated = false;});
            // transitioncancel est lancé lorsqu'une transition est annulée : on libère la possibilité de zoomer/dézoomer
            elementScrolled.addEventListener('transitioncancel', () => {slide.isTransitionTerminated = true;});
            // transitioncancel est lancé lorsqu'une transition est terminée : on libère la possibilité de zoomer/dézoomer
            elementScrolled.addEventListener('transitionend', () => {slide.isTransitionTerminated = true;});
            if (slide.isTransitionTerminated) {
                // transition terminée : on peut de nouveau lancer une transition
                slide.zoomDezoomElement(elementScrolled, event.deltaY);
            }
        }
    },

    /**
     * zoomDezoomElement()
     * @param {*} element = élément courant
     * @param {*} zoom = valeur du scroll avec la molette : positif on zoome, négatif on dézoome
     * fonction gerant le zoom/dézoom
     */
    zoomDezoomElement: function(element, zoom) {
        // on récupère la valeur de l'opacité de l'élément
        const opacityElement = parseFloat(slide.getOpacity(element));
        /*
          La condition suivante permet de s'assurer que :
          - si on est sur la première slide, on ne puisse pas dézoomer
          - si on est sur la dernière slide on ne puisse pas zoomer
        */
        if (   (element.classList.contains('last') && zoom < 0 && opacityElement >= 1)
            || (element.classList.contains('first') && ((zoom > 0) || (zoom < 0 && opacityElement < 1)))
            || (!element.classList.contains('last') && !element.classList.contains('first'))                            
           ) {
            if (zoom > 0) {
                // zoom positif : on passe a la prochaine slide
                slide.nextSlide(element);      
            } else {
                // zoom négatif, on passe à la slide précédente
                slide.previousSlide(element);
            }            
        }        
    },
    
    /**
     * getOpacity()
     * @param {*} element 
     * @returns l'opacité de l'élément passé en paramètre
     */
    getOpacity: function(element) {
        return window.getComputedStyle(element).getPropertyValue('opacity');
    },

    /**
     * nextSlide()
     * @param {*} element : slide en cours
     * @returns la slide suivante celle passée en paramètre
     * Permet de passer à la slide suivante
     */
    nextSlide: function(element) {
        // on récupère la slide suivante
        let nextElement = element.nextElementSibling; 
        // si elle existe bien 
        if (nextElement !== null) {  
            // on enlève la classe 'current-slide' à l'élément courant
            element.classList.remove('current-slide');
            // on lui ajoute la classe 'zoomed' pour donner un effet de zoom et de mise en transparence
            element.classList.add('zoomed'); 
            // après 2 seconde, on lui affecte la classe 'inactive' pour lui donner un display:none            
            setTimeout(() => {           
                element.classList.add('inactive');
            }, 1500);
            // on enlève la classe 'unzoomed' à l'élément suivant pour lui donner un scale de 1
            nextElement.classList.remove('unzoomed');
            // et on lui donne la classe 'current-slide'
            nextElement.classList.add('current-slide');
            // on appelle la fonction pour mettre en surbrillance l'élément du menu
            // correspondant à la nouvelle slide.
            slide.changeSelectionNavElement(nextElement);
        }
        // on retourne la slide sur laquelle on vient de se positionner
        return nextElement;        
    },

    /**
     * previousSlide()
     * @param {*} element : slide en cours
     * @returns la slide précédent celle passée en paramètre
     * Permet de passer à la slide précédente
     */
    previousSlide: function(element) {
        // on récupère la slide précédente
        let previousElement = element.previousElementSibling;
        // si elle existe bien
        if (previousElement !== null) { 
            // on enlève la classe 'current-slide' à l'élément courant
            element.classList.remove('current-slide');
            // on lui ajoute la classe 'unzoomed' pour donner un effet d'éloignement
            element.classList.add('unzoomed');    
            // on enlève la classe 'inactive" à la slide précédente pour la remettre visible                           
            previousElement.classList.remove('inactive'); 
            // on gère un timeout de 1 milliseconde pour enlever la classe 'zoomed' à l'élément précédent,
            // sinon l'animation ne se fait pas.
            setTimeout(() => {           
                previousElement.classList.remove('zoomed');  
                previousElement.classList.add('current-slide');
                // on appelle la fonction pour mettre en surbrillance l'élément du menu
                // correspondant à la nouvelle slide.
                slide.changeSelectionNavElement(previousElement);                  
            }, 10);                                
        }
        // on retourne la slide sur laquelle on vient de se positionner
        return previousElement;
    }, 
    
    /**
     * changeSelectionNavElement()
     * @param {*} element : slide à qui on donne le focus
     * Permet de mettre en surbrillance un élément du menu 
     * en fonction de la slide sur laquelle on se positionne
     */
    changeSelectionNavElement: function(element) {
        // on enleve la classe 'current-nav' à l'élément du menu qui la possède
        document.getElementsByClassName('current-nav')[0].classList.remove('current-nav');
        // on récupère l'id de la slide en cours
        const idNextElement = element.id;
        // on génère l'id de l'élément du menu correspondant, avec le suffixe 'nav-'
        const idNavElement = 'nav-' + idNextElement;
        // et on récupère l'élément du menu grâce à cet id
        const navElement = document.getElementById(idNavElement);
        if (navElement !== null) {
            // l'élement du menu a bien été trouvé, on lui affecte
            // la classe 'current-nav' pour le mettre en surbrillance
            navElement.classList.add('current-nav');
        }        
    },

    /**
     * handleClickNav()
     * @param {*} event : élément du menu clické
     * Evenement de click sur un élément du menu de navigation
     */
    handleClickNav: function(event) {
        // on récupère l'id de l'élément cliqué
        const idElementClicked = event.target.id;
        // on récupère l'id de la slide correspondante
        const idSlide = idElementClicked.replace('nav-', '');
        // on récupère l'élément slide à laquelle on doit aller
        const slideToGo = document.getElementById(idSlide);
        // on récupère aussi sa position
        const positionSlideToGo = slide.getPositionSlide(slideToGo);
        // on récupère aussi l'élément slide courante
        let currentSlide = document.getElementsByClassName('current-slide')[0];
        // on récupère aussi sa position
        let positionCurrentSlide = slide.getPositionSlide(currentSlide);
        // la slide courante et celle sur laquelle on veut se positionner existent bien
        if (currentSlide !== null && slideToGo !== null && currentSlide !== slideToGo) { 
            // si la position où on veut aller est supérieure
            // à la position où on est : faut aller sur une slide suivante
            if (positionSlideToGo > positionCurrentSlide) {
                do {
                    // on avance dans les slides jusqu'à celle qu'on veut
                    currentSlide = slide.nextSlide(currentSlide);
                    positionCurrentSlide++;
                } while (positionCurrentSlide < positionSlideToGo);
            } else {
                // sinon si la position où on veut aller est inférieure
                // à la position où on est : faut aller sur une slide précédente                
                do {
                    // on recule dans les slides jusqu'à celle qu'on veut
                    currentSlide = slide.previousSlide(currentSlide);
                    positionCurrentSlide--;
                } while (positionCurrentSlide > positionSlideToGo);
            }
        }                
    },

    /**
     * getPositionSlide()
     * @param {*} uneSlide : slide dont on veut connaitre la position
     * @returns la position de la slide passée en paramètre
     * Permet de connaitre la position d'une slide
     */
    getPositionSlide: function(uneSlide) {
        // on récupère la liste des slides
        const arraySlides = document.getElementsByClassName('slide');
        let position = 0;
        // on parcourt cette liste
        for (let i = 0; i < arraySlides.length && position === 0; i++) {
            // la slide de la liste correspond à celle passée en paramètre
            // on s'arrête là et on retourne la position
            if (arraySlides[i] === uneSlide) {
                position = i+1;
            }
        }
        return position-1;
    }
};

document.addEventListener('DOMContentLoaded', slide.init);