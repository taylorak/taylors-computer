var titles = ['CG', 'COS', 'DCGAR', 'DCGN', 'DCGNG', 'DCGS', 'G3'];

var numToMonth = {
  1: 'January',
  2: 'February',
  3: 'March',
  4: 'April',
  5: 'May',
  6: 'June',
  7: 'July',
  8: 'August',
  9: 'September',
  10: 'October',
  11: 'November',
  12: 'December'
}

var superColumns = [
  ['x', 10, 11, 12],
  ['Nato', 0, 0, 0],
  ['Allies', 0, 0, 0],
  ['Army', 0, 0, 0],
  ['Officials', 0, 0, 0],
  ['Supporters', 0, 0, 0],
  ['Joint', 0, 0, 0],
  ['Staff', 0, 0, 0]
]


function generalChart(title, cb) {
  $.getJSON({
    url: 'json/' + title + '.json'
  }).done(function(data) {
    var parsedData = parseData(data);
    superColumns[0] = parsedData[0];

    for(var i = 1; i < parsedData[0].length; i++) {
      superColumns[1][i] += parsedData[1][i];
      superColumns[2][i] += parsedData[2][i];
      superColumns[3][i] += parsedData[3][i];
      superColumns[4][i] += parsedData[4][i];
      superColumns[5][i] += parsedData[5][i];
      superColumns[6][i] += parsedData[6][i];
      superColumns[7][i] += parsedData[7][i];
    }
    generateGraph(title,parsedData);
    cb();
  });
}

function parseData(data) {
  var days;
  var items = data.items;

  days = _.orderBy(_.uniq(items.map(function(cur) {
    return moment(cur.start.dateTime).format("MM");
  })));


  var events = items.map(function(cur) {
    var startDate = moment(cur.start.dateTime);
    var endDate = moment(cur.end.dateTime);

    var duration = moment.duration(endDate.diff(startDate)).hours();

    return {
      day: moment(cur.start.dateTime).format("MM"),
      eventType: cur.summary,
      duration: duration
    }
  });

  var reducedDates = {
    nato: {},
    allies: {},
    army: {},
    officials: {},
    supporters: {},
    joint: {},
    staff: {}
  }

  days.forEach(function(day) {
    reducedDates.nato[day] = 0;
    reducedDates.allies[day] = 0;
    reducedDates.army[day] = 0;
    reducedDates.officials[day] = 0;
    reducedDates.supporters[day] = 0;
    reducedDates.joint[day] = 0;
    reducedDates.staff[day] = 0;
  })

  var finalOutput = events.reduce(function(data, event) {
    data[event.eventType][event.day] += event.duration;
    return data;
  }, reducedDates);


  var natoData = [];
  Object.keys(finalOutput['nato']).forEach(function(output) {
    natoData.push(finalOutput['nato'][output]);
  });


  var alliesData = [];
  Object.keys(finalOutput['allies']).forEach(function(output) {
    alliesData.push(finalOutput['allies'][output]);
  });


  var armyData = [];
  Object.keys(finalOutput['army']).forEach(function(output) {
    armyData.push(finalOutput['army'][output]);
  });


  var officialsData = [];
  Object.keys(finalOutput['officials']).forEach(function(output) {
    officialsData.push(finalOutput['officials'][output]);
  });


  var supportersData = [];
  Object.keys(finalOutput['supporters']).forEach(function(output) {
    supportersData.push(finalOutput['supporters'][output]);
  });


  var jointData = [];
  Object.keys(finalOutput['joint']).forEach(function(output) {
    jointData.push(finalOutput['joint'][output]);
  });


  var staffData = [];
  Object.keys(finalOutput['staff']).forEach(function(output) {
    staffData.push(finalOutput['staff'][output]);
  });

  days.unshift('x');
  natoData.unshift('Nato');
  alliesData.unshift('Allies');
  armyData.unshift('Army');
  officialsData.unshift('Officials');
  supportersData.unshift('Supporters');
  jointData.unshift('Joint');
  staffData.unshift('Staff');


  return [
    days,
    natoData,
    alliesData,
    armyData,
    officialsData,
    supportersData,
    jointData,
    staffData,
  ]
}

function generateGraph(title, columns) {
  var is_bar = false; 
  var chart = c3.generate({
    bindto: '#' + title,
    data: {
      x: 'x',
      columns: columns,
      colors: {
        'Nato' : '#2f6cce',
        'Allies': '#23b23b',
        'Army': '#037015',
        'Officials': '#efec1c',
        'Supporters': '#a32d0d',
        'Joint': '#690da3',
        'Staff': '#707070'
      },
      onclick: function(d,element){
        if( is_bar ){
          is_bar = false;
          this.load({
            columns: columns,
            type: 'bar'
          });
        } else {
          is_bar = true;
          this.load({
            columns: columns,
            type: 'line'
          });
        }
      }
    },
    axis: {
      x: {
        type: 'categorized',
        tick: {
          format: function(x){
            return numToMonth[ columns[0][x+1] ];
          }
        }
      },
      y: {
        label: {
          text: 'Hours',
          position: 'outer-middle'
        }
      }
    },
    tooltip: {
      format: {
        title: function(x){
          return numToMonth[ columns[0][x+1] ];
        },
        value: function (value, ratio, id, idx) {
          return value + ' Hours';
        }
      }
    }
  });
}

generalChart('CG', function() {
  generalChart('COS', function() {
    generalChart('DCGAR', function() {
      generalChart('DCGNG', function() {
        generalChart('DCGS', function() {
          generalChart('DCGN', function() {
            generalChart('G3', function() {
              generateGraph('ALL', superColumns);
            })
          })
        })
      })
    })
  })
});
