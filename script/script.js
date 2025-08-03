
const btnHeader = document.querySelector('#button-header')
    .addEventListener('click', () => {
        let inputHeader = document.querySelector('#input-header').value;
        buscarApi(inputHeader)
    })

const buscarApi = async(inputValue) => {
    try {
        const data = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${inputValue}`).then(data => data.json());
        criaListaCidades(data)
    } catch (erro) {
        alert("Alguam coisa deu errado",erro)
    }
}

const criaListaCidades = (data) => {
    const gridWeek = document.querySelector('.grid-week');
    gridWeek.innerHTML = '';
    const cityInfo = data.results.map(data => `${data.name} - ${data.admin1}, ${data.country}`);
    for(let i=0; i < cityInfo.length;i++){
            const div = document.createElement('div');
            div.className = 'box-week';
            div.textContent = cityInfo[i];
            div.addEventListener('click', () => {
                getCityInfo(data.results[i]);
            })
            gridWeek.appendChild(div);
        }
}

const getCityInfo = (info) => {
    const lat = info.latitude
    const lon = info.longitude
    document.querySelector('#location-city-main').textContent = info.name;;
    document.querySelector('#location-coutry-main').textContent = `${info.admin1} - ${info.country}`;
    document.querySelector('#latitude-info').textContent = `Latitude: ${lat}`;
    document.querySelector('#longitude-info').textContent = `longitude: ${lon}`;
    
    getClimaAPI(lat,lon);
}

const getClimaAPI = async(lat,lon) => {
    try {
        const data = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`).then(data => data.json())
        console.log(data);
    } catch (error) {
        console.log('Deu algum erro',error);
    }
}



// Para cada cidade, devem ser exibidos os seguintes dados:

// Nome da Cidade;
// Nome do País;
// Latitude;
// Longitude;
// Clima atual;
// Temperatura atual (com unidade de medida);
// Velocidade do vento e direção (com unidades de medida);
// Se atualmente é dia ou noite.

// API de Clima:
// Usaremos a Open-Meteo, uma API de clima gratuita e que não requer chave de autenticação.
// Passo 1 (Geocodificação): Primeiro, precisamos converter o nome da cidade em coordenadas (latitude e longitude) 
// e adquirir também o nome do país. Usaremos este endpoint: https://geocoding-api.open-meteo.com/v1/search?name=NOME+DA+CIDADE

// Passo 2 (Busca do Clima): Com as coordenadas, buscaremos o clima atual, a temperatura atual, 
// os dados do vento e se é dia ou noite usando este endpoint: 
// https://api.open-meteo.com/v1/forecast?latitude=LAT&longitude=LON&current_weather=true

// Observação: O clima atual é recebido em um código. Você pode usar a tabela auxiliar 
// anexa para converter o código em texto:




//trazer cards todas as cidades quando click exibir todas as informaçõs referente aquelas cidades