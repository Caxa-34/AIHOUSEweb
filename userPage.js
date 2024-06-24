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
    const publicAuthorId = localStorage.getItem('publicAuthorId');
    console.log(`Fetching publications for userId: ${userId}`);

    const formData = {
        idUser: userId,
        idAuthor: publicAuthorId
    };

    console.log('хранилище   ' + localStorage.id);
    try {
        // Получение публикаций, исключая те, что принадлежат текущему пользователю
        const response = await fetch('http://94.228.126.25:3210/api/users/getfull', {
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
        const data = responsePub.publications;

        console.log('Publications fetched:', responsePub);

        data.sort((a, b) => {
            return new Date(b.dateCreate) - new Date(a.dateCreate);
        });
        console.log('Publications fetched:', data);

        const baseUrl = 'http://94.228.126.25:81';
        const authorImagePath = `${baseUrl}/${responsePub.userData.imagePath}`;
        console.log(authorImagePath);

        const idUser = document.getElementById('userid');
        console.log('id пользователя', idUser);
        idUser.textContent = responsePub.userData.id;

        document.getElementById('userAvatar').src = authorImagePath;
        document.getElementById('name').textContent = responsePub.userData.name;

        const age = document.getElementById('userAge');
        age.textContent = responsePub.userData.age;
        if (responsePub.userData.age == null) {
            age.textContent = "не указан";
        }
        else {
            age.textContent = responsePub.userData.age;
        }

        document.getElementById('userGender').textContent = responsePub.userData.gender;
        document.getElementById('authorText').value = responsePub.userData.aboutMe;
        console.log('текст пользователя', document.getElementById('authorText'));



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

       


        const publicationContainer = document.getElementById('myPubContent');
        publicationContainer.innerHTML = '';
        data.forEach(userData => {
            let text = userData.text;
            // Обрезаем текст до 210 символов, если он длиннее
            let truncatedText = '';
            let wordsCount = text.split(/\s+/);
            if (wordsCount.length > 30) {
                truncatedText = text.split(/\s+/).slice(0, 30).join(' ') + '...';
            }
            else {
                truncatedText = text.split(/\s+/).slice(0, 30).join(' ');
            }

            const formattedDate = formatDate(userData.dateCreate);

            // Создаем шаблон для каждой публикации
            const publicationTemplate = `
             <div class="pub">
                
                <p id="textTitle" class="titleElement" data-title="${userData.title}">${userData.title}</p>
                <p class="dateAdd">${formattedDate}</p>
                <p id="textPost" class="textElement" data-text="${userData.text}">${truncatedText}</p>
                <p class="readMore" data-publication-id="${userData.id}">Читать далее...</p>
            </div>
         `;

            // Добавляем шаблон публикации в контейнер
            publicationContainer.insertAdjacentHTML('beforeend', publicationTemplate);


        });


        const publicationElements = document.querySelectorAll('.readMore');

        publicationElements.forEach(element => {
            element.addEventListener('click', function () {
                const publicationIdforRead = this.getAttribute('data-publication-id');
                const publicationTitleforRead = this.getAttribute('data-title');
                const publicationTextforRead = this.getAttribute('data-text');

                localStorage.setItem('publicId', publicationIdforRead); // Сохранение ID публикации
                localStorage.setItem('publicTitle', publicationTitleforRead);
                localStorage.setItem('publicText', publicationTextforRead);
                console.log("id в хранилище " + localStorage.getItem('publicId'));


                window.location.href = 'fullPublication.html';

            });
        });



         // Инициализация clipboard.js
         const clipboard = new ClipboardJS('#copy-button');

         // Успешное копирование
         clipboard.on('success', function(e) {
             showNotification('ID скопирован в буфер обмена: ' + e.text);
             e.clearSelection(); // Деселектировать текст
         });
 
         // Ошибка при копировании
         clipboard.on('error', function(e) {
             showNotification('Ошибка при копировании: ' + e.action);
         });
 

    } catch (error) {
        console.error('Error fetching publications:', error);
        alert("Кажется возникла ошибка");
    }



});


