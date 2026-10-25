// Тема: аутентификация и авторизация в веб-приложениях.
// Правильные ответы хранятся только на сервере и не передаются в браузер.
export const tasks = [
  {
    id: 'q1',
    prompt: 'Какой HTTP-заголовок браузер использует для передачи Bearer-токена при запросе к защищённому API? (одно слово, например Authorization)',
    answer: 'authorization',
    points: 3
  },
  {
    id: 'q2',
    prompt: 'Как называется браузерный стандарт беспарольной аутентификации по криптографическим ключам, устойчивый к фишингу за счёт привязки к домену? (одно слово)',
    answer: 'webauthn',
    points: 3
  },
  {
    id: 'q3',
    prompt: 'Как называется (аббревиатурой) модель контроля доступа, где решение принимается по атрибутам субъекта, ресурса и контекста, а не по фиксированным ролям?',
    answer: 'abac',
    points: 4
  }
];

export function normalize(value) {
  return value.trim().toLowerCase();
}

export function grade(answers) {
  if (!answers || typeof answers !== 'object' || Array.isArray(answers)) {
    throw Object.assign(new Error('Нужен объект answers.'), { status: 400 });
  }
  if (Object.keys(answers).length !== tasks.length ||
      Object.keys(answers).some(id => !tasks.some(t => t.id === id))) {
    throw Object.assign(new Error('Передайте ровно три ответа: q1, q2, q3.'), { status: 400 });
  }
  const items = tasks.map(task => {
    const value = answers[task.id];
    if (typeof value !== 'string' || value.length > 200) {
      throw Object.assign(new Error('Ответ должен быть строкой до 200 символов.'), { status: 400 });
    }
    const correct = normalize(value) === normalize(task.answer);
    return { id: task.id, correct, points: correct ? task.points : 0 };
  });
  return {
    scoreGiven: items.reduce((sum, item) => sum + item.points, 0),
    scoreMaximum: tasks.reduce((sum, task) => sum + task.points, 0),
    items
  };
}
