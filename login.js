document.getElementById('registrationForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Предотвращаем отправку формы
   
    // Собираем данные формы
    const formData = {
        name: document.getElementById('tbUsername').value,
        password: document.getElementById('tbPassword').value,
        email: document.getElementById('tbEmail').value
    };

    // Отправляем данные на сервер с помощью fetch

    try {
        // Отправляем данные на сервер с помощью fetch
        const response = await fetch('http://94.228.126.25:3210/api/users/registration', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        // Проверяем статус ответа
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Ошибка:', response.status, errorText);
            alert('Кажется возникла ошибка. Вы точно не были зарегестрированы ранее: ' + response.status + ' ' + errorText);
            return;
        }

        const data = await response.json();
        console.log('Ответ от сервера:', data); // Выводим ответ в консоль

        alert('Пользователь успешно зарегистрирован!');
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('id', data.userData.id);
        localStorage.setItem('userName', data.userData.name);
        localStorage.setItem('userImg', data.userData.imagePath);
        window.location.href="publication.html";

    } catch (error) {
        console.error('Ошибка:', error);
        alert('Ошибка при регистрации');
    }

});
    


