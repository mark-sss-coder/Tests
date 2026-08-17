// 1. Ваши правила Игры «Жизнь» Конвея
window.lifeRules = {
    live: { alive: [2, 3] },
    dead: { birth: [3] },
    neighbors: [
        [0, 1, 1, 0], [1, 0, 1, 0], [0, -1, 1, 0], [-1, 0, 1, 0],
        [1, 1, 1, 0], [-1, 1, 1, 0], [-1, -1, 1, 0], [1, -1, 1, 0]
    ]
};

// 2. Блок-приветствие
elements['Welcome to conway\'s game of life!'] = {
    color: '#c8c8c8',
    category: 'land',
    density: 1000,
    tick: function(pixel) {
        pixel.element = "eraser"; // Просто превращаем в ластик/пустоту
    }
};

// 3. Живая клетка
elements.alive = {
    color: '#cecece',
    category: 'land',
    density: 1000,
    tick: function(pixel) {
        let neigh = 0;
        for (const [xPos, yPos, weight, deadWeight] of window.lifeRules.neighbors) {
            let nx = pixel.x + xPos;
            let ny = pixel.y + yPos;
            
            if (outOfBounds(nx, ny)) {
                neigh += deadWeight ?? 0;
            } else {
                let checkPixel = pixelMap[ny] ? pixelMap[ny][nx] : null;
                if (checkPixel && checkPixel.element === 'alive') {
                    neigh += weight ?? 1;
                } else {
                    neigh += deadWeight ?? 0;
                }
            }
        }
        if (!window.lifeRules.live.alive.includes(neigh)) {
            pixel.nextState = 'dead';
        } else {
            pixel.nextState = 'alive';
        }
    }
};

// 4. Мертвая клетка
elements.dead = {
    color: '#989898',
    category: 'land',
    density: 1000,
    tick: function(pixel) {
        let neigh = 0;
        for (const [xPos, yPos, weight, deadWeight] of window.lifeRules.neighbors) {
            let nx = pixel.x + xPos;
            let ny = pixel.y + yPos;
            
            if (outOfBounds(nx, ny)) {
                neigh += deadWeight ?? 0;
            } else {
                let checkPixel = pixelMap[ny] ? pixelMap[ny][nx] : null;
                if (checkPixel && checkPixel.element === 'alive') {
                    neigh += weight ?? 1;
                } else {
                    neigh += deadWeight ?? 0;
                }
            }
        }
        if (window.lifeRules.dead.birth.includes(neigh)) {
            pixel.nextState = 'alive';
        } else {
            pixel.nextState = 'dead';
        }
    }
};

// 5. Пост-тик для честной смены поколений
elements.alive.postTick = function(pixel) {
    if (pixel.nextState) {
        pixel.element = pixel.nextState;
    }
};
elements.dead.postTick = elements.alive.postTick;

// 6. Мягкая сортировка кнопок (пересобираем ключи, не уничтожая объект elements)
const currentElements = { ...elements };
for (const key in elements) {
    delete elements[key];
}
// Сначала вшиваем ваши
elements.alive = currentElements.alive;
elements.dead = currentElements.dead;
// Потом возвращаем оригинальные
Object.assign(elements, currentElements);

// Перерисовываем интерфейс (если игра уже загружена, кнопки перерисуются)
if (typeof window.createButtons === "function") {
    window.createButtons();
}
