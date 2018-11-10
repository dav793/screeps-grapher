
const reader = new FileReader();

let files = [];
let datasets = [];

(function() {

    reader.onload = function(e) {
      var text = reader.result;
      datasets.push(JSON.parse(text));

      if (files.length > 0)
          loadNextFile();
      else
          loadCharts();
    }

})();

function loadFiles() {
    var x = document.getElementById("fileUploader");
    if ('files' in x) {
        for (let i = 0; i < x.files.length; ++i) {
            files.push(x.files[i]);
        }
    }

    loadNextFile();
}

function loadNextFile() {
    if (files && files.length > 0) {
        let file = files.shift();
        reader.readAsText(file);
    }
}

function prepareDatasets() {
    let data = [];
    datasets.forEach(d => {
        data = data.concat(d);
    });

    // remove repeated entries
    data = data.filter((d, index, self) => {
        return index === self.findIndex(t => t.timestamp === d.timestamp);
    });

    // sort by timestamp ascending
    data = data.sort((a, b) => {
        if (a.timestamp < b.timestamp)
            return -1;
        else if (a.timestamp > b.timestamp)
            return 1;
        else
            return 0;
    });

    return data;
}

function loadCharts() {

    let data = prepareDatasets();

    // let temp = data.map(d => {
    //     let t = Object.assign({}, d);
    //     t.timestamp = msToFormattedLabel(t.timestamp);
    //     return t;
    // });
    // console.log(temp);

    loadEnergyChart(data);
    loadCreepCountChart(data);

}

function loadCreepCountChart(data) {
    let labels = data.map(d => msToFormattedLabel(d.timestamp));

    let harvesterCount = data.map(d => d.harvesterCount);
    let haulerCount = data.map(d => d.haulerCount);
    let upgraderCount = data.map(d => d.upgraderCount);
    let builderCount = data.map(d => d.builderCount);

    var ctx = document.getElementById("creepCountChart").getContext('2d');
    new Chart(ctx ,{
        type:"line",
        data:{
            labels: labels,
            datasets:[
                {
                    label: "Harvesters",
                    data: harvesterCount,
                    fill: false,
                    borderColor: getColorRGB('yellow'),
                    lineTension: 0.1
                },
                {
                    label: "Haulers",
                    data: haulerCount,
                    fill: false,
                    borderColor: getColorRGB('green'),
                    lineTension: 0.1
                },
                {
                    label: "Upgraders",
                    data: upgraderCount,
                    fill: false,
                    borderColor: getColorRGB('blue'),
                    lineTension: 0.1
                },
                {
                    label: "Builders",
                    data: builderCount,
                    fill: false,
                    borderColor: getColorRGB('purple'),
                    lineTension: 0.1
                }
            ]
        },
        options:{
            responsive:true,
            maintainAspectRatio: false,
            scales: {
                xAxes: [{
                    type: 'time'
                }],
                yAxes : [{
                    ticks : {
                        beginAtZero : true
                    }
                }]
            }
        }
    });
}

function loadEnergyChart(data) {
    let labels = data.map(d => msToFormattedLabel(d.timestamp));

    let energyData = data.map(d => d.currentEnergy);
    let secondaryEnergyData = data.map(d => d.currentSecondaryEnergy);
    let energyCapacityData = data.map(d => d.energyCapacity);
    let secondaryEnergyCapacityData = data.map(d => d.secondaryEnergyCapacity);

    var ctx = document.getElementById("spawnEnergyChart").getContext('2d');
    new Chart(ctx ,{
        type:"line",
        data:{
            labels: labels,
            datasets:[
                {
                    label: "Energy",
                    data: energyData,
                    fill: false,
                    borderColor: getColorRGB('red'),
                    lineTension: 0.1
                },
                {
                    label: "Secondary Energy",
                    data: secondaryEnergyData,
                    fill: false,
                    borderColor: getColorRGB('yellow'),
                    lineTension: 0.1
                },
                {
                    label: "Energy Capacity",
                    data: energyCapacityData,
                    fill: false,
                    borderColor: getColorRGB('darkRed'),
                    lineTension: 0.1
                },
                {
                    label: "Secondary Energy Capacity",
                    data: secondaryEnergyCapacityData,
                    fill: false,
                    borderColor: getColorRGB('darkYellow'),
                    lineTension: 0.1
                }
            ]
        },
        options:{
            responsive:true,
            maintainAspectRatio: false,
            scales: {
                xAxes: [{
                    type: 'time'
                }],
                yAxes : [{
                    ticks : {
                        beginAtZero : true
                    }
                }]
            }
        }
    });
}

function msToFormattedLabel(ms) {
    return moment(new Date(ms)).format('M/D/YYYY H:mm');
}

function getColorRGB(colorName) {
    let colors = {
        blue: 'rgb(66, 75, 201)',
        darkBlue: 'rgb(42, 47, 124)',
        lightBlue: 'rgb(138, 145, 242)',
        cyan: 'rgb(75, 192, 192)',
        darkCyan: 'rgb(38, 104, 104)',
        lightCyan: 'rgb(157, 234, 234)',
        purple: 'rgb(212, 66, 244)',
        darkPurple: 'rgb(133, 40, 155)',
        lightPurple: 'rgb(239, 170, 255)',
        green: 'rgb(74, 244, 65)',
        darkGreen: 'rgb(42, 135, 37)',
        lightGreen: 'rgb(143, 255, 137)',
        yellow: 'rgb(244, 212, 66)',
        darkYellow: 'rgb(135, 117, 36)',
        lightYellow: 'rgb(255, 233, 137)',
        orange: 'rgb(244, 148, 65)',
        darkOrange: 'rgb(155, 89, 32)',
        lightOrange: 'rgb(255, 201, 155)',
        red: 'rgb(244, 65, 65)',
        darkRed: 'rgb(168, 45, 45)',
        lightRed: 'rgb(255, 150, 150)'
    };

    return colors[colorName];
}
