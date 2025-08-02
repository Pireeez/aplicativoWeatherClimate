//const inputHeader = document.querySelector('#input-header')
//const btnHeader = document.querySelector('#button-header')
const city = 'Sorocaba'
const url = fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`).then(data => data.json());


const buscarApi = async() => {
    try {
        const data = await url
        const name = data.map(item => item.name)
        console.log(data);
        
    } catch (erro) {
        console.log(erro);
    }
}

buscarApi()


//trazer cards todas as cidades quando click exibir todas as informaçõs referente aquelas cidades