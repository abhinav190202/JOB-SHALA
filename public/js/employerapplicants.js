
var buttons = document.getElementsByClassName('special');

for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', function(event) {
        let roleId = event.target.getAttribute('data-roleid');
        window.location.href = roleId;
    });
}