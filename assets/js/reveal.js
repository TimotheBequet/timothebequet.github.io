const threshold = .1;
const options = {
    root: null,
    rootMargin: '0px',
    threshold
};

const handleIntersect = function (entries, observer) {
    entries.forEach(function (entry) {        
        let intersectRatio = entry.intersectionRatio;
        let customThresold = threshold;
        if (!entry.target.classList.contains('parcours__timeline')) {
            intersectRatio += 0.4;
            customThresold += 0.4;
        }
        if (intersectRatio > customThresold) {
            entry.target.classList.add('reveal-visible');
            observer.unobserve(entry.target);
        }
    });
};

document.addEventListener('DOMContentLoaded', function(){
    const observer = new IntersectionObserver(handleIntersect, options);
    document.querySelectorAll('.reveal').forEach(function(element){
        observer.observe(element);
    });
});