let recipes = [];

window.onload = function () {
    document.getElementById('importButton').addEventListener('click', importRecipes);
};

function importRecipes() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.onchange = function (event) {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            try {
                const jsonData = JSON.parse(e.target.result);
                console.log('Imported JSON Data:', jsonData); // Log data to debug
                if (Array.isArray(jsonData) && jsonData.every(recipe => {
                    return recipe.hasOwnProperty('name') &&
                        recipe.hasOwnProperty('vg_ratio') &&
                        recipe.hasOwnProperty('nic_strength') &&
                        recipe.hasOwnProperty('nic_base') &&
                        recipe.hasOwnProperty('bottle_size') &&
                        Array.isArray(recipe.flavors) &&
                        recipe.flavors.every(flavor => flavor.hasOwnProperty('name') && flavor.hasOwnProperty('percent'));
                })) {
                    recipes = jsonData;
                    displayRecipes();
                } else {
                    alert('Invalid recipe data format.');
                }
            } catch (error) {
                console.error('Error parsing JSON:', error); // Log error to debug
                alert('Error parsing JSON data.');
            }
        };

        reader.readAsText(file);
    };

    fileInput.click();
}

function displayRecipes() {
    console.log('Displaying Recipes:', recipes); // Log recipes to debug

    const recipeContainer = document.getElementById('recipesContainer');
    recipeContainer.innerHTML = '';

    recipes.forEach((recipe, index) => {
        const recipeDiv = document.createElement('div');
        recipeDiv.classList.add('recipe-section');
        recipeDiv.classList.add('collapsible'); // Add this class for styling

        recipeDiv.innerHTML = `
            <div class="recipe-header">
                <h3 class="recipe-title">${recipe.name}</h3>
            </div>
            <div class="recipe-content">
                <p><strong>VG Ratio:</strong> ${recipe.vg_ratio}%</p>
                <p><strong>Nicotine Strength:</strong> ${recipe.nic_strength} mg/mL</p>
                <p><strong>Nicotine Base Concentration:</strong> ${recipe.nic_base} mg/mL</p>
                <p><strong>Bottle Size:</strong> ${recipe.bottle_size} ml</p>
                <h4>Ingredients:</h4>
                ${recipe.flavors.map(flavor => `
                    <p><strong>${flavor.name}:</strong> ${(flavor.percent / 100 * recipe.bottle_size).toFixed(2)} ml</p>
                `).join('')}
                <p><strong>Total Nicotine Base Needed:</strong> ${(recipe.nic_strength * recipe.bottle_size / recipe.nic_base).toFixed(2)} ml</p>
                <p><strong>PG Amount:</strong> ${((100 - recipe.vg_ratio) / 100 * recipe.bottle_size - (recipe.nic_strength * recipe.bottle_size / recipe.nic_base + recipe.flavors.reduce((sum, flavor) => sum + (flavor.percent / 100 * recipe.bottle_size), 0))).toFixed(2)} ml</p>
                <p><strong>VG Amount:</strong> ${(recipe.vg_ratio / 100 * recipe.bottle_size).toFixed(2)} ml</p>
            </div>
        `;

        recipeContainer.appendChild(recipeDiv);

        const content = recipeDiv.querySelector('.recipe-content');
        content.style.display = 'none';

        recipeDiv.addEventListener('click', () => {
            if (content.style.display === 'none') {
                content.style.display = 'block';
            } else {
                content.style.display = 'none';
            }
        });
    });
}

function searchRecipes() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const recipeDivs = document.querySelectorAll('#recipesContainer .recipe-section');

    recipeDivs.forEach(div => {
        const title = div.querySelector('.recipe-title').textContent.toLowerCase();
        if (title.includes(query)) {
            div.style.display = 'block';
        } else {
            div.style.display = 'none';
        }
    });
}
