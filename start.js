
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
}

function loadCharts() {

    prepareDatasets();

    // let temp = data.map(d => {
    //     let t = Object.assign({}, d);
    //     t.timestamp = msToFormattedLabel(t.timestamp);
    //     return t;
    // });
    // console.log(temp);

    loadEnergyChart();

}

function loadEnergyChart() {
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
                    borderColor: "rgb(75, 192, 192)",
                    lineTension: 0.1
                },
                {
                    label: "Secondary Energy",
                    data: secondaryEnergyData,
                    fill: false,
                    borderColor: "rgb(244, 212, 66)",
                    lineTension: 0.1
                },
                {
                    label: "Energy Capacity",
                    data: energyCapacityData,
                    fill: false,
                    borderColor: "rgb(38, 104, 104)",
                    lineTension: 0.1
                },
                {
                    label: "Secondary Energy Capacity",
                    data: secondaryEnergyCapacityData,
                    fill: false,
                    borderColor: "rgb(135, 117, 36)",
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
                }]
            }
        }
    });
}

function msToFormattedLabel(ms) {
    return moment(new Date(ms)).format('D/M/YYYY H:mm');
}
