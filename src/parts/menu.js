var menuPart = (function(){
    
    var btn = document.querySelector('.hamburger');
    var menuUl = document.querySelector('.menu ul');
    btn.addEventListener('click', function(){
        var display = menuUl.style.display === "" ? "block" : "";
        menuUl.style.display = display;
    });

}());