document.addEventListener('DOMContentLoaded', () => {
    const packShowcase = document.getElementById('pack-showcase');

    if (packShowcase && typeof ALL_GRAB_BAGS !== 'undefined') {
        packShowcase.innerHTML = ''; // Clear any placeholder content

        ALL_GRAB_BAGS.forEach(pack => {
            const packContainer = document.createElement('div');
            packContainer.className = 'pack-item';
            packContainer.classList.add(`pack-type-${pack.type.toLowerCase()}`);

            const packName = document.createElement('h3');
            packName.className = 'pack-name';
            packName.textContent = pack.name;

            const packDesc = document.createElement('p');
            packDesc.className = 'pack-description';
            packDesc.textContent = pack.description;

            const packCost = document.createElement('div');
            packCost.className = 'pack-cost';
            packCost.textContent = `$${pack.purchaseCost}`;

            packContainer.appendChild(packName);
            packContainer.appendChild(packDesc);
            packContainer.appendChild(packCost);

            packShowcase.appendChild(packContainer);
        });
    }
});