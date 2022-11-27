const ctx = document.getElementById('myChart');
const btnResultado = document.querySelector("#btnResultado");


async function obtenerMonedas() {
    try {
        const res = await fetch("https://mindicador.cl/api/")
    const data = await res.json()
    return data;
    } catch (error) {
        alert(error.message);
    }
}

async function obtenerMonedasHistoricas(moneda, fecha) {

    try {
        const res = await fetch(`https://mindicador.cl/api/${moneda}/${fecha}`)
    const data = await res.json()
    return data;
    } catch (error) {
        alert(error.message);
    }
    
}

obtenerMonedas()

// Obteniendo valor y nombre de la moneda//
async function renderMonedas() {
    const data = await obtenerMonedas();
    const monedas = (Object.keys(data));

    let template = '<select class="select-opc" name="selec-moneda" id="selec-moneda">';

    for (const moneda of monedas) {
        if (data[moneda].unidad_medida == 'Pesos') {
            template += `<option value="${data[moneda].codigo}-${data[moneda].valor}">${data[moneda].nombre}</option>`;
        }
    }

    template += '</select>'
    document.querySelector("#valorSelect").innerHTML = template;
}

// Mostrando Resultados //

function dibujaGrafico(fechas, valores){

    const data = {
        labels: fechas,
        datasets: [{
            label: 'Histórico',
            data: valores,
            fill: false,
            borderColor: 'white',
            backgroundColor: 'white',
            tension: 0.1
        }]
    };
    
    new Chart(ctx, {
        type: 'line',
        data: data,
    });

    return data;
}


const resultado = "";
btnResultado.addEventListener('click', async function () {

    const inputObtenido = document.querySelector("#montoMoneda").value;
    const tasaYMoneda = document.querySelector("#selec-moneda").value.split('-');

    const resultado = inputObtenido / tasaYMoneda[1];
    document.querySelector("#resultado").innerHTML = '$' + resultado.toFixed(2);
    document.querySelector("#valorMoneda").innerHTML = '$' + tasaYMoneda[1];

    if(inputObtenido == ""){
        alert("Ingresa un monto");
    }
    else{
        const codigoMoneda = tasaYMoneda[0];  
        const fechaActual = new Date();
    
        let fechas=[]
        let valores=[]
    
        let ultimoValor= 0;
    
        for(i = 10;i > 0;i--){
            const dia = fechaActual.getDate()-i;
            const mes = fechaActual.getMonth()+1;
            const aso = fechaActual.getFullYear();
            
            const fechaConsulta = `${dia}-${mes}-${aso}`;
            
            const monedasHistoricas = await obtenerMonedasHistoricas(codigoMoneda, fechaConsulta);
    
            fechas.push(fechaConsulta);
    
            if(monedasHistoricas.serie.length > 0){
                valores.push(monedasHistoricas.serie[0].valor);
                ultimoValor = monedasHistoricas.serie[0].valor
            } else{
                valores.push(ultimoValor);
            }
            
        }
    
        dibujaGrafico(fechas,valores);
    }
})

renderMonedas();




