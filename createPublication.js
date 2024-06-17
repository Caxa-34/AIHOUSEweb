document.addEventListener("DOMContentLoaded", () => {
    // Получаем данные черновика из localStorage
    const draftTitle = localStorage.getItem('draftTitle');
    const draftText = localStorage.getItem('draftText');

    if (draftTitle && draftText) {
        document.getElementById('title').value = draftTitle;
        document.getElementById('text').value = draftText;
    } else {
        console.log('Данные черновика не найдены в localStorage');
    }
});


document.getElementById('publicate').addEventListener('click', async function (event) {
    event.preventDefault(); // Предотвращаем отправку формы


    // Собираем данные формы
    const formData = {
        title: document.getElementById('title').value,
        text: document.getElementById('text').value,
        idUser: localStorage.getItem('id'),
        idDraft: localStorage.getItem('draftId')
    };
    console.log(formData);

    // Отправляем данные на сервер с помощью fetch
    try {

        // Проверяем, заполнены ли все поля
        if (title.value === "" || text.value === "") {
            // Если одно из полей пустое, предотвращаем отправку формы
            event.preventDefault();
            // Отображаем сообщение б ошибке
            errorMessage.style.display = 'block';
            alert("Упс... кажется вы заполнили не все поля");
        }

        // Отправляем данные на сервер с помощью fetch
        const response = await fetch('http://94.228.126.25:3210/api/publications/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        localStorage.removeItem('draftId');
        localStorage.removeItem('draftTitle');
        localStorage.removeItem('draftText');

        // Проверяем статус ответа
        if (!response.ok) {
            const errorText = await response.text();

            console.error('Ошибка:', response.status, errorText);

            alert('Кажется ри создании публикации возникла ошибка: ' + response.status + ' ' + errorText);
            return;
        }

        const data = await response.json();
        console.log('Ответ от сервера:', data); // Выводим ответ в консоль
        alert('Ура! Публикация успешно создана!');

        location.reload();


    } catch (error) {
        console.error('Ошибка:', error);
        alert('Кажется ри создании публикации возникла ошибка');
    }

});


//сохранение черновиков

document.getElementById('saveAsDraft').addEventListener('click', async function (event) {
    event.preventDefault();
    // Отправляем данные на сервер с помощью fetch
    if(!localStorage.getItem('draftId'))
        {
    try {
        // Собираем данные формы
        const formData = {
            title: document.getElementById('title').value,
            text: document.getElementById('text').value,
            idUser: localStorage.getItem('id')
        };
        console.log(formData);
        // Проверяем, заполнены ли все поля
        if (title.value === "" || text.value === "") {
            // Если одно из полей пустое, предотвращаем отправку формы
            event.preventDefault();
            // Отображаем сообщение б ошибке
            errorMessage.style.display = 'block';
            alert("Упс... кажется вы заполнили не все поля");
        }
        // Отправляем данные на сервер с помощью fetch
        const response = await fetch('http://94.228.126.25:3210/api/publications/drafts/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });



        localStorage.removeItem('draftId');
        localStorage.removeItem('draftTitle');
        localStorage.removeItem('draftText');

        // Проверяем статус ответа
        if (!response.ok) {
            const errorText = await response.text();

            console.error('Ошибка:', response.status, errorText);

            alert('Кажется при создании черновика возникла ошибка: ' + response.status + ' ' + errorText);
            return;
        }

        const data = await response.json();
        console.log('Ответ от сервера:', data); // Выводим ответ в консоль

        alert('Ура! Черновик успешно сохранен!');

        location.reload();


    } catch (error) {
        console.error('Ошибка:', error);
        alert('Кажется при создании черновика возникла ошибка');
    }
        }
        else{
            try {
                // Собираем данные формы
                const formData = {
                    title: document.getElementById('title').value,
                    text: document.getElementById('text').value,
                    id: localStorage.getItem('draftId')
                };
                console.log(formData);
                // Проверяем, заполнены ли все поля
                if (title.value === "" || text.value === "") {
                    // Если одно из полей пустое, предотвращаем отправку формы
                    event.preventDefault();
                    // Отображаем сообщение б ошибке
                    errorMessage.style.display = 'block';
                    alert("Упс... кажется вы заполнили не все поля");
                }
                // Отправляем данные на сервер с помощью fetch
                const response = await fetch('http://94.228.126.25:3210/api/publications/drafts/update', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
        
                localStorage.removeItem('draftId');
                localStorage.removeItem('draftTitle');
                localStorage.removeItem('draftText');
        
                // Проверяем статус ответа
                if (!response.ok) {
                    const errorText = await response.text();
        
                    console.error('Ошибка:', response.status, errorText);
        
                    alert('Кажется при создании черновика возникла ошибка: ' + response.status + ' ' + errorText);
                    return;
                }
        
                const data = await response.json();
                console.log('Ответ от сервера:', data); // Выводим ответ в консоль
        
                alert('Ура! Черновик успешно сохранен!');
        
                location.reload();
        
        
            } catch (error) {
                console.error('Ошибка:', error);
                alert('Кажется при создании черновика возникла ошибка');
            }
        }
});
