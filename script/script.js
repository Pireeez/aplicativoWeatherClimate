const gridWeek = document.querySelector('.grid-week');
let interval;
document.querySelector('.grid-main').style.display = 'none';
document.querySelector('#button-header').addEventListener('click', () => {
        let inputHeader = document.querySelector('#input-header').value;
        fetchCityData(inputHeader);
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
                updateCityInfo(geoCod.results[i],openMeteo[i]),2000
            })
            gridWeek.appendChild(div);
        }
}

//atualiza as informações com detalhes conforme selecionado
const updateCityInfo = (geoCod,openMeteo) => {
    const day = openMeteo.current_weather.is_day;// se é noite: 0 se é dia: 1
    const timezone = openMeteo.timezone

    // dataMap mapeia os elementos html com seus valores
    const dataMap = {
        '#location-city-main': geoCod.name,
        '#location-coutry-main': `${geoCod.admin1} - ${geoCod.country}`,
        '#latitude-info': geoCod.latitude,
        '#longitude-info': geoCod.longitude,
        '#temperature': `${openMeteo.current_weather.temperature}${openMeteo.current_weather_units.temperature}`,
        '#weather': getWeatherDescription(openMeteo.current_weather.weathercode),
        '#wind': `${openMeteo.current_weather.windspeed}${openMeteo.current_weather_units.windspeed}`,
        '#windDirect': `${openMeteo.current_weather.winddirection}${openMeteo.current_weather_units.winddirection}`,
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

//exibe a data e hora atual da cidade
const dateNow = (timezone) =>{
    const data = new Date()
    const time = data.toLocaleTimeString([],{timeZone: timezone});
    const date = data.toLocaleDateString([],{timeZone: timezone})
    document.querySelector('#dateNow').textContent = `${date} - ${time}`;
}

//inicia e mantém o relógio atualizado
const startClock = (timezone) => {
    if (interval){
        clearInterval(interval);//limpa intervalo anterior
    }
    dateNow(timezone)
    interval = setInterval(() => dateNow(timezone),1000)
}

//ação que rola a página até o inicio
document.querySelector('#button-main').addEventListener('click', () =>{
    document.querySelector('#input-header').scrollIntoView({behavior: 'smooth'})
})

//lista de código com descrição dos climas
const arrayWeatherDesc = [
  0, "Céu limpo",
  1, "Principalmente limpo",
  2, "Parcialmente nublado",
  3, "Nublado",
  45, "Nevoeiro",
  48, "Nevoeiro com geada",
  51, "Chuvisco leve",
  53, "Chuvisco moderado",
  55, "Chuvisco forte",
  61, "Chuva leve",
  63, "Chuva moderada",
  65, "Chuva forte",
  66, "Chuva de granizo leve",
  67, "Chuva de granizo forte",
  71, "Nevasca leve",
  73, "Nevasca moderada",
  75, "Nevasca forte",
  77, "Neve granular",
  80, "Pancadas de chuva leves",
  81, "Pancadas de chuva moderadas",
  82, "Pancadas de chuva fortes",
  85, "Pancadas de neve leves",
  86, "Pancadas de neve fortes",
  95, "Trovoada",
  96, "Trovoada com granizo leve",
  99, "Trovoada com granizo forte"
];

//crio um objeto de mapeamento com cód e desc
const weatherCodeMap = (() => {
    const obj = {};
    for(let i = 0; i < arrayWeatherDesc.length; i++){
        if(i % 2 === 0){
            const cod = arrayWeatherDesc[i];
            const desc = arrayWeatherDesc[i + 1]
            obj[cod] = desc
        }
    }
    return obj;
})();

//retorna a descrição do código de clima
const getWeatherDescription = (weatherCode) => {
    return weatherCodeMap[weatherCode]
}
