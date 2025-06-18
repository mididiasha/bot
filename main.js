const { Bot } = require('grammy');

const bot = new Bot('8143064543:AAGOQ89NGj4cHSLNdg8JoT8ghqQP-EZTs9g');

// Хранилище для участников и их результатов
const participants = {};

// Вопросы викторины
const questions = [
    {
        question: "Что такое HTML?",
        options: ["Язык разметки", "Язык программирования", "Система управления базами данных"],
        answer: 0
    },
     {
        question: "Какой тег используется для создания заголовка первого уровня?",
        options: ["<h1>", "<header>", "<title>"],
        answer: 0
    },
     {
        question: " Как вставить изображение на страницу?",
        options: ["<src='image.jpg' alt='Описание'>", "<image src='image.jpg' alt='Описание'>", "<img src='image.jpg' alt='Описание'>"],
        answer: 2
    },
     {
        question: "Какой тег используется для создания гиперссылки?",
        options: ["<link>", "<a>", "<href>"],
        answer: 1
    },
     {
        question: "Что такое атрибут id в HTML?",
        options: ["Способ вставки скриптов", "Название класса элемента", "Уникальный идентификатор элемента на странице"],
        answer: 2
    },
    {
        question: "Что такое CSS?",
        options: ["Язык разметки", "Язык стилей", "Язык программирования"],
        answer: 1
    },
    {
        question: "Какой селектор используется для выбора элемента по его классу?",
        options: ["#classname", ".classname", "classname"],
        answer: 1
    },
    {
        question: "Что означает свойство 'display: none;'?",
        options: [" Элемент скрыт и не занимает места на странице", "Элемент скрыт, но занимает место на странице", "Элемент отображается как блок"],
        answer: 0
    },
    {
        question: "Как задать внутренние отступы для элемента?",
        options: ["margin", "border", "padding"],
        answer: 2
    },
    {
        question: "Что такое каскадность в CSS?",
        options: ["Способ объединения нескольких таблиц стилей", "Правила приоритетности и наследования стилей", " Метод оптимизации загрузки стилей"],
        answer: 1
    },
    {
        question: "Что такое JavaScript?",
        options: ["Язык разметки", "Язык программирования", "Язык стилей"],
        answer: 1
    },
    {
        question: "Как объявить переменную в JavaScript с помощью 'let'?",
        options: ["variable x = 10", "var x = 10;", "let x = 10;"],
        answer: 2
    },
    {
        question: "Что такое функция в JavaScript?",
        options: ["Специальный объект для хранения данных", "Блок кода, который можно вызвать многократно и который выполняет определённую задачу", "Тип данных для хранения чисел"],
        answer: 1
    },
    {
        question: "Что делает оператор '===' в JavaScript?",
        options: ["Проверяет равенство по значению и типу", "Проверяет равенство только по значению", "Присваивает значение переменной"],
        answer: 0
    },
    {
        question: "Как проверить, является ли переменная x  числом?",
        options: ["typeof x === 'number'", "isNumber(x)", "x instanceof Number"],
        answer: 0
    }
];

// Команда /start
bot.command('start', (ctx) => {
    ctx.reply('Добро пожаловать в викторину! Введите /register для регистрации.');
});

// Команда /register
bot.command('register', (ctx) => {
    const userId = ctx.from.id;
    if (!participants[userId]) {
        participants[userId] = { score: 0, currentQuestion: 0 };
        ctx.reply('Вы успешно зарегистрированы! Начинаем викторину. Введите /next для следующего вопроса.');
    } else {
        ctx.reply('Вы уже зарегистрированы. Введите /next для следующего вопроса.');
    }
});

// Команда /next
bot.command('next', (ctx) => {
    const userId = ctx.from.id;
    if (!participants[userId]) {
        return ctx.reply('Сначала зарегистрируйтесь, введя /register.');
    }

    const participant = participants[userId];
    const questionIndex = participant.currentQuestion;

    if (questionIndex < questions.length) {
        const question = questions[questionIndex];
        const options = question.options.map((option, index) => `${index + 1}. ${option}`).join('\n');
        ctx.reply(`${question.question}\n${options}`);
    } else {
        ctx.reply(`Викторина окончена! Ваш результат: ${participant.score} из ${questions.length}`);
      
    }
});

// Обработка ответов
bot.on('message', (ctx) => {
    const userId = ctx.from.id;
    const participant = participants[userId];

    if (!participant) return;

    const answer = parseInt(ctx.message.text) - 1;
    const questionIndex = participant.currentQuestion;

    if (questionIndex < questions.length) {
        if (answer === questions[questionIndex].answer) {
            participant.score++;
            ctx.reply('Правильно! 🎉');
        } else {
            ctx.reply('Неправильно. 😢');
        }
        participant.currentQuestion++;
        ctx.reply('Введите /next для следующего вопроса.');
    }
});

// Функция для сохранения результатов в файл

// Запуск бота
bot.start();

