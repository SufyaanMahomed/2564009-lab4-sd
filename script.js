document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault();
    const countryName = document.querySelector('#country').value.trim();
    if (countryName) {
        fetchCountryData(countryName);
    } else {
        displayError('Please enter a country name.');
    }
});

function fetchCountryData(countryName) {
    fetch(`https://restcountries.com/v3.1/name/${countryName}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Country not found');
            }
            return response.json();
        })
        .then(data => {
            const country = data[0];
            displayCountryInfo(country);
            console.log(data);
            fetchBorderingCountries(country.borders);
        })
        .catch(error => {
            displayError(error.message);
        });
}

function fetchBorderingCountries(borders) {
    if (!borders || borders.length === 0) {
        displayBorderingCountries([]);
        return;
    }

    const borderPromises = borders.map(border => 
        fetch(`https://restcountries.com/v3.1/alpha/${border}`)
            .then(response => response.json())
    );

    Promise.all(borderPromises)
        .then(countries => {
            displayBorderingCountries(countries);
        })
        .catch(error => {
            displayError('Error fetching bordering countries');
        });
}

function displayCountryInfo(country) {
    const countryInfoSection = document.querySelector('#country-info');
    countryInfoSection.innerHTML = `
        <h2>${country.name.common}</h2>
        <p><strong>Capital:</strong> ${country.capital}</p>
        <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
        <p><strong>Region:</strong> ${country.region}</p>
        <img src="${country.flags.svg}" alt="Flag of ${country.name.common}" width="200">
        <p><strong>Region:</strong> ${country.borders}</p>
    `;
}

function displayBorderingCountries(countries) {
    const borderingCountriesSection = document.querySelector('#bordering-countries');
    if (countries.length === 0) {
        borderingCountriesSection.innerHTML = '<p>No bordering countries.</p>';
        return;
    }

    const countriesHTML = countries.map(country => `
        <div>
            <h3>${country[0].name.common}</h3>
            <img src="${country[0].flags.svg}" alt="Flag of ${country[0].name.common}" width="100">
        </div>
    `).join('');

    borderingCountriesSection.innerHTML = `
        <h2>Bordering Countries</h2>
        <div>${countriesHTML}</div>
    `;
}

function displayError(message) {
    const countryInfoSection = document.querySelector('#country-info');
    const borderingCountriesSection = document.querySelector('#bordering-countries');
    countryInfoSection.innerHTML = `<p class="error">${message}</p>`;
    borderingCountriesSection.innerHTML = '';
}