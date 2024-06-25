document.addEventListener('DOMContentLoaded', async function () {

    // Получить элементы 
    var modal = document.getElementById("rulesModal");
    var btnShowRules = document.getElementById("btnShowRules");
    var btnAcceptAndRegister = document.getElementById("btnAcceptAndRegister");
    var spanClose = document.getElementsByClassName("close")[0];

    // Показать модальное окно при нажатии на кнопку "Продолжить"
    btnShowRules.onclick = async function (event) {
        modal.style.display = "block";
       
        const name = document.getElementById('tbUsername').value;
        const password = document.getElementById('tbPassword').value;
        const email = document.getElementById('tbEmail').value;

        const formData = {
            name: name,
            password: password,
            email: email
        };

        // Отправляем данные на сервер с помощью fetch
        try {
            console.log(formData);

            if (name != '' && password != '' && email != '') {

                // Проверяем, заполнены ли все поля
                if (name.value === "" || password.value === "" || email.value === "") {
                    // Если одно из полей пустое, предотвращаем отправку формы
                    event.preventDefault();
                    // Отображаем сообщение б ошибке
                    
                    alert("Упс... кажется вы заполнили не все поля");
                }


                // Отправляем данные на сервер с помощью fetch
                const response = await fetch('http://94.228.126.25:3210/api/users/getCode', {
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
                    if (res.message == "NameUsed") {
                        alert("Пользователь с таким именем уже есть");
                       location.reload();
                    }
                    if (res.message == "EmailUsed") {
                        alert("Email уже занят");
                        location.reload();
                    }
                    return;
                }

                const data = await response.json();
                console.log('Ответ от сервера:', data); // Выводим ответ в консоль

                //const varifCode = data.verificationCode;
                localStorage.setItem('varifCode', data.verificationCode)
                console.log(localStorage.getItem('varifCode'));


            }
            else {
                // Если одно из полей пустое, предотвращаем отправку формы
                event.preventDefault();
                // Отображаем сообщение б ошибке
                alert("Упс... кажется вы заполнили не все поля");
                window.location.reload();
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Ошибка при регистрации');
        }
    }

    // Закрыть модальное окно при нажатии на "крестик"
    spanClose.onclick = function () {
        modal.style.display = "none";
    }

    // Закрыть модальное окно, если кликнули вне окна
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // Обработка кнопки "Принять и зарегистрироваться"
    btnAcceptAndRegister.onclick = async function (event) {



        const name = document.getElementById('tbUsername').value;
        const password = document.getElementById('tbPassword').value;
        const email = document.getElementById('tbEmail').value;

        const formData = {
            name: name,
            password: password,
            email: email
        };

        // Отправляем данные на сервер с помощью fetch

        if (name.value == "" || password.value == "" || email.value == "") {
            // Если одно из полей пустое, предотвращаем отправку формы
            event.preventDefault();
            // Отображаем сообщение б ошибке
            alert("Упс... кажется вы заполнили не все поля");
            
        }
        else {
            try {
                const varifText = document.getElementById('varificText').value;
                console.log('Текст из varifText:', varifText);

                const storedValue = localStorage.getItem('varifCode'); // Предполагается, что вы храните значение varifText под этим ключом
                console.log('Значение из localStorage:', storedValue);

                if (varifText === storedValue) {
                    console.log('Значения совпадают, продолжаем выполнение запроса.');

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
                        alert('Кажется возникла ошибка. Вы точно не были зарегестрированы ранее? Ошибка: ' + response.status + ' ' + errorText);
                        return;
                    }

                    const data = await response.json();
                    console.log('Ответ от сервера:', data); // Выводим ответ в консоль

                    alert('Пользователь успешно зарегистрирован!');
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('id', data.userData.id);
                    localStorage.setItem('userName', data.userData.name);
                    localStorage.setItem('userImg', data.userData.imagePath);
                    window.location.href = "publication.html";
                    modal.style.display = "none";
                }
                else {
                    console.error('Значения не совпадают. Окно будет закрыто.');
                    alert('Значения не совпадают. Регистрация не может быть продолжена.');
                    document.getElementById('varificText').textContent = "";
                    
                    // modal.remove; // Закрываем окно
                }
            } catch (error) {
                console.error('Ошибка:', error);
                alert('Ошибка при регистрации');
                
            }
        }
        // Закрыть модальное окно
        // modal.style.display = "none";

    };

});



