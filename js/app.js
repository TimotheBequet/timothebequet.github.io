const app = {
    fireEventScroll: true,
    scroll: 0,
    arrows: null,

    init: function() {
        // fleches 'back to top'
        app.arrows = document.querySelector('.container-arrows');
        app.arrows.addEventListener('click', app.handleArrowsClick);
        // élément main
        app.mainElement = document.querySelector('main');
        app.mainElement.addEventListener('scroll', app.handleScroll);
        // élement téléphone et mail du menu
        document.querySelectorAll('.hover-shake').forEach(element => {
            element.addEventListener('mouseenter', app.handleMouseEnter);
            element.addEventListener('mouseout', app.handleMouseOut);
        });
    },

    handleScroll: function(event) {
        if (app.scroll !== event.target.scrollTop) {
            app.scroll = event.target.scrollTop;
            if (event.target.scrollTop > 100 && app.fireEventScroll) {
                // on rend visible les fleches 'back to top'
                app.arrows.classList.remove('hidden');
                app.fireEventScroll = false;
            } else if (event.target.scrollTop < 100 && !app.fireEventScroll) {
                // on rend invisible les fleches 'back to top'
                app.arrows.classList.add('hidden');
                app.fireEventScroll = true;
            }         
        }
    },

    handleArrowsClick: function() {
        app.mainElement.scrollTop = 0;
    },

    handleMouseEnter: function(event) {
        let imageElement = null;
        if (event.currentTarget.classList.contains('phone'))
            imageElement = document.querySelector('.bi-telephone');
        else
            imageElement = document.querySelector('.bi-envelope-at');
        imageElement.classList.add('shake');
    },

    handleMouseOut: function(event) {
        let imageElement = null;
        if (event.currentTarget.classList.contains('phone'))
            imageElement = document.querySelector('.bi-telephone');
        else
            imageElement = document.querySelector('.bi-envelope-at');        
        imageElement.classList.remove('shake');
    },
}

document.addEventListener('DOMContentLoaded', app.init);