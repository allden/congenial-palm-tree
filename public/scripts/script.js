const close = document.getElementsByClassName('close');

function removeElement(element) {
    for(let i = 0; i < element.length; i++) {
        element[i].addEventListener('click', (e) => {
            e.target.parentElement.remove();
        });
    };
};

removeElement(close);