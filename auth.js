document.getElementById('autorisationPole').addEventListener('submit', async function (event) {
    event.preventDefault(); // Предотвращает перезагрузку страницы

    // Собираем данные формы
    const formData = {
        name: document.getElementById('username').value,
        password: document.getElementById('password').value,
    };

    try {
        // Отправляем данные на сервер с помощью fetch
        const response = await fetch('http://94.228.126.25:3210/api/users/authorization/name', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(formData)
        });
 
        // Проверяем статус ответа
        if (!response.ok) {
            const res = await response.json();

            console.log(res);
            if(res.message == "UserBanned")
            {
                alert("Ваш аккаунт заблокирован");
            }
            if(res.message == "InvalidPass" || res.message == "NameExists")
                {
                    alert("Ошибка ввода пароля или логина");
                }
            return;
        }

        // Функция для показа уведомления
        const showNotification = (message) => {
            const notification = document.createElement('div');
            notification.className = 'notification';
            notification.textContent = message;
            document.body.appendChild(notification);
            notification.style.display = 'block';
            setTimeout(() => {
                notification.style.display = 'none';
                document.body.removeChild(notification);
            }, 2000);
        };

        const data = await response.json();
        console.log('Ответ от сервера:', data); // Выводим ответ в консоль

        // Сохраняем состояние в localStorage
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('id', data.userData.id); // Сохранение ID пользователя
        localStorage.setItem('userName', data.userData.name); // Сохранение ID пользователя
        localStorage.setItem('userImg', data.userData.imagePath);
        console.log(data.userData.id + " : " + localStorage.getItem('id'));
        console.log(data.userData.name + " : " + localStorage.getItem('userName'));

        showNotification("Вы успешно авторизовались! Добро пожаловать");
        
        window.location.href = "publication.html";



    } catch (error) {
        console.error('Ошибка вида:', error);
        
    }

});


