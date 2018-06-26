let config = {
    apiKey: "AIzaSyCcOz4jinogYZJKzryxbfY_8TbRYYo8670",
    authDomain: "train-scheduler-37f5e.firebaseapp.com",
    databaseURL: "https://train-scheduler-37f5e.firebaseio.com",
    projectId: "train-scheduler-37f5e",
    storageBucket: "train-scheduler-37f5e.appspot.com",
    messagingSenderId: "266072816832"
};

firebase.initializeApp(config);

const database = firebase.database();
const ref = database.ref();

let nextTrain = 0;

$('#submit').on('click', function (event) {

    event.preventDefault();

    let name = $('#train-name').val().trim();
    let dest = $('#dest').val().trim();
    let first = moment($('#first-train-time').val(), "HH:mm").format("h:mm:ss a");
    let freq = $('#freq').val().trim();

    let newTrain = {
        trainName: name,
        destination: dest,
        firstTrainTime: first,
        frequency: freq
    };

    console.log(newTrain);

    ref.push(newTrain);

    $("#train-name").val("");
    $("#dest").val("");
    $("#first-train-time").val("");
    $("#freq").val("");

})

ref.on('child_added', function (snapshot) {
    //SIMPLIFY:
    let value = snapshot.val();

    //RETRIEVE VALUES FROM DATABASE:
    let train = value.trainName;
    let destination = value.destination;
    let frequency = value.frequency;
    let firstTrainTime = value.firstTrainTime;

    //CONVERT FIRST-TRAIN-TIME into MINUTES/1440 (1)
    let firstTrainTimeMinutes = moment(firstTrainTime, "h:mm:ss a").format('mm');
    let firstTrainTimeHour = moment(firstTrainTime, "h:mm:ss a").format('h');
    let convertHoursToMinutes = firstTrainTimeHour * 60;
    let firstTrainMinutesPastMidnight = parseInt(convertHoursToMinutes) + parseInt(firstTrainTimeMinutes);

    console.log(train + " = TRAIN NAME");
    console.log(firstTrainTime + " = DEPARTS AT")
    console.log(firstTrainMinutesPastMidnight + " = MINUTES PAST MIDNIGHT OF FIRST TRAIN");

    //CONVERT TIME NOW into MINUTES/1440 (2)
    let now = moment().format('HH:mm');
    let timeNowHour = moment(now, "HH:mm").format('h');
    let timeNowHoursToMinutes = timeNowHour * 60;
    let timeNowMinutes = moment(now, "HH:mm").format('mm');
    let timeNowMinutesPastMidnight = parseInt(timeNowHoursToMinutes) + parseInt(timeNowMinutes);
    
    console.log(now + " = TIME NOW");
    console.log(timeNowMinutesPastMidnight + " = TIME NOW MINUTES PAST MIDNIGHT");

    console.log(returnNextTrain(firstTrainMinutesPastMidnight, timeNowMinutesPastMidnight, frequency));

    $('#train-schedule').append(`
        <tr>
            <td id="train">${train}</td>
            <td id="destination">${destination}</td>
            <td id="frequency">${frequency}</td>
            <td id="next-arrival"> - </td>
            <td id="minutes-away"> - </td>
        </tr>
    `)

})

    //FUNCTION WILL RUN TIME NOW IN MINUTES PAST MIDNIGHT AGAINST A FOR LOOP UP TO 1440(MINUTES IN 24 HOURS) WHERE INTERVAL IS EQUAL TO TRAIN FREQUENCY: 
    let returnNextTrain = function(firstTrainMins, timeNow, interval) {

        let first = parseInt(firstTrainMins);
        let time = parseInt(timeNow);
        let int = parseInt(interval);

        for(let m = first; m < 1440; m += int) {
            if (time < m) {
                let nextTrain = (m - time);
                return nextTrain;
            } else {
                console.log('TRAIN PASSED');
            }
        }

    }