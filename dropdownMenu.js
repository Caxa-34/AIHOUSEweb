function formatDate(dateString) {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed, so add 1
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}.${month}.${day} ${hours}:${minutes}`;
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

    //создание возможности показа всплавающего уведомления
    const copyIcon = document.getElementById("copyIcon");
    const userTextElement = document.getElementById("useridIndrop");


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

    if (copyIcon && userTextElement) {
        copyIcon.addEventListener("click", () => {
            const textToCopy = userTextElement.innerText;
            navigator.clipboard.writeText(textToCopy).then(() => {
                showNotification('Текст скопирован!'); // Показать уведомление
            }).catch(err => {
                console.error('Не удалось скопировать текст: ', err);
                showNotification('Ошибка копирования'); // Показать уведомление об ошибке
            });
        });
    }

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
                notifCount.textContent = notifications.length;
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
                        
                    <p id="textTitle" class="titleNotification">${notificatoin.title} ${notificatoin.id}</p>
                    <p id="textPost" class="textNotification" >${notificatoin.text}</p>
                    <p class="dateCreateNotif">${formattedDate}</p>
                    <p class= statusNotif>${status}</p>
                    
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

});

