document.getElementById('goBackLink').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default action of the hyperlink
    window.history.back(); // Redirect back to the previous page
});