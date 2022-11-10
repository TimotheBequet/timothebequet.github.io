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
        if (   (element.classList.contains('last') && zoom < 0 && opacityElement >= 1)
            || (element.classList.contains('first') && ((zoom > 0) || (zoom < 0 && opacityElement < 1)))
            || (!element.classList.contains('last') && !element.classList.contains('first'))                            
           ) {
            if (zoom > 0) {
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
            } else {
                element.classList.remove('current-slide');
                element.classList.add('unzoomed');
                let previousElement = element.previousElementSibling;
                console.log(previousElement);
                if (previousElement !== null) {                    
                    previousElement.classList.remove('inactive'); 
                    setTimeout(() => {           
                        previousElement.classList.remove('zoomed');  
                        previousElement.classList.add('current-slide');                      
                    }, 1);                    
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