function formatDate(dateString) {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed, so add 1
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}.${month}.${day} ${hours}:${minutes}`;
}

function loadScript(url, callback) {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    // Обработчик события для завершения загрузки скрипта
    script.onload = function () {
        if (callback) {
            callback();
        }
    };

    // Обработка ошибок при загрузке скрипта
    script.onerror = function () {
        console.error('Ошибка загрузки скрипта: ' + url);
    };

    // Добавляем скрипт в тело документа
    document.body.appendChild(script);
}

document.addEventListener('DOMContentLoaded', async function () {


    const userIDdrop = localStorage.getItem('id');
    const userName = localStorage.getItem('userName');
    document.getElementById('useridIndrop').textContent = userIDdrop;
    document.getElementById('userName').textContent = userName;

    //вывод меню
    const dropdownIcon = document.getElementById("userImage");
    const dropdownIconMenu = document.getElementById("userImgMenu");
    const dropdownMenu = document.getElementById("dropdownContent");


    const userImg = localStorage.getItem('userImg');
    const baseUrl = 'http://94.228.126.25:81';

    const fullAuthorImagePath = `${baseUrl}/${userImg}`;
    console.log("вывод " + baseUrl + "    " + userImg);
    dropdownIcon.src = fullAuthorImagePath;
    dropdownIconMenu.src = fullAuthorImagePath;
    //console.log(dropdownIconMenu);


    if (dropdownIcon && dropdownMenu) { // Убедитесь, что элементы найдены
        document.addEventListener("click", (event) => {
            if (event.target == dropdownIcon) {
                dropdownMenu.style.display = 'block';
            }
        });

        // Закрываем выпадающий список при клике вне его области
        document.addEventListener("click", (event) => {
            if (!dropdownIcon.contains(event.target) && !dropdownMenu.contains(event.target)) {
                dropdownMenu.style.display = 'none';
            }
        });
    }
    //переход на страницу пользователя по клику на имя пользователя в меню
    const AutorInfo = document.getElementById('userName');

    AutorInfo.addEventListener('click', function () {
        const publicationAuthorId = localStorage.getItem('id');

        localStorage.setItem('publicAuthorId', publicationAuthorId); // Сохранение ID автора публикации

        console.log("id автора в хранилище ", publicationAuthorId);

        window.location.href = 'userPage.html';
    });


    // Создаем модальное окно
    var modal = document.createElement('div');
    modal.classList.add('modal');
    modal.id = 'myModal'; // Устанавливаем id для модального окна

    var modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');

    var closeButton = document.createElement('span');
    closeButton.classList.add('close');
    closeButton.innerHTML = '&times;'; // Кнопка закрытия

    var modalHeader = document.createElement('div');
    modalHeader.classList.add('modal-header');

    var modalTitle = document.createElement('h2');
    modalTitle.classList.add('modal-title');
    modalTitle.textContent = 'Правила';

    var modalBody = document.createElement('div');
    modalBody.classList.add('modal-body');

    var paragraph1 = document.createElement('p');
    paragraph1.textContent = '1. Избегайте оскорблений в чужой адрес. \n Здесь мы все друзья и мы не хотим никаких конфликтов и обид, так что давайте будем относиться к друг другу с пониманием и уважением';

    var paragraph2 = document.createElement('p');
    paragraph2.textContent = '2. Оставьте все политические и религиозные споры за дверью.\n ' +
        'Это научно - образовательная платформа и мы хотим что бы каждому здесь было комфортно. ' +
        'Мы понимаем что у каждого свое мировоззрение и  убеждения и не преследуем цели навязать вам иное, мы лишь хотим избежать неприятных конфликтов и споров';

    var paragraph3 = document.createElement('p');
    paragraph3.textContent = '3. Достоверный контент.\n  Пожалуйста публикуйте только проверенный контент, ' +
        'не пишите вымысел или недоставерную информацию. Не вводите в заблуждение других людей. А также придерживайтесь темитики данного форума.';

        var paragraph4 = document.createElement('p');
        paragraph4.textContent = '4. Тематика форума.\n  Любой контент, публикуемый на форуме, ' +
        'а также тематика обсуждений должна так или иначе относиться к теме искусственного интеллекта и нейросетей.';
    
     

    // Добавляем элементы в модальное окно
    modalHeader.appendChild(modalTitle);
    modalBody.appendChild(paragraph1);
    modalBody.appendChild(paragraph2);
    modalBody.appendChild(paragraph3);
    modalBody.appendChild(paragraph4);
    modalContent.appendChild(closeButton);
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modal.appendChild(modalContent);


    // Добавляем модальное окно в body
    document.body.appendChild(modal);

    // Находим кнопку для открытия модального окна
    var openModalButton = document.getElementById('modalWinRules');
    var modal = document.getElementById('myModal');

    // Открываем модальное окно при клике на кнопку
    openModalButton.onclick = function () {
        modal.style.display = 'block';
    };

    // Закрываем модальное окно при клике на крестик
    closeButton.onclick = async function () {
        modal.style.display = 'none';
    };

    // Закрываем модальное окно при клике вне его области
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };


    // Функция для показа уведомления
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


    loadScript('https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.10/clipboard.min.js', function () {
        // Инициализация clipboard.js
        const clipboard = new ClipboardJS('#copyIcon');

        // Успешное копирование
        clipboard.on('success', function (e) {
            showNotification('ID скопирован в буфер обмена: ' + e.text);
            e.clearSelection(); // Деселектировать текст
        });

        // Ошибка при копировании
        clipboard.on('error', function (e) {
            showNotification('Ошибка при копировании: ' + e.action);
        });
    });


    loadScript('https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.10/clipboard.min.js', function () {
        // Инициализация clipboard.js
        const clipboard = new ClipboardJS('#copyEmail');

        // Успешное копирование
        clipboard.on('success', function (e) {
            showNotification('ID скопирован в буфер обмена: ' + e.text);
            e.clearSelection(); // Деселектировать текст
        });

        // Ошибка при копировании
        clipboard.on('error', function (e) {
            showNotification('Ошибка при копировании: ' + e.action);
        });
    });

    //вывод окна уведомлений
    const dropdownIconNotif = document.getElementById("notifImg");
    const dropdownNotif = document.getElementById("dropdownContentNotifications");

    if (dropdownIconNotif && dropdownNotif) { // Убедитесь, что элементы найдены
        document.addEventListener("click", (event) => {
            if (event.target == dropdownIconNotif) {
                dropdownNotif.style.display = 'block';
            }

        });
        // Закрываем выпадающий список при клике вне его области
        document.addEventListener("click", (event) => {
            if (!dropdownIconNotif.contains(event.target) && !dropdownNotif.contains(event.target)) {
                dropdownNotif.style.display = 'none';
            }
        });
    }
    await loadNotifications();

    async function loadNotifications() {
        try {
            const formData = {
                idUser: userIDdrop
            };

            // Выполняем запрос к API для получения уведомлений
            const response = await fetch('http://94.228.126.25:3210/api/users/notifications/get', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Network response was not ok.');

            const notificate = await response.json();
            const notifications = notificate.notifications;
            console.log('Notif fetched:', notifications);

            notifications.sort((a, b) => {
                return new Date(b.dateCreate) - new Date(a.dateCreate);
            });

            const notifContainer = document.getElementById('notifContainer');
            notifContainer.innerHTML = '';

            const notifCount = document.getElementById('notifCount');
            const readntCount = notifications.filter(notification => !notification.wasRead).length;
            if (notifications == 0) {
                notifContainer.textContent = 'У вас пока что нет уведомлений';
                notifContainer.style.textAlign = 'center';
                notifContainer.style.fontSize = '1.5rem';
                notifContainer.style.fontFamily = 'Inter';
                notifContainer.style.fontWeight = '600';
                notifContainer.style.color = '#1B1967';
                notifContainer.style.marginTop = '10rem';
            }
            else {
                notifContainer.innerHTML = '';
                console.log(notifications.length);
                notifCount.textContent = readntCount;
            }


            notifications.forEach(notificatoin => {
                const formattedDate = formatDate(notificatoin.dateCreate);

                let status;
                if (notificatoin.wasRead == false) {
                    status = 'не прочитано';
                    borderColorClass = 'unread-border';
                }
                else {
                    status = 'прочитано'
                    borderColorClass = 'read-border';
                }

                // Создаем шаблон для каждой публикации
                const notificatoinTemplate = `
                 <div class="notification-container ${borderColorClass}" id="notification-container" data-id="${notificatoin.id}">
                        
                    <p id="textTitle" class="titleNotification">${notificatoin.title}</p>
                    <p id="textPost" class="textNotification" >${notificatoin.text}</p>
                    <p class="dateCreateNotif">${formattedDate}</p>
                        
                </div>
             `;
                // Добавляем шаблон публикации в контейнер
                notifContainer.insertAdjacentHTML('beforeend', notificatoinTemplate);
                
            });

            // Добавляем обработчик кликов для уведомлений
            document.querySelectorAll('.notification-container').forEach(notification => {
                notification.addEventListener('click', async (event) => {
                    const idNotification = event.currentTarget.dataset.id;

                    try {
                        const formData = {
                            idNotification: idNotification
                        };

                        // Выполняем запрос к API для получения уведомлений
                        const response = await fetch('http://94.228.126.25:3210/api/users/notifications/read', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(formData)
                        });

                        if (!response.ok) throw new Error('Network response was not ok.');

                        const readNotif = await response.json();
                        // const readnotifications = readNotif.readnotifications;

                        console.log("выполнен " + readNotif);

                        const notificationElement = document.querySelector(`.notification-container[data-id="${idNotification}"]`);
                        if (notificationElement) {

                            // Изменяем класс уведомления для изменения стиля
                            notificationElement.classList.remove('unread-border');
                            notificationElement.classList.add('read-border');
                        }

                    }
                    catch (error) {
                        console.error('Ошибка при обновлении статуса уведомления:', error);
                    }

                });
            });


        } catch (error) {
            console.error('Ошибка при загрузке уведомлений:', error);

        }
    }

    //адаптив
    document.getElementById('mobileMenuBtn').addEventListener('click', function () {
        var nav = document.getElementById('navigation');
        if (nav.classList.contains('show')) {
            nav.classList.remove('show');
        } else {
            nav.classList.add('show');
        }
    });



});



