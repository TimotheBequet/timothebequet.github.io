const slide = {
    init: function() {
        document.addEventListener('wheel', slide.handleWheelMouse);
    },

    handleWheelMouse: function(event) {
        let elementScrolled = event.target.closest('.slide');
        if (elementScrolled != null) {
            slide.zoomDezoomElement(elementScrolled, event.deltaY);
        }
    },

    zoomDezoomElement: function(element, zoom) {
        let opacityElement = parseFloat(slide.getOpacity(element));
        const scaleX = element.getBoundingClientRect().width / element.offsetWidth;
        if (   (element.classList.contains('last') && zoom < 0 && opacityElement >= 1)
            || (element.classList.contains('first') && ((zoom > 0) || (zoom < 0 && opacityElement < 1)))
            || (!element.classList.contains('last') && !element.classList.contains('first'))                            
           ) {    
            let newScale = 0;                    
            if (zoom > 0) {
                newScale = scaleX + 0.2;
                opacityElement -= 0.2;
            } else {
                newScale = scaleX - 0.4;
                opacityElement += 0.4;
            }

            if (slide.arrond(newScale) <= 1) {
                newScale = 1;
                element.style.opacity = 1;
                element.style.transform = 'scale(1)';                  
            } else {
                if (opacityElement > 1)
                    opacityElement = 1;
                else if (opacityElement < 0)
                    opacityElement = 0;  
                    
                element.style.opacity = opacityElement;
                element.style.transform = 'scale(' + newScale + ')'; 
            }
            
            if (opacityElement <= 0) {
                // si l'élément courant a une opacité de 0 ou moins, 
                //faut le faire disparaitre pour se positionner sur l'élément suivant
                let nextElement = element.nextElementSibling;  
                if (nextElement !== null)              
                    element.classList.add('inactive');               
            } else if (newScale === 1 && zoom < 0) {
                // le scale de l'élément courant est à 1, et on dézoome
                // il faut rendre visible l'élement précédent s'il existe
                let previousElement = element.previousElementSibling;
                if (previousElement !== null) {
                    previousElement.classList.remove('inactive');
                }
            }
            
        }        
    },
    
    getOpacity: function(element) {
        return window.getComputedStyle(element).getPropertyValue('opacity');
    },

    arrond: function(number) {
        return Math.round(number * 100) / 100;
    }
};

document.addEventListener('DOMContentLoaded', slide.init);