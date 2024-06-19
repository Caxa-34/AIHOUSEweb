document.addEventListener('DOMContentLoaded', async function () {

    const formData = {
        idUser: localStorage.getItem('id')
    };

    try {
        const response = await fetch('http://94.228.126.25:3210/api/users/settings/get', {
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

            alert('Кажется при отображении настроек возникла ошибка: ' + response.status + ' ' + errorText);
            return;
        }

        const data = await response.json();
        console.log('Ответ от сервера:', data); // Выводим ответ в консоль

        //передаем ответ на страницу

        const aboutUser = document.getElementById('textAbout');
        aboutUser.textContent = data.userSettings.aboutMe;
        console.log(aboutUser);


        // Устанавливаем значение для select элемента
        const genderSelect = document.querySelector('select');
        if (genderSelect) {
            // Предполагаем, что данные содержат поле 'gender' с возможными значениями 'man' или 'woman'
            genderSelect.value = data.userSettings.idGender; // Используйте значение из вашего ответа API
            console.log(data.userSettings.idGender);
        }

        const dateOfBirdth = document.getElementById('datePicker');
        if (dateOfBirdth) {
            // Предполагаем, что данные содержат поле 'birthday' в формате "YYYY-MM-DD HH:MM:SS"
            const birthday = data.userSettings.birthday;
            if (birthday) {
                // Обрезаем время и оставляем только дату "YYYY-MM-DD"
                const dateOnly = birthday.split(' ')[0];
                dateOfBirdth.value = dateOnly;
            }
        }


        //те уведомления
        const techNotif = document.getElementById('techNotif');

        if (techNotif) {
            // Предполагаем, что данные содержат поле 'bnotifTechnical' с boolean значением
            techNotif.checked = data.userSettings.notifTechnical;
        }

        //упоминания
        const refNotif = document.getElementById('refNotif');
        if (refNotif) {
            // Предполагаем, что данные содержат поле 'bnotifTechnical' с boolean значением
            refNotif.checked = data.userSettings.notifReference;
        }

        //ответы
        const respNotif = document.getElementById('respNotif');
        if (respNotif) {
            // Предполагаем, что данные содержат поле 'bnotifTechnical' с boolean значением
            respNotif.checked = data.userSettings.notifResponse;
        }

        //подписки
        const subNotif = document.getElementById('subNotif');
        if (subNotif) {
            // Предполагаем, что данные содержат поле 'bnotifTechnical' с boolean значением
            subNotif.checked = data.userSettings.notifSubscribe;
        }

        //лайки
        const likeNotif = document.getElementById('likeNotif');
        if (likeNotif) {
            // Предполагаем, что данные содержат поле 'bnotifTechnical' с boolean значением
            likeNotif.checked = data.userSettings.notifLike;
        }

        //комментарии
        const comNotif = document.getElementById('comNotif');
        if (comNotif) {
            // Предполагаем, что данные содержат поле 'bnotifTechnical' с boolean значением
            comNotif.checked = data.userSettings.notifComment;
        }

        //приватность
        const privacyToggle = document.getElementById('privacyToggle');
        if (privacyToggle) {
            // Предполагаем, что данные содержат поле 'bnotifTechnical' с boolean значением
            privacyToggle.checked = data.userSettings.privateShowSubscriber;
        }
    }
    catch {
        console.error('Ошибка:', error);
        alert('Кажется при отображении настроек возникла ошибка');
    }

});

document.getElementById('btnSaveSettings').addEventListener('click', async function (event) {
    event.preventDefault(); // Предотвращаем отправку формы

    const showNotification = (message) => {

        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;

        document.body.appendChild(notification);
        // Показ уведомления
        notification.style.display = 'block';

        setTimeout(() => {
            notification.style.display = 'none';
            document.body.removeChild(notification);
        }, 2000);
    };


    const aboutUser = document.getElementById('textAbout').value;
    
    const techNotif = document.getElementById('techNotif').checked;
    const refNotif = document.getElementById('refNotif').checked;
    const respNotif = document.getElementById('respNotif').checked;
    const subNotif = document.getElementById('subNotif').checked;
    const likeNotif = document.getElementById('likeNotif').checked;
    const comNotif = document.getElementById('comNotif').checked;
    const privacyToggle = document.getElementById('privacyToggle').checked;
    
    const genderSelect = document.querySelector('select');
    let selectedValue = genderSelect.value;
    
    // Проверка и преобразование значения "null" в null
    if (selectedValue === "" || selectedValue === "null") {
        selectedValue = null;
    }
    
    const dateOfBirdth = document.getElementById('datePicker');
    let selectedDate = dateOfBirdth.value;
    
    // Проверка и преобразование значения "null" в null
    if (selectedDate === "" || selectedDate === "null") {
        selectedDate = null;
    }

    console.log("проверка вывода " + genderSelect);
    console.log("проверка вывода " + dateOfBirdth);
    console.log("проверка вывода " + aboutUser);
    console.log("проверка вывода " + comNotif);
   

    const formData = {
        idUser: localStorage.getItem('id'),
        idGender: selectedValue,
        birthday: selectedDate,
        aboutMe: aboutUser,
        notifTechnical: techNotif,
        notifResponse: respNotif,
        notifReference: refNotif,
        notifSubscribe: subNotif,
        notifLike: likeNotif,
        notifComment: comNotif,
        privateShowSubscriber: privacyToggle,
        mobileGetPush: true
    };



    try {

        const response = await fetch('http://94.228.126.25:3210/api/users/settings/set', {
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

            alert('Кажется при отображении настроек возникла ошибка: ' + response.status + ' ' + errorText);
            return;
        }

        const data = await response.json();
        console.log('Ответ от сервера:', data); // Выводим ответ в консоль
        showNotification("Настройки успешно сохранены");
    }
    catch {
        console.error('Ошибка:', error);
        alert('Кажется при сохранении изменений возникла ошибка');
    }
});

