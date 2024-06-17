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

document.addEventListener('DOMContentLoaded', async function () {
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
        const publications = responsePub.publications;

        publications.sort((a, b) => {
            return new Date(b.dateCreate) - new Date(a.dateCreate);
        });

        console.log('Publications fetched:', publications);



        const publicationContainer = document.getElementById('containerPublication');
        publicationContainer.innerHTML = '';

        // Загружаем лайки из localStorage
        const likedPublications = JSON.parse(localStorage.getItem('likedPublications')) || {};

        publications.forEach(publication => {
            let text = publication.text;
            // Обрезаем текст до 210 символов, если он длиннее
            let truncatedText = '';
            let wordsCount = text.split(/\s+/);
            if(wordsCount.length > 30)
                {
                    truncatedText = text.split(/\s+/).slice(0, 30).join(' ') + '...';
                }
            else{
                truncatedText = text.split(/\s+/).slice(0, 30).join(' ');
            }

            const formattedDate = formatDate(publication.dateCreate);
            
             //Проверка, был ли лайк установлен
            const isLiked = likedPublications[publication.id] === true;

            // Выбираем картинку для лайка в зависимости от состояния
            const likeImageSrc = isLiked ? 'img/unlike.svg' : 'img/like.svg';
 

            // Создаем шаблон для каждой публикации
            const publicationTemplate = `
             <div class="pub">
                <div class=heads>
                    <img class="pubImege" src="img/user_icon.png">
                   <div class="headerPub">
                        <p class="authorName">${publication.author.name}</p>
                        <p class="dateAdd">${formattedDate}</p>
                    </div>
                </div>
                <p id="textTitle" class="titleElement">${publication.title}</p>
                <p id="textPost" class="textElement" >${truncatedText}</p>
                <p class="readMore" data-publication-id="${publication.id}">Читать далее...</p>
                <div class="actionPanel">
                    <button id="likked" type="button" class="like" data-publication-id="${publication.id}" data-liked="${isLiked}"><img id="likeBtn" src="${likeImageSrc}"></button> 
                    <p class="countLikes">${publication.countLikes}</p>
                    <button type="button" class="addSubscribe" id="addSubscribe"><img src="img/subscribe.svg"></button> 
                </div>
            </div>
         `;

         // Добавляем шаблон публикации в контейнер
         publicationContainer.insertAdjacentHTML('beforeend', publicationTemplate);
        });
        


       const publicationElements = document.querySelectorAll('.readMore');
       publicationElements.forEach(element => {
           element.addEventListener('click', function() {
             const publicationIdforRead = this.getAttribute('data-publication-id');
                localStorage.setItem('publicId', publicationIdforRead); // Сохранение ID публикации
                console.log("id в хранилище " + localStorage.getItem('publicId'));
             window.location.href = 'fullPublication.html';
           });
        });
   

        //установка лайка
    // Обработчик для лайков
    document.querySelectorAll('.like').forEach(button => {
        button.addEventListener('click', async function () {
            const publicationId = this.getAttribute('data-publication-id');
            const isLiked = this.getAttribute('data-liked') === 'true';
            const type = isLiked ? 'remove' : 'set';

            console.log(publicationId);
            console.log("проверка установки лайка  " + isLiked);
            console.log("лайк из licalStorage  " + likedPublications);

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


            // const likeImg = this.querySelector('img');

              //  if (newLikedState) {
                //    likeImg.classList.add('liked');
                //} else {
                   // likeImg.classList.remove('liked');
                //}

                const likeImg = this.querySelector('img');
                likeImg.src = newLikedState ? 'img/unlike.svg' : 'img/like.svg';
    
                
                // Обновляем счетчик лайков
                const countLikesElement = this.nextElementSibling;
                const currentLikes = parseInt(countLikesElement.textContent, 10);
               countLikesElement.textContent = newLikedState ? currentLikes + 1 : currentLikes - 1;

                // Обновляем localStorage
                likedPublications[publicationId] = newLikedState;
                localStorage.setItem('likedPublications', JSON.stringify(likedPublications));

            } catch (error) {
                console.error('Error updating like status:', error);
                alert("Ошибка при обновлении статуса лайка");
            }
        });
    });

    } catch (error) {
        console.error('Error fetching publications:', error);
        alert("Кажется возникла ошибка");
    }
});


//функция для устанвки лайка