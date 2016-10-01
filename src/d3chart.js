
var days;

$.getJSON({
  url: 'json/CG.json'
}).done(function(data) {
  var items = data.items;

  days = _.orderBy(_.uniq(items.map(function(cur) {
    return moment(cur.start.dateTime).format("L");
  })));

  days.unshift('x');

  items.reduce(function(prev, cur) {
    var startDate = moment(cur.start.dateTime);
    var endDate = moment(cur.end.dateTime);

    var millisecondDuration = moment.duration(endDate.diff(startDate)).hours();


    console.log(millisecondDuration);

    // if(!prev[cur.end.dateTime]) {
    //   prev[cur.end.dateTime] =
    // }
  }, {})
});

var chart = c3.generate({
  bindto: '#chart',
    data: {
        x: 'x',
//        xFormat: '%Y%m%d', // 'xFormat' can be used as custom format of 'x'
        columns: [
            days,
//            ['x', '20130101', '20130102', '20130103', '20130104', '20130105', '20130106'],
            ['data1', 30, 200, 100, 400, 150, 250],
            ['data2', 130, 340, 200, 500, 250, 350]
        ]
    },
    axis: {
        x: {
            type: 'timeseries',
            tick: {
                format: '%Y-%m-%d'
            }
        }
    }
});
// d3.json('json/CG-modified.json', function(error, data) {
//   if(error) throw error;
//   var eventTotalTime = {
//     'nato': 0,
//     'allies': 0,
//     'army': 0,
//     'officials': 0,
//     'supporters': 0,
//     'joint': 0,
//     'staff': 0
//   }

//   var items = data.items;

//   items.reduce(function(prev, cur) {
//     var type =cur.summary.split(' ')[0];

//   }, eventTotalTime );

//   items.forEach(function(d) {
//     console.log(d);
//   })

// });
