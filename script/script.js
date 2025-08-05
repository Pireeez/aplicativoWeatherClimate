const gridWeek = document.querySelector('.grid-week');
const btnHeader = document.querySelector('#button-header')
    .addEventListener('click', () => {
        let inputHeader = document.querySelector('#input-header').value;
        fetchCityData(inputHeader);
    })

//requisição API geocodificação usando nome da cidade e envia resultado para 
const fetchCityData = async(inputValue) => {
    gridWeek.textContent = "Carregando...";
    try {
        const data = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${inputValue}`).then(data => data.json());
        createCityList(data);

    } catch (erro) {
        alert("Erro: Cidade não localizada!",erro)
    }
}

//cria uma lista de cidade para cada resultado retornado pela api
const createCityList = (data) => {
    gridWeek.innerHTML = '';
    const cityInfo = data.results.map(data => `${data.name} - ${data.admin1}, ${data.country}`);

    for(let i=0; i < cityInfo.length;i++){
            const div = document.createElement('div');
            div.className = 'box-week';
            div.textContent = cityInfo[i];
            div.addEventListener('click', () => {
                updateCityInfo(data.results[i]);
            })
            gridWeek.appendChild(div);
        }
}

//atualiza as informações na tela (nome,pais,lat,lon) e chama api para buscar o clima dessa localização
const updateCityInfo = (info) => {
    const lat = info.latitude
    const lon = info.longitude
    document.querySelector('#location-city-main').textContent = info.name;
    document.querySelector('#location-coutry-main').textContent = `${info.admin1} - ${info.country}`;
    document.querySelector('#latitude-info').textContent = lat;
    document.querySelector('#longitude-info').textContent = lon;
    
    fetchWeatherData(lat,lon);
}

//Faz requisição API de clima usando latitude e longitude e envia os dados para atualização de tela do clima
const fetchWeatherData = async(lat,lon) => {
    try {
        const data = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`).then(data => data.json())
        updateWeatherInfo(data);
    } catch (error) {
        console.log('Erro a procurar dados da API:',error);
    }
}

//mostra na tela info de temperatura, vento, descrição do clima e altera o visual conforme for dia e noite
const updateWeatherInfo = (data) => {
    const temp = data.current_weather.temperature;//temperatura
    const day = data.current_weather.is_day;// se é noite: 0 se é dia: 1
    const windDirection = data.current_weather.winddirection;//direção do vento
    const weatherCode = data.current_weather.weathercode;//código do clima
    const windSpeed = data.current_weather.windspeed;//velocidade do vento

    const unitTemperatura = data.current_weather_units.temperature;//unidade de temperatura
    const unitWindDirection = data.current_weather_units.winddirection;//unidade da direção do vento
    const unitWindSpeed = data.current_weather_units.windspeed;//unidade da velocidade do vento

    document.querySelector('#temperature').textContent = temp+unitTemperatura;
    document.querySelector('#weather').textContent = getWeatherDescription(weatherCode)
    document.querySelector('#wind').textContent = windSpeed+unitWindSpeed
    document.querySelector('#windDirect').textContent = windDirection+unitWindDirection

    if(day === 1){
        //dia
        document.querySelector('body').style = 'background: linear-gradient(300deg, var(--background-gradiente1-day), var(--background-gradiente2-day), var(--background-gradiente3-day)); background-size: 600% 600%; animation: gradientShift 3s ease infinite;';
        document.querySelector('.grid-main').style = 'color: var(--color-text-day)';
        document.querySelector('#weather-image').style = 'content: url(/img/sol.png);'
    }else{
        //noite
        document.querySelector('body').style = 'background: linear-gradient(300deg, var(--background-gradiente1-night), var(--background-gradiente2-night), var(--background-gradiente3-night)); background-size: 600% 600%; animation: gradientShift 3s ease infinite;';
        document.querySelector('.grid-main').style = 'color: var(--color-text-night)';
        document.querySelector('#weather-image').style = 'content: url(/img/limpoNoite.png);'
    }
}
 

//recebe código de condição climática da api e retorna descrição
const getWeatherDescription = (codigo) => { 
    switch(codigo){
        case 0: return "Céu limpo";
        case 1: return "Principalmente limpo";
        case 2: return "Parcialmente nublado";
        case 3: return "Nublado";
        case 45: return "Nevoeiro";
        case 48: return "Nevoeiro com geada";
        case 51: return "Chuvisco leve";
        case 53: return "Chuvisco moderado";
        case 55: return "Chuvisco forte";
        case 61: return "Chuva leve";
        case 63: return "Chuva moderada";
        case 65: return "Chuva forte";
        case 66: return "Chuva de granizo leve";
        case 67: return "Chuva de granizo forte";
        case 71: return "Nevasca leve";
        case 73: return "Nevasca moderada";
        case 75: return "Nevasca forte";
        case 77: return "Neve granular";
        case 80: return "Pancadas de chuva leves";
        case 81: return "Pancadas de chuva moderadas";
        case 82: return "Pancadas de chuva fortes";
        case 85: return "Pancadas de neve leves";
        case 86: return "Pancadas de neve fortes";
        case 95: return "Trovoada";
        case 96: return "Trovoada com granizo leve";
        case 99: return "Trovoada com granizo forte";
        default: return "Código desconhecido";
    }
}

// 0   Céu limpo  
// 1   Principalmente limpo  
// 2   Parcialmente nublado  
// 3   Nublado  
// 45  Nevoeiro  
// 48  Nevoeiro com geada  
// 51  Chuvisco leve  
// 53  Chuvisco moderado  
// 55  Chuvisco forte  
// 61  Chuva leve  
// 63  Chuva moderada  
// 65  Chuva forte  
// 66  Chuva de granizo leve  
// 67  Chuva de granizo forte  
// 71  Nevasca leve  
// 73  Nevasca moderada  
// 75  Nevasca forte  
// 77  Neve granular  
// 80  Pancadas de chuva leves  
// 81  Pancadas de chuva moderadas  
// 82  Pancadas de chuva fortes  
// 85  Pancadas de neve leves  
// 86  Pancadas de neve fortes  
// 95  Trovoada  
// 96  Trovoada com granizo leve  
// 99  Trovoada com granizo forte  

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