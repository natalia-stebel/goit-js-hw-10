import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

input.addEventListener('input', debounce(inputDataEnter, DEBOUNCE_DELAY));

function inputDataEnter() {
  const isFilled = input.value.trim();
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
  if (isFilled) {
    fetchCountries(isFilled)
      .then(dataTaping)
      .catch(error => {
        Notify.failure('Oops, there is no country with that name');
        console.log(error);
      });
  }

  function dataTaping(data) {
    if (data.length > 10) {
      Notify.info('Too many matches found. Please enter a more specific name.');

      return;
    }

    markup(data);
  }

  function markup(data) {
    const markupData = data
      .map(({ flags: { svg }, name: { official } }) => {
        return `<li class="country-name"><img class="flag" src="${svg}" alt="${official}" width="100" height="50"/>${official}</li>`;
      })
      .join('');

    if (data.length === 1) {
      const languages = Object.values(data[0].languages).join(', ');

      const markupInfo = `<ul class="info-list">
      <li class="list-item">Capital: <p class="discription-item">${data[0].capital}</p></li>
      <li class="list-item">Population: <p class="discription-item">${data[0].population}</p></li>
      <li class="list-item">Languages: <p class="discription-item">${languages}</p></li>
      </ul>`;

      countryInfo.insertAdjacentHTML('afterbegin', markupInfo);
    }
    return countryList.insertAdjacentHTML('afterbegin', markupData);
  }
}
