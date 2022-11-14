const slide = {
    isTransitionTerminated: true,
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

    handleWheelMouse: function(event) {
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

    zoomDezoomElement: function(element, zoom) {
        let opacityElement = parseFloat(slide.getOpacity(element));
        if (   (element.classList.contains('last') && zoom < 0 && opacityElement >= 1)
            || (element.classList.contains('first') && ((zoom > 0) || (zoom < 0 && opacityElement < 1)))
            || (!element.classList.contains('last') && !element.classList.contains('first'))                            
           ) {
            if (zoom > 0) {
                slide.nextSlide(element);      
            } else {
                slide.previousSlide(element);
            }            
        }        
    },
    
    getOpacity: function(element) {
        return window.getComputedStyle(element).getPropertyValue('opacity');
    },

    nextSlide: function(element, blGereNavbar=true) {
        element.classList.remove('current-slide');
        element.classList.add('zoomed');
        let nextElement = element.nextElementSibling;  
        if (nextElement !== null) {   
            setTimeout(() => {           
                element.classList.add('inactive');
            }, 2000);
            nextElement.classList.remove('unzoomed');
            nextElement.classList.add('current-slide');
            if (blGereNavbar)
                slide.changeSelectionNavElement(nextElement);
        }
        return nextElement;        
    },

    previousSlide: function(element, blGereNavbar=true) {
        element.classList.remove('current-slide');
        element.classList.add('unzoomed');
        let previousElement = element.previousElementSibling;
        if (previousElement !== null) {                    
            previousElement.classList.remove('inactive'); 
            setTimeout(() => {           
                previousElement.classList.remove('zoomed');  
                previousElement.classList.add('current-slide');
                if (blGereNavbar)
                    slide.changeSelectionNavElement(previousElement);                  
            }, 1);                                
        }
        return previousElement;
    }, 
    
    changeSelectionNavElement: function(element) {
        document.getElementsByClassName('current-nav')[0].classList.remove('current-nav');
        const idNextElement = element.id;
        const idNavElement = 'nav-' + idNextElement;
        const navElement = document.getElementById(idNavElement);
        if (navElement !== null) {
            navElement.classList.add('current-nav');
        }        
    },

    handleClickNav: function(event) {
        // on récupère l'id de l'élément cliqué
        const idElementClicked = event.target.id;
        // on récupère l'id de la slide correspondante
        const idSlide = idElementClicked.replace('nav-', '');
        // on récupère l'élément slide à laquelle on doit aller
        const slideToGo = document.getElementById(idSlide);
        const positionSlideToGo = slide.getPositionSlide(slideToGo);
        // on récupère aussi l'élément slide courante
        let currentSlide = document.getElementsByClassName('current-slide')[0];
        let positionCurrentSlide = slide.getPositionSlide(currentSlide);
        if (currentSlide !== null && slideToGo !== null) { 
            if (positionSlideToGo > positionCurrentSlide) {
                do {
                    currentSlide = slide.nextSlide(currentSlide);
                    positionCurrentSlide++;
                } while (positionCurrentSlide < positionSlideToGo);
            } else {
                do {
                    currentSlide = slide.previousSlide(currentSlide);
                    positionCurrentSlide--;
                } while (positionCurrentSlide > positionSlideToGo);
            }
        }                
    },

    getPositionSlide: function(uneSlide) {
        const arraySlides = document.getElementsByClassName('slide');
        let position = 0;
        for (let i = 0; i < arraySlides.length && position === 0; i++) {
            if (arraySlides[i] === uneSlide) {
                position = i+1;
            }
        }
        return position-1;
    }
};

document.addEventListener('DOMContentLoaded', slide.init);