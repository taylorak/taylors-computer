

$.getJSON({
  url: 'json/CG.json'
}).done(function(data) {
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
  natoData.unshift('nato');
  alliesData.unshift('allies');
  armyData.unshift('army');
  officialsData.unshift('officials');
  supportersData.unshift('supporters');
  jointData.unshift('joint');
  staffData.unshift('staff');

  var chart = c3.generate({
    bindto: '#chart',
    data: {
      x: 'x',
      columns: [
        days,
        natoData,
        alliesData,
        armyData,
        officialsData,
        supportersData,
        jointData,
        staffData,
      ],
    },
    axis: {
      y: {
        label: {
          text: 'Hours',
          position: 'outer-middle'
        }
      }
    }
  });

});
