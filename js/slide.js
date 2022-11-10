const slide = {
    isTransitionTerminated: true,
    init: function() {
        document.addEventListener('wheel', slide.handleWheelMouse);
        document.addEventListener('touchmove', slide.handleWheelMouse);
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

    nextSlide: function(element) {
        element.classList.remove('current-slide');
        element.classList.add('zoomed');
        let nextElement = element.nextElementSibling;  
        if (nextElement !== null) {   
            setTimeout(() => {           
                element.classList.add('inactive');
            }, 2000);
            nextElement.classList.remove('unzoomed');
            nextElement.classList.add('current-slide');
        }
    },

    previousSlide: function(element) {
        element.classList.remove('current-slide');
        element.classList.add('unzoomed');
        let previousElement = element.previousElementSibling;
        if (previousElement !== null) {                    
            previousElement.classList.remove('inactive'); 
            setTimeout(() => {           
                previousElement.classList.remove('zoomed');  
                previousElement.classList.add('current-slide');                      
            }, 1);                    
        }
    },    
};

document.addEventListener('DOMContentLoaded', slide.init);