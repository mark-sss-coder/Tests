(() => {
    // Выносим правила в глобальный объект window. Теперь любой другой мод сможет их переписать!
    window.lifeRules = {
        live: { alive: [2, 3] },
        dead: { birth: [3] },
        neighbors: [, [1, 0], [0, -1], [-1, 0],
, [-1, 1], [-1, -1], [1, -1]
        ]
    };

    runAfterAutoload(() => {
        // Внутренний хелпер теперь читает данные из глобального window.lifeRules
        function countWeight(x, y) {
            let neigh = 0;
            // Безопасное чтение на случай, если другой мод сотрет объект
            const rules = window.lifeRules || { neighbors: [] }; 
            
            for (const [xPos, yPos, weight] of rules.neighbors) {
                let nx = x + xPos;
                let ny = y + yPos;
                if (!outOfBounds(nx, ny) && pixelMap[ny] && pixelMap[ny][nx]) {
                    if (pixelMap[ny][nx].element === 'alive') {
                        neigh += weight ?? 1;
                    }
                }
            }
            return neigh;
        }

        function wipeGameUI() {
            if (window.categories) window.categories = ["custom_life"];
            const elementButtonWindow = document.getElementById("elementButtons");
            const categoryButtonWindow = document.getElementById("categoryButtons");
            if (elementButtonWindow) elementButtonWindow.innerHTML = "";
            if (categoryButtonWindow) categoryButtonWindow.innerHTML = "";
        }

        elements["Welcome to conway's game of life"] = {
            color: '#c8c8c8',
            category: 'custom_life',
            tick(pixel) {
                deletePixel(pixel.x, pixel.y);
            }
        };

        elements.alive = {
            color: '#00ff00',
            category: 'custom_life',
            state: 'solid',
            density: 1000,
            tick(pixel) {
                let neigh = countWeight(pixel.x, pixel.y);
                const rules = window.lifeRules || { live: { alive: [] } };
                if (!rules.live.alive.includes(neigh)) {
                    pixel.data.nextState = 'dead';
                }
            }
        };

        elements.dead = {
            color: '#989898',
            category: 'custom_life',
            state: 'solid',
            density: 1000,
            tick(pixel) {
                let neigh = countWeight(pixel.x, pixel.y);
                const rules = window.lifeRules || { dead: { birth: [] } };
                if (rules.dead.birth.includes(neigh)) {
                    pixel.data.nextState = 'alive';
                }
            }
        };

        const allowed = ["Welcome to conway's game of life", "alive", "dead", "eraser"];
        for (const key in elements) {
            if (!allowed.includes(key)) {
                delete elements[key];
            }
        }

        wipeGameUI();
        if (typeof window.createButtons === "function") {
            window.createButtons();
        }

        const originalUpdateSim = window.updateSim;
        window.updateSim = function() {
            if (originalUpdateSim) originalUpdateSim();

            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    let pixel = pixelMap[y] ? pixelMap[y][x] : null;
                    if (pixel && pixel.data && pixel.data.nextState) {
                        changePixel(pixel, pixel.data.nextState, true);
                        pixel.data.nextState = null;
                    }
                }
            }
        };
        
        console.log("Mod 'Conway's Life' injected! rules available at window.lifeRules");
    });
})();
