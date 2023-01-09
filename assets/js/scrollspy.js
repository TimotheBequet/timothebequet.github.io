const scrollspy = {
    section: null, // get all <section> elements
    menuLinks: null, // get all <a> inside <menu> inside <header> element
    sectionHeight: null, // get the height of the top menu
    sectionStartingPointArray: [], // array to store the top-most pixel points of each <section>
    menuLinksArray: [], // array to store the menu elements
    mainElement: null,

    init: function() {
        scrollspy.section = document.querySelectorAll('section'); // get all <section> elements
        scrollspy.menuLinks = document.querySelectorAll('.menu__list-item'); // get all <a> inside <menu> inside <header> element
        scrollspy.sectionHeight = document.querySelector('section').offsetHeight; // get the height of the top menu
        scrollspy.mainElement = document.querySelector('main');        
        // for every <section> element we store their top-most pixel point into an array
        scrollspy.section.forEach((sec) => {scrollspy.sectionStartingPointArray.push(sec.offsetTop);});
        // for every menu link element we store them in an array
        scrollspy.menuLinks.forEach((menuLink) => {scrollspy.menuLinksArray.push(menuLink);});

        scrollspy.mainElement.addEventListener('scroll', scrollspy.handleScroll);
    },

    handleScroll: function(event) {
        // call this function everytime we scroll on the browser window
        // amount of pixel we have scrolled downwards from the top-most point of the web page
        let downwardScroll = event.target.scrollTop;
        // for every <section>'s top-most point
        scrollspy.sectionStartingPointArray.forEach((sectionStart, sectionIndex) => {
            // check if the current downward scroll is on the middle of each <section>
            // by using its top-most point minus its height divide by half
            if (downwardScroll >= sectionStart - scrollspy.sectionHeight / 2) {
                //if so, we remove all the 'active' classes on all menu links
                scrollspy.menuLinksArray.forEach((menu) => {menu.classList.remove('active');});
                //then add the 'active' class on the corresponding menu depending on which section the scroll is currently at
                scrollspy.menuLinksArray[sectionIndex].classList.add('active');
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', scrollspy.init);