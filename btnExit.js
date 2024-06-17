
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
logoutButton.addEventListener('click', function () {
    localStorage.removeItem('isLoggedIn');
    //localStorage.removeItem('userId', 0); 
    window.location.href = 'publication.html';
    // jwt token

    //если сделан выход запускаем скрипт отображающий публикации с 
    //вычетом публикаций пользователя в id 0 и лайки с неактивными кнопками 
});
});