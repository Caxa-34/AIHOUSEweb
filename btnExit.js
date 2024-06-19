function formatDate(dateString) {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed, so add 1
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}.${month}.${day} ${hours}:${minutes}`;
}

document.addEventListener("DOMContentLoaded", () => {
    //проверка авторизации и показ соответствующего функционала
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    console.log(isLoggedIn);

    if (isLoggedIn) {
        document.getElementById('beforeAuth').style.display = 'none';
        document.getElementById('afterAuth').style.display = 'flex';
        document.getElementById('createPubBtn').style.display = 'block';
        document.getElementById('createChatsBtn').style.display = 'block';
    } else {
        document.getElementById('beforeAuth').style.display = 'flex';
        document.getElementById('afterAuth').style.display = 'none';
        document.getElementById('createPubBtn').style.display = 'none';
        document.getElementById('createChatsBtn').style.display = 'none';
    }


    //выход по кнопке 
    const logoutButton = document.getElementById('logoutButton');

    logoutButton.addEventListener('click', async function () {
        localStorage.removeItem('isLoggedIn');
        localStorage.setItem('id', 0);
        localStorage.setItem('likedPublications', null);
        window.location.href = 'publication.html';

    });
});