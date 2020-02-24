function addAutoResize(){
    document.querySelectorAll("[data-autoresize]").forEach(function (element) {
        console.log(element);
          element.style.height = "1px";
          element.style.height = (25+element.scrollHeight)+"px";

          element.style.boxSizing = 'border-box';
        var offset = element.offsetHeight - element.clientHeight;
        document.addEventListener('input', function (event) {
          event.target.style.height = 'auto';
          event.target.style.height = event.target.scrollHeight + offset + 'px';
        });
        element.removeAttribute('data-autoresize');
      });       
}



