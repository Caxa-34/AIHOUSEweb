
const open = document.getElementById('openModCont');
const modalContainer = document.getElementById('modal-container');
const close = document.getElementById('reg');

open.addEventListener('click', () => {
    modalContainer.classList.add('show');

});

close.addEventListener('click', () => {
    modalContainer.classList.remove('show');
    
})