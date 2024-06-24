function formatDate(dateString) {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed, so add 1
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}.${month}.${day} ${hours}:${minutes}`;
}

// сделать приветственное сообщение при авторизации

// Функция для показа уведомления
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

document.addEventListener('DOMContentLoaded', async function () {
    //проверка авторизации и показ соответствующего функционала
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    console.log(isLoggedIn, "true?");

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




    const userId = localStorage.getItem('id'); // Получение ID авторизованного пользователя из localStorage
    console.log(`Fetching publications for userId: ${userId}`);

    const formData = {
        idUser: userId
    };

    console.log('хранилище   ' + localStorage.id);
    try {
        // Получение публикаций, исключая те, что принадлежат текущему пользователю
        const response = await fetch('http://94.228.126.25:3210/api/publications/getNotByAuthor', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        console.log(`Response status: ${response.status}`);

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const responsePub = await response.json();
        let publications = responsePub.publications;

        publications.sort((a, b) => {
            return new Date(b.dateCreate) - new Date(a.dateCreate);
        });

        console.log('Publications fetched:', publications);

        const publicationContainer = document.getElementById('containerPublication');
        publicationContainer.innerHTML = '';

        function renderPublications(publications) {
            publicationContainer.innerHTML = '';

            if (publications.length === 0) {
                showNotification('Совпадений не найдено'); // Если публикаций нет
                return;
            }

            publications.forEach(publication => {
                let text = publication.text;
                // Обрезаем текст до 210 символов, если он длиннее
                let truncatedText = '';
                let wordsCount = text.split(/\s+/);
                if (wordsCount.length > 30) {
                    truncatedText = text.split(/\s+/).slice(0, 30).join(' ') + '...';
                }
                else {
                    truncatedText = text.split(/\s+/).slice(0, 30).join(' ');
                }

                const formattedDate = formatDate(publication.dateCreate);

                //Проверка, был ли лайк установлен
                const isLiked = publication.isSetLike;
 
                //Проверка, была ли подписка
                const isSubscribed = publication.isSetSubscribe;

                // Выбираем картинку для лайка в зависимости от состояния
                const likeImageSrc = publication.isSetLike ? 'img/unlike.svg' : 'img/like.svg';
                const SubscrybeImageSrc = publication.isSetSubscribe ? 'img/unsubscribe.svg' : 'img/subscribe.svg';
                const readImageSrc = publication.isRead ? 'img/read.svg' : 'img/unread.svg';



                const baseUrl = 'http://94.228.126.25:81';
                const authorImagePath = `${baseUrl}/${publication.author.imagePath}`;
                console.log(authorImagePath);


        

                // Создаем шаблон для каждой публикации
                const publicationTemplate = `
             <div class="pub">
                <div class=heads>
                    <img class="pubImege" src="${authorImagePath}">
                   <div class="headerPub">
                        <p class="authorName" data-author-id="${publication.author.id}">${publication.author.name}</p>
                        <p class="dateAdd">${formattedDate}</p>
                    </div>
                </div>
                <p id="textTitle" class="titleElement" data-title="${publication.title}">${publication.title}</p>
                <p id="textPost" class="textElement" data-text="${publication.text}">${truncatedText}</p>
                <p class="readMore" data-publication-id="${publication.id}"  data-liked="${isLiked}">Читать далее...</p>
                <div class="actionPanel">
                    <button id="likked" type="button" class="like" data-publication-id="${publication.id}" data-liked="${isLiked}"><img id="likeBtn" src="${likeImageSrc}"></button> 
                    <p class="countLikes">${publication.countLikes}</p>
                    <button type="button" class="addSubscribe" id="addSubscribe" data-author-id="${publication.author.id}" data-subscribed="${isSubscribed}"><img src="${SubscrybeImageSrc}"></button> 
                    <img src="${readImageSrc}" class="addSubscribe" id="readMarcer" data-publication-id="${publication.id}">
                </div>
            </div>
         `;

                         // Добавляем шаблон публикации в контейнер
                publicationContainer.insertAdjacentHTML('beforeend', publicationTemplate);


            });

            const AutorInfo = document.querySelectorAll('.authorName');

            AutorInfo.forEach(element => {
                element.addEventListener('click', function () {
                    const publicationAuthorId = this.getAttribute('data-author-id');

                    localStorage.setItem('publicAuthorId', publicationAuthorId); // Сохранение ID автора публикации

                    console.log("id автора в хранилище ", publicationAuthorId);

                    window.location.href = 'userPage.html';

                });
            });


            const publicationElements = document.querySelectorAll('.readMore');

            publicationElements.forEach(element => {
                element.addEventListener('click', function () {
                    const publicationIdforRead = this.getAttribute('data-publication-id');
                    const publicationTitleforRead = this.getAttribute('data-title');
                    const publicationTextforRead = this.getAttribute('data-title');

                    localStorage.setItem('publicId', publicationIdforRead); // Сохранение ID публикации
                    localStorage.setItem('publicTitle', publicationTitleforRead);
                    localStorage.setItem('publicText', publicationTextforRead);
                    console.log("id в хранилище " + localStorage.getItem('publicId'));

                    const isLike = this.getAttribute('data-liked')
                    localStorage.setItem('isLiked', isLike);
                    console.log(localStorage.getItem('isLiked'));

                    window.location.href = 'fullPublication.html';

                });
            });

        }

        renderPublications(publications);

        // Функция поиска публикаций по имени автора и заголовку


        const btnAll = document.getElementById('btnAll');
        const btnPub = document.getElementById('btnPub');
        const btnUs = document.getElementById('btnUs');


        const searchInput = document.getElementById('searchText');
        const filters = document.getElementById('searchText');
        const filter = document.getElementById('filters');

        filters.addEventListener('input', async function () {

            if (searchInput.value.trim().length > 0) {
                filter.style.display = 'block';

                btnAll.addEventListener('click', async function () {

                    const searchText = document.getElementById('searchText').value.trim().toLowerCase();
                    const filteredPublications = publications.filter(pub => {
                        return pub.title.toLowerCase().includes(searchText) || 
                        pub.text.toLowerCase().includes(searchText) || pub.author.name.toLowerCase().includes(searchText) 
                        || pub.author.id.toString().toLowerCase().includes(searchText);
                    });
                    renderPublications(filteredPublications);

                });

                btnPub.addEventListener('click', async function () {
                    
                    const searchText = document.getElementById('searchText').value.trim().toLowerCase();
                    const filteredPublications = publications.filter(pub => {
                        return pub.title.toLowerCase().includes(searchText) || 
                        pub.text.toLowerCase().includes(searchText);
                    });
                    renderPublications(filteredPublications);
                });

                btnUs.addEventListener('click', async function () {
                   
                    const searchText = document.getElementById('searchText').value.trim().toLowerCase();
                    const filteredPublications = publications.filter(pub => {
                        return pub.author.name.toLowerCase().includes(searchText) 
                        || pub.author.id.toString().toLowerCase().includes(searchText);
                    });
                    renderPublications(filteredPublications);
                  
                });

            }
            else {
                filter.style.display = 'none';
                renderPublications(publications);
            }
        });

        // Добавление обработчика события на кнопку поиска
        //  document.getElementById('searchText').addEventListener('input', searchScorePublication);



        //установка лайка
        // Обработчик для лайков
        document.querySelectorAll('.like').forEach(button => {
            button.addEventListener('click', async function () {
                const publicationId = this.getAttribute('data-publication-id');
                const isLiked = this.getAttribute('data-liked') === 'true';
                const type = isLiked ? 'remove' : 'set';

                console.log(publicationId);
                console.log("проверка установки лайка  " + isLiked);
                console.log("type  " + type);

                try {
                    const likeResponse = await fetch('http://94.228.126.25:3210/api/publications/like', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            idUser: userId,
                            idPublication: publicationId,
                            type: type
                        })
                    });

                    if (!likeResponse.ok) {
                        throw new Error(`Network response was not ok: ${likeResponse.statusText}`);
                    }


                    // Обновляем состояние лайка
                    const newLikedState = !isLiked;
                    this.setAttribute('data-liked', newLikedState);

                    const likeImg = this.querySelector('img');
                    likeImg.src = newLikedState ? 'img/unlike.svg' : 'img/like.svg';


                    // Обновляем счетчик лайков
                    const countLikesElement = this.nextElementSibling;
                    const currentLikes = parseInt(countLikesElement.textContent, 10);
                    countLikesElement.textContent = newLikedState ? currentLikes + 1 : currentLikes - 1;



                } catch (error) {
                    console.error('Error updating like status:', error);
                    showNotification("Установка лайка не возможна");
                }
            });
        });


        //установка подписки
        // Обработчик для подписок
        document.querySelectorAll('.addSubscribe').forEach(button => {
            button.addEventListener('click', async function () {

                const idAuthor = this.getAttribute('data-author-id');
                const isSubscribed = this.getAttribute('data-subscribed') === 'true';
                const type = isSubscribed ? 'unsubscribe' : 'subscribe';

                console.log(idAuthor);
                console.log("проверка установки подписки  " + isSubscribed);
                console.log("type  " + type);

                try {
                    const likeResponse = await fetch('http://94.228.126.25:3210/api/users/subscribe', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            idUser: userId,
                            idAuthor: idAuthor,
                            type: type
                        })
                    });

                    if (!likeResponse.ok) {
                        throw new Error(`Network response was not ok: ${likeResponse.statusText}`);
                    }



                    // Обновляем состояние лайка
                    const newSubscribedState = !isSubscribed;
                    this.setAttribute('data-subscribed', newSubscribedState.toString());
                    const subImg = this.querySelector('img');
                    subImg.src = newSubscribedState ? 'img/unsubscribe.svg' : 'img/subscribe.svg';


                } catch (error) {
                    console.error('Error updating subscribe status:', error);
                    showNotification("Подписка не возможна");
                }
            });
        });

    } catch (error) {
        console.error('Error fetching publications:', error);
        alert("Кажется возникла ошибка");
    }



});


