document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search');
    const regionFilter = document.getElementById('region-filter');
    const countryInfoContainer = document.getElementById('country-info');
    const modal = document.getElementById('country-modal');
    const modalBody = document.getElementById('modal-body');
    const closeModal = document.getElementsByClassName('close')[0];
    const prevPageButton = document.getElementById('prev-page');
    const nextPageButton = document.getElementById('next-page');
    const pageInfo = document.getElementById('page-info');
    const pageInput = document.getElementById('page-input');
    const goPageButton = document.getElementById('go-page');
    const wikiButton = document.getElementById('wiki-button');
    let allCountries = [];
    let currentPage = 1;
    const countriesPerPage = 10;
    let currentCountry = null;

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        const region = regionFilter.value;
        displayCountries(filterCountries(query, region), currentPage);
    });

    regionFilter.addEventListener('change', () => {
        const query = searchInput.value.toLowerCase();
        const region = regionFilter.value;
        currentPage = 1;
        displayCountries(filterCountries(query, region), currentPage);
    });

    closeModal.onclick = () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    };

    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    };

    prevPageButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            const query = searchInput.value.toLowerCase();
            const region = regionFilter.value;
            displayCountries(filterCountries(query, region), currentPage);
        }
    });

    nextPageButton.addEventListener('click', () => {
        const totalPages = Math.ceil(filterCountries(searchInput.value.toLowerCase(), regionFilter.value).length / countriesPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            const query = searchInput.value.toLowerCase();
            const region = regionFilter.value;
            displayCountries(filterCountries(query, region), currentPage);
        }
    });

    goPageButton.addEventListener('click', () => {
        const totalPages = Math.ceil(filterCountries(searchInput.value.toLowerCase(), regionFilter.value).length / countriesPerPage);
        const page = parseInt(pageInput.value);
        if (page >= 1 && page <= totalPages) {
            currentPage = page;
            const query = searchInput.value.toLowerCase();
            const region = regionFilter.value;
            displayCountries(filterCountries(query, region), currentPage);
        } else {
            alert(`Please enter a valid page number between 1 and ${totalPages}`);
        }
    });

    wikiButton.addEventListener('click', () => {
        if (currentCountry) {
            const wikiUrl = `https://en.wikipedia.org/wiki/${currentCountry.name.common}`;
            window.open(wikiUrl, '_blank');
        }
    });

    async function fetchCountries() {
        try {
            const response = await fetch('https://restcountries.com/v3.1/all');
            allCountries = await response.json();
            displayCountries(allCountries, currentPage);
        } catch (error) {
            console.error('Error fetching countries:', error);
        }
    }

    function filterCountries(query, region) {
        return allCountries.filter(country => {
            const matchesQuery = country.name.common.toLowerCase().includes(query);
            const matchesRegion = region ? country.region === region : true;
            return matchesQuery && matchesRegion;
        });
    }

    function displayCountries(countries, page) {
        countries.sort((a, b) => a.name.common.localeCompare(b.name.common));

        const startIndex = (page - 1) * countriesPerPage;
        const endIndex = startIndex + countriesPerPage;
        const paginatedCountries = countries.slice(startIndex, endIndex);

        countryInfoContainer.innerHTML = '';
        paginatedCountries.forEach(country => {
            const countryCard = document.createElement('div');
            countryCard.className = 'country-card';

            countryCard.innerHTML = `
                <h2>${country.name.common}</h2>
                <img src="${country.flags.png}" alt="Flag of ${country.name.common}" class="country-flag">
                <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
                <p><strong>Region:</strong> ${country.region}</p>
                <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
                <button class="more-info-link" data-country-name="${country.name.common}">More Info</button>
            `;
            countryInfoContainer.appendChild(countryCard);
        });

        document.querySelectorAll('.more-info-link').forEach(button => {
            button.addEventListener('click', (event) => {
                const countryName = event.target.getAttribute('data-country-name');
                const country = allCountries.find(c => c.name.common === countryName);
                currentCountry = country;
                showModal(country);
            });
        });

        const totalPages = Math.ceil(countries.length / countriesPerPage);
        pageInfo.textContent = `Page ${page} of ${totalPages}`;

        prevPageButton.disabled = page <= 1;
        nextPageButton.disabled = page >= totalPages;
    }

    function showModal(country) {
        const currencies = country.currencies ? Object.values(country.currencies).map(currency => currency.name).join(', ') : 'N/A';
        const languages = country.languages ? Object.values(country.languages).join(', ') : 'N/A';
        const borders = country.borders ? country.borders.join(', ') : 'None';

        modalBody.innerHTML = `
            <h2>${country.name.common}</h2>
            <img src="${country.flags.png}" alt="Flag of ${country.name.common}" class="country-flag">
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
            <p><strong>Languages:</strong> ${languages}</p>
            <p><strong>Borders:</strong> ${borders}</p>
            <p><strong>Currencies:</strong> ${currencies}</p>
        `;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    fetchCountries();

    const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#000000', '#FF5733', '#FF8C00', '#FFD700', '#ADFF2F', '#00FF7F', '#00CED1', '#1E90FF', '#9370DB', '#FF1493', '#000000'];
    let colorIndex = 0;

    setInterval(() => {
        document.body.style.backgroundColor = colors[colorIndex];
        colorIndex = (colorIndex + 1) % colors.length;
    }, 5000);
});