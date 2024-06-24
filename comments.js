document.addEventListener('DOMContentLoaded', async function () {
    const publicationId = localStorage.getItem('publicId'); // Получение ID публикации из localStorage
    console.log(`Fetching full publication for publicationId: ${publicationId}`);

    const userId = localStorage.getItem('id');
    console.log(`User id: ${userId}`);

    
    try {
        const formData = {
            idPublication: publicationId,
            idUser: localStorage.getItem('id')
        };
        const response = await fetch('http://94.228.126.25:3210/api/comments/get', {
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

        const data = await response.json();
        const comments = data.comments;
        console.log("Комментарии: ", comments);

        comments.sort((a, b) => {
            return new Date(b.dateCreate) - new Date(a.dateCreate);
        });

        console.log(comments.length);
        const commentsContainer = document.getElementById('comments');

        commentsContainer.innerHTML = '';

        document.getElementById('commCount').textContent = comments.length;

        comments.forEach(element => {
            const baseUrl = 'http://94.228.126.25:81';
            const authorImagePath = `${baseUrl}/${element.author.imagePath}`;
            console.log(authorImagePath);

            const formattedDate = formatDate(element.dateCreate);

            const commTemplate = `
            <div class=comments>
                <div class=headsComm>
                    <img class="comUserImege" src="${authorImagePath}">
                    <div class="headerPub">
                        <p class="authorNameComm">${element.author.name}</p>
                        <p class="dateAddCom">${formattedDate}</p>
                    </div>
                </div>
                <p class="commText">${element.text}</p>

            </div>
                `;

            // Добавляем шаблон публикации в контейнер
            commentsContainer.insertAdjacentHTML('beforeend', commTemplate);
        });

    } catch (error) {
        console.error('Error fetching full publication:', error);
        alert("Кажется возникла ошибка при загрузке комментариев.");
    }


document.getElementById('sendComm').addEventListener('click', async function (event) {
    event.preventDefault();

    const publicationId = localStorage.getItem('publicId'); // Получение ID публикации из localStorage
    console.log(`Fetching full publication for publicationId: ${publicationId}`);

    const userId = localStorage.getItem('id');
    console.log(`User id: ${userId}`);

    text = document.getElementById('EnterComm').value;
    console.log(`comm text: ${text}`);
    try {
        const formData = {
            idPublication: publicationId,
            idUser: localStorage.getItem('id'),
            text: text
        };

        const response = await fetch('http://94.228.126.25:3210/api/comments/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        console.log(`Response status: ${response.status}`);
          // Проверяем статус ответа
          if (!response.ok) {
            const errorText = await response.text();

            console.error('Ошибка:', response.status, errorText);

            alert('Кажется при отправке комментария возникла ошибка: ' + response.status + ' ' + errorText);
            return;
        }

        const data = await response.json();
        console.log('Ответ от сервера:', data); // Выводим ответ в консоль

       location.reload();


    } catch (error) {
        console.error('Error fetching full publication:', error);
        alert("Кажется возникла ошибка при отправке комментариев.");
    }


});

});