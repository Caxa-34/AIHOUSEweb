const createModal = () => {
    const modal = document.createElement('div');
    modal.id = 'modal';
    modal.className = 'modalSub';
    modal.style.display = 'none';

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

    const closeBtn = document.createElement('span');
    closeBtn.className = 'close-btn';
    closeBtn.innerHTML = '&times;';

    const title = document.createElement('h2');
    title.textContent = 'Подписки';

    const subscriptionsList = document.createElement('div');
    subscriptionsList.id = 'subscriptionsList';

    modalContent.appendChild(closeBtn);
    modalContent.appendChild(title);
    modalContent.appendChild(subscriptionsList);
    modal.appendChild(modalContent);

    document.body.appendChild(modal);

    return { modal, closeBtn, subscriptionsList };
};

// Функция для открытия модального окна
const openModal = () => {
    modal.style.display = 'block';
    fetchSubscriptions();
};

// Функция для закрытия модального окна
const closeModal = () => {
    modal.style.display = 'none';
    subscriptionsList.innerHTML = '';
};

// Функция для выполнения API запроса и получения списка подписок
const fetchSubscriptions = async () => {
    const userId = localStorage.getItem('id'); // Получение ID авторизованного пользователя из localStorage
    console.log(`Fetching publications for userId: ${userId}`);

    const formData = {
        idUser: userId
    };
    try {
        const response = await fetch('http://94.228.126.25:3210/api/users/subscribtions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const data = await response.json();
        console.log('подписки ', data);

        if (data.users == 0) {
            subscriptionsList.textContent = "вы еще ни на кого не подписались";
        }

        data.users.forEach(subscription => {
            const baseUrl = 'http://94.228.126.25:81';
            const authorImagePath = `${baseUrl}/${subscription.imagePath}`;

            const isSubscribed = subscription.isSetSubscribe;

            const SubscrybeImageSrc = subscription.isSetSubscribe ? 'img/unsubscribe.svg' : 'img/subscribe.svg';

           

            const subscriptionItem = `
                <div class="subscription-item">
                    <img class="userSubImg" src="${authorImagePath}">
                    <div class="info">
                        <h4>${subscription.name}</h4>

                        <div class="idSub">
                            <p>id: </p>
                            <p>${subscription.id}</p>
                        </div>

                    </div>
                    <button type="button" class="addSubscribe" id="addSubscribe" data-subUser-id="${subscription.id}" data-subscribed="${isSubscribed}"><img src="${SubscrybeImageSrc}"></button> 
                </div>
            `;
            subscriptionsList.insertAdjacentHTML('beforeend', subscriptionItem);
        });


        // Обработчик для подписок
        document.querySelectorAll('.addSubscribe').forEach(button => {
            button.addEventListener('click', async function () {

                const idAuthor = this.getAttribute('data-subUser-id');
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



                    // Обновляем состояние подписки
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
    }

    catch (error) {
        console.error('Error fetching subscriptions:', error);
    }
};

// Создаем модальное окно и получаем его элементы
const { modal, closeBtn, subscriptionsList } = createModal();

const openModalBtn = document.getElementById('mySubscribe');

// Добавляем обработчики событий
openModalBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeModal();
    }
});