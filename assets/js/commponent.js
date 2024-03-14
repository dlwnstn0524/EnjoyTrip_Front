window.onload = function includeNav() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("header").innerHTML = this.responseText;
        }
    };
    xhttp.open("GET", "./assets/html/nav.html", true);
    xhttp.send();
  }