/// <reference path="./sandboxel.d.ts" />
/**
 * Neighbors: [x,y,liveWeight?,deadWeight?]
 */
var lifeRules = {
    live: { live: [2, 3] },
    dead: { live: [3] },
    neighbors: [[1, 1], [1, -1], [-1, 1], [-1, -1], [1, 0], [-1, 0], [0, 1], [0, -1]]
};

elements.alive = {
    color: '#eeeeee',
    name: 'Alive cell',
    category: 'land'
};

elements.dead = {
    color: '#888888',
    name: 'Dead cell',
    category: 'land'
};

runEveryTick(() => {
    // В Sandboxel pixelMap — это одномерный массив [x][y], зашитый в движок.
    // Делаем глубокую копию названий элементов, чтобы старый кадр не менялся на лету
    const oldElements = pixelMap.map(row => row.map(pixel => pixel ? pixel.element : null));

    // Проходим по всей сетке игры (используем глобальные ширину и высоту Sandboxel)
    for (let i = 0; i < pixelMapW; i++) {
        for (let j = 0; j < pixelMapH; j++) {
            let nCount = 0;

            for (let n of lifeRules.neighbors) {
                const ni = i + n[0];
                const nj = j + n[1];

                if (outOfBounds(ni, nj)) {
                    nCount += (n[3] ?? 0); // Вес мертвой за границей
                } else {
                    // Безопасно смотрим в сохраненный массив строк
                    const neighborElement = oldElements[ni][nj];
                    if (neighborElement === 'alive') {
                        nCount += (n[2] ?? 1); // Вес живой
                    } else {
                        nCount += (n[3] ?? 0); // Вес любой другой клетки
                    }
                }
            }

            const currentPixel = pixelMap[i][j];
            const currentElement = oldElements[i][j];

            if (currentPixel) {
                // Если клетка живая и соседей мало/много -> умирает
                if (currentElement === 'alive' && !lifeRules.live.live.includes(nCount)) {
                    changePixel(currentPixel, 'dead');
                }
                // Если клетка мертвая и соседей ровно 3 -> оживает
                else if (currentElement === 'dead' && lifeRules.dead.live.includes(nCount)) {
                    changePixel(currentPixel, 'alive');
                }
            }
        }
    }
});
