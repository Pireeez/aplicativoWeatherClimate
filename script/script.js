
import weatherCodeMap from './weatherData.js' //importa minha função que exibe a descrição do código do clima
import getWindDirection from './windDirection.js';

const gridWeek = document.querySelector('.grid-week');
document.querySelector('.grid-main').style.display = 'none';
document.querySelector('#button-header').addEventListener('click', () => {
    let inputHeader = document.querySelector('#input-header').value;
    document.querySelector('.grid-main').style.display = 'none';
        
    fetchCityData(inputHeader);
})
document.querySelector('#input-header').addEventListener('keydown', (event) => {
    if(event.key === 'Enter'){
        let inputHeader = document.querySelector('#input-header').value;
        fetchCityData(inputHeader);
    }
})

//busca dados da cidade, faz requisição com a API GeoCoding e Open Meteo
const fetchCityData = async(inputValue) => {
    gridWeek.textContent = "Carregando...";
    try {
        //busca dados de geocodificação
        const geoCod = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${inputValue}`).then(data => data.json());

        //extrai latitude, longitude e timezone da resposta dados geoCod
        const lat = geoCod.results.map(lat => lat.latitude)
        const lon = geoCod.results.map(lon => lon.longitude)
        const timezone = geoCod.results.map(timezone => timezone.timezone)

        //busca dados clima usando os dados de geocodificação
        const openMeteo = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=${timezone}`).then(data => data.json())
        
        //cria lista de cidades encontradas
        createCityList(geoCod,openMeteo);

    } catch (erro) {
        alert("Erro: Cidade não localizada!",erro);
        console.log(erro);
        location.reload(); //recarrega a página em caso de erro
    }
}

// cria lista de cidades conforme os resultado, passa como parametro geoCod e OpenMeteo
const createCityList = (geoCod,openMeteo) => {
    gridWeek.innerHTML = '';

    // verifica se openMeteo não é um array e transforma em array (garante que OpenMeteo é um array)
    if(!Array.isArray(openMeteo)){
        openMeteo = [openMeteo];
    }

    // monta um array com nome, cidade e pais mapeados/temperatura e unidade
    const cityInfo = geoCod.results.map(data => `${data.name} - ${data.admin1}, ${data.country}`);
    const temp = openMeteo.map(item => item.current_weather.temperature + item.current_weather_units.temperature);

    //cria um card para cada cidade e ao clicar exibe detalhes
    for(let i=0; i < cityInfo.length;i++){
            const div = document.createElement('div');
            div.className = 'box-week';
            div.textContent = `${cityInfo[i]} - ${temp[i]}`
            div.addEventListener('click',() => {
                document.querySelector('.grid-main').style.display = 'flex';
                document.querySelector('.grid-main').scrollIntoView({behavior: 'smooth'})
                updateCityInfo(geoCod.results[i],openMeteo[i])
            })
            gridWeek.appendChild(div);
        }
}

//atualiza as informações com detalhes conforme selecionado
const updateCityInfo = (geoCod,openMeteo) => {
    const day = openMeteo.current_weather.is_day;// se é noite: 0 se é dia: 1
    const timezone = openMeteo.timezone
    const windDirection = openMeteo.current_weather.winddirection

    // dataMap mapeia os elementos html com seus valores
    const dataMap = {
        '#location-city-main': geoCod.name,
        '#location-coutry-main': `${geoCod.admin1} - ${geoCod.country}`,
        '#latitude-info': geoCod.latitude,
        '#longitude-info': geoCod.longitude,
        '#temperature': `${openMeteo.current_weather.temperature}${openMeteo.current_weather_units.temperature}`,
        '#weather': getWeatherDescription(openMeteo.current_weather.weathercode),
        '#wind': `${openMeteo.current_weather.windspeed}${openMeteo.current_weather_units.windspeed}`,
        '#windDirect': `${windDirection}${openMeteo.current_weather_units.winddirection} - ${getWindDirection(windDirection)}`,
    }

    // percorro o dataMap e atualizo as informações do conteúdo html
    Object.entries(dataMap).forEach(([key, values]) => {
        document.querySelector(key).textContent = values;
    })

    //verifica se day é dia ou noite e altero o modo de exibição
    if (day) {
        document.body.classList.remove('dark-mode');
        document.body.classList.add('day-mode');
    }else{
        document.body.classList.remove('day-mode');
        document.body.classList.add('dark-mode');
    }

    // metodo que inicia o relógio
    startClock(timezone);
}

let interval;
//inicia e mantém o relógio atualizado
const startClock = (timezone) => {
    if (interval){
        clearInterval(interval);//limpa intervalo anterior
    }
    dateNow(timezone)
    interval = setInterval(dateNow,1000,timezone)
}

//exibe a data e hora atual da cidade
const dateNow = (timezone) =>{
    const data = new Date()
    const time = data.toLocaleTimeString([],{timeZone: timezone});
    const date = data.toLocaleDateString([],{timeZone: timezone})
    document.querySelector('#dateNow').textContent = `${date} - ${time}`;
}

//ação que rola a página até o inicio
document.querySelector('#button-main').addEventListener('click', () =>{
    document.querySelector('#title-logo').scrollIntoView({behavior: 'smooth'});
})

//retorna a descrição do código de clima
const getWeatherDescription = (weatherCode) => {
    return weatherCodeMap[weatherCode]
}
