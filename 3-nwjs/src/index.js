import google from 'google';

const csv = require('csvtojson');

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Avg', 'Sep', 'Okt', 'Nov', 'Dec'];

function montlhyAverage(jsonPrices) {
    const monthReadings = new Proxy({}, {
        get(object, property) {
            return Object.hasOwnProperty.call(object, property) ? object[property] : 0;
        },
    });
    const pricesPerMonth = new Proxy({}, {
        get(object, property) {
            return Object.hasOwnProperty.call(object, property) ? object[property] : 0.0;
        },
    });
    jsonPrices.forEach((row) => {
        const month = parseInt(row.Date.split('-')[1], 10);
        pricesPerMonth[month] += parseFloat(row.AveragePrice);
        monthReadings[month] += 1;
    });

    const data = [['Mesec', 'Cena avokada']];
    Object.keys(pricesPerMonth).forEach((m) => {
        data.push([months[m - 1], pricesPerMonth[m] / monthReadings[m]]);
    });
    return data;
}

function drawChart() {
    csv().fromFile('/home/david/Projects/Spletne-tehnologije/3-nwjs/NWjs/dist/data/avocado.csv').then(async (jsonPrices) => {
        console.log(jsonPrices);
        const data = await montlhyAverage(jsonPrices);
        const chartOptions = {
            title: 'Cene avokada skozi mesece',
            curveType: 'function',
            legend: { position: 'bottom' },
            width: 800,
            height: 550,
            vAxis: { title: 'Cena v €' },
        };
        const chartData = google.visualization.arrayToDataTable(data);

        const chart = new google.visualization.LineChart(document.getElementById('priceChart'));
        chart.draw(chartData, chartOptions);
    });
}
google.charts.load('current', { packages: ['corechart'] });

google.charts.setOnLoadCallback(drawChart);
