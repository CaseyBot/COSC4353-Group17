function go() {
    if (document.getElementById('new').checked) {
        location.href = 'register.html'
    } else if (document.getElementById('existing').checked) {
        location.href = 'hub.html'
    }
}