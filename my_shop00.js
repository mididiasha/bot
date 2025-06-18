const { Bot, InlineKeyboard } = require('grammy');

// Замените 'YOUR_BOT_TOKEN' на токен Вашего бота
const bot = new Bot('8143064543:AAGOQ89NGj4cHSLNdg8JoT8ghqQP-EZTs9g');

let products = [
    { id: 1, name: 'Amd ryzen 3 1200', price: 3424, imageUrl: '/img/Amd.jpg' },
    { id: 2, name: 'Aardwolf performa 11x', price: 1595, imageUrl: '/img/kuller.jpg' },
    { id: 3, name: 'ASRock b450 pro4', price: 6185, imageUrl: '/img/plata.jpg' },
    { id: 4, name: 'Patriot PV48G240C5S', price: 2126, imageUrl: '/img/operativka.jpg' },
    { id: 5, name: 'MSI Radeon RX 560', price: 8443, imageUrl: '/img/viduha.jpg' },
    { id: 6, name: 'AeroCool V3X Advance', price: 1946, imageUrl: '/img/korpus.jpg' },
    { id: 7, name: 'Crown CM-PS650W PLUS', price: 1995, imageUrl: '/img/blok.jpg' },
    { id: 8, name: 'Toshiba HDWD120UZSVA', price: 4175, imageUrl: '/img/chectkiy.jpg' }
    
];

let usersCart = {};

// Команда "/start"
bot.command('start', (ctx) => {
    ctx.reply('Добро пожаловать в магазин! Используйте /products для просмотра товаров.Для просмотра корзины используйте /cart. Для очистки корзины используйте /clear');
});

// Команда для просмотра товаров
bot.command('products', (ctx) => {
    products.forEach(product => {
        const keyboard = new InlineKeyboard()
            .text(`Добавить в корзину`, `add_${product.id}`);

        ctx.replyWithPhoto(product.imageUrl, {
            caption: `${product.name} - ${product.price}₽`,
            reply_markup: keyboard,
        });
    });
});

// Обработка нажатий на кнопки
bot.callbackQuery(/add_(\d+)/, (ctx) => {
    const productId = parseInt(ctx.match[1]);
    const userId = ctx.from.id;

    if (!usersCart[userId]) {
        usersCart[userId] = [];
    }

    usersCart[userId].push(productId);
    ctx.answerCallbackQuery(`Товар "${products.find(product => product.id === productId).name}" добавлен в Вашу корзину.`);
});

// Команда для просмотра корзины
bot.command('cart', (ctx) => {
    const userId = ctx.from.id;

    if (!usersCart[userId] || usersCart[userId].length === 0) {
        return ctx.reply('Ваша корзина пуста.');
    }

    const cartItems = usersCart[userId].map(id => products.find(product => product.id === id).name).join(', ');
    const totalPrice = usersCart[userId].reduce((total, id) => total + products.find(product => product.id === id).price, 0);
    ctx.reply(`Ваша корзина: ${cartItems}\nОбщая стоимость: ${totalPrice}₽`);
});

// Команда для очистки корзины
bot.command('clear', (ctx) => {
    const userId = ctx.from.id;
    usersCart[userId] = [];
    ctx.reply('Ваша корзина очищена.');
});

// Запуск бота
bot.start();