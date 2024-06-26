function convertNewlinesToBreaks(text) {
    return text.replace(/(?:\r\n|\r|\n)/g, '<br>');
}

// Функция для экранирования специальных HTML символов
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function (m) { return map[m]; });
}

// Объединяем обе функции
function formatTextForHtml(text) {
    let escapedText = escapeHtml(text);
    return convertNewlinesToBreaks(escapedText);
}

function showNotification(message) {

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

function formatDate(dateString) {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed, so add 1
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}.${month}.${day} ${hours}:${minutes}`;
}

let publication;

document.addEventListener('DOMContentLoaded', async function () {

    const publicationId = localStorage.getItem('publicId'); // Получение ID публикации из localStorage
    console.log(`Fetching full publication for publicationId: ${publicationId}`);

    const formData = {
        id: publicationId,
        idUser: localStorage.getItem('id')
    };

    try {
        const response = await fetch('http://94.228.126.25:3210/api/publications/get', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        console.log(`Response status: ${response.status}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch publication: ${response.statusText}`);
        }


        const res = await response.json();
        publication = res.publication;
        // Обновляем содержимое страницы
        console.log("публикация", publication);

        //проверка жалоб
        if (publication.isSetComplaint) {
            document.getElementById('complaints').textContent = "Жалоба отправлена";
            document.getElementById('selectComplaints').style.display = 'none';
        }

        const idus = localStorage.getItem('id');
        if(publication.author.id == idus)
            {
                document.getElementById('complaintsPole').style.display = 'none';
            }

        const likeImageSrc = publication.isSetLike ? 'img/unlike.svg' : 'img/like.svg';
        const likeButtonImg = document.getElementById('likeBtn');
        // Устанавливаем новый src для изображения
        likeButtonImg.src = likeImageSrc;

        const subBtn = document.getElementById('subscribeImg');
        const SubscrybeImageSrc = publication.isSetSubscribe ? 'img/unsubscribe.svg' : 'img/subscribe.svg';

        subBtn.src = SubscrybeImageSrc

        console.log("значение лайка ", publication.isSetLike, " ", likeImageSrc);

        document.getElementById('authorName').textContent = publication.author.name;
        document.getElementById('dateAdd').textContent = new Date(publication.dateCreate).toLocaleDateString();
        document.getElementById('titleText').textContent = publication.title;

        const pubText = document.getElementById('mainText');
        pubText.innerHTML = formatTextForHtml(publication.text);
        document.getElementById('countLikes').textContent = publication.countLikes; // Количество лайков

        document.getElementById('complCount').textContent = publication.countComplaints; // Количество жалоб

        const baseUrl = 'http://94.228.126.25:81';
        const authorImagePath = `${baseUrl}/${publication.author.imagePath}`;
        document.getElementById('pubImege').src = authorImagePath;

        const authorname = document.getElementById('authorName');
        console.log(authorname);

        //переход на страницу пользователя
        const AutorInfo = document.getElementById('authorName');

        AutorInfo.addEventListener('click', function () {
            const publicationAuthorId = publication.author.id;

            localStorage.setItem('publicAuthorId', publicationAuthorId); // Сохранение ID автора публикации

            console.log("id автора в хранилище ", publicationAuthorId);

            window.location.href = 'userPage.html';
        });

        //установка лайка
        // Обработчик для лайков
        document.getElementById('likked').addEventListener('click', async function () {

            const publicationId = publication.id;
            let isLiked = publication.isSetLike;
            const type = isLiked ? 'remove' : 'set';

            console.log("ID публикации:", publicationId);
            console.log("Текущее состояние лайка:", isLiked);
            console.log("Тип действия:", type);


            try {
                const likeResponse = await fetch('http://94.228.126.25:3210/api/publications/like', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        idUser: localStorage.getItem('id'),
                        idPublication: publicationId,
                        type: type
                    })
                });

                if (!likeResponse.ok) {
                    throw new Error(`Network response was not ok: ${likeResponse.statusText}`);
                }

                // Обновляем состояние isLiked после успешного запроса
                isLiked = !isLiked; // Инвертируем текущее состояние

                // Обновляем publication.isSetLike, если это нужно для вашей логики
                publication.isSetLike = !isLiked;

                // Обновляем иконку кнопки лайка
                document.getElementById('likeBtn').src = publication.isSetLike ? 'img/unlike.svg' : 'img/like.svg';

                // Если есть элемент для отображения количества лайков, обновляем его
                if (document.getElementById('likeCount')) {
                    // Здесь предполагается, что в publication.likesCount содержится текущее количество лайков
                    document.getElementById('likeCount').textContent = publication.countLikes;
                }

                location.reload();

            } catch (error) {
                console.error('Error updating like status:', error);
                showNotification("Ошибка при обновлении статуса лайка");
            }

        });

        //установка подписки
        // Обработчик для подписок
        document.getElementById('subscribe').addEventListener('click', async function () {

            const idAuthor = publication.author.id;
            let isSubscr = publication.isSetSubscribe;
            const type = isSubscr ? 'unsubscribe' : 'subscribe';


            console.log(idAuthor);
            console.log("проверка установки подписки  " + isSubscr);
            console.log("type  " + type);

            try {
                const likeResponse = await fetch('http://94.228.126.25:3210/api/users/subscribe', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        idUser: localStorage.getItem('id'),
                        idAuthor: idAuthor,
                        type: type
                    })
                });

                if (!likeResponse.ok) {
                    throw new Error(`Network response was not ok: ${likeResponse.statusText}`);
                }



                // Обновляем состояние подписки
                const newSubscribedState = !isSubscr;
                this.setAttribute('data-subscribed', newSubscribedState.toString());
                const subImg = this.querySelector('img');
                subImg.src = newSubscribedState ? 'img/unsubscribe.svg' : 'img/subscribe.svg';




                // Обновляем состояние isLiked после успешного запроса
                //isLiked = !isLiked; // Инвертируем текущее состояние

                // Обновляем publication.isSetLike, если это нужно для вашей логики
                publication.isSetSubscribe = !isSubscr;

                // Обновляем иконку кнопки лайка
                document.getElementById('subscribeImg').src = publication.isSetSubscribe ? 'unsubscribe' : 'subscribe';


                location.reload();

            } catch (error) {
                console.error('Error updating subscribe status:', error);
                showNotification("Подписка не возможна");
            }
        });




    } catch (error) {
        console.error('Error fetching full publication:', error);
        alert("Кажется возникла ошибка при загрузке полной публикации.");
    }


    //жалобы

    document.getElementById('complaints').addEventListener('click', async function (event) {
        event.preventDefault();

        if (publication.isSetComplaint) {
            showNotification("Вы уже отправляли жалобу на эту публикацию");
            return;
        }

        const idViolation = document.getElementById('selectComplaints').value;
        console.log(idViolation);

        const idUser = localStorage.getItem('id');
        console.log(idUser);

        const idPublication = localStorage.getItem('publicId');
        console.log(idPublication);

        const formData = {
            idUser: idUser,
            idPublication: idPublication,
            idViolation: idViolation
        }

        try {
            const response = await fetch('http://94.228.126.25:3210/api/complaints/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            console.log(`Response status: ${response.status}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch publication: ${response.statusText}`);
            }


            const res = await response.json();
            console.log("результат", res);


            showNotification("Жалоба отправлена");


            location.reload();



        } catch {
            // console.error('Error fetching full publication:', error);
            showNotification("Кажется возникла ошибка при отправке жалобы.");
        }

    });


});