window.totalsPerDate = {};
window.topCountriesPerDate = {}; // confirmed cases

if(!Detector.webgl){
    Detector.addGetWebGLMessage();
} else {

    var container = document.getElementById('container');
    var globe = new DAT.Globe(container, function(label) {
    return new THREE.Color([
        0xd9d9d9, 0xabffe1, 0xff57cd, 0xff0000][label]);
    });

    window.globe = globe;
    
    TWEEN.start();
    getGlobalData(globeContinue);
    

    function startTimer(playBtn)
    {
        const msDelay = 500;

        if(playBtn.innerText == 'Stop ■')
        {
            playBtn.innerText = 'Play ►';
            clearInterval(window.timer);
            return;
        }

        playBtn.innerText = 'Stop ■';

        var currTime = 0;

        var slider = document.getElementById('daySlider');
        if(slider.value != slider.max)
        {
            currTime = Number(slider.value);
        }

        clearInterval(window.timer);

        window.timer = setInterval(function() {
            if(currTime >= window.maxDay)
            {
                playBtn.innerText = 'Play ►';
                clearInterval(window.timer);
                return;
            }
            document.getElementById('currentDay').innerText = dates[currTime];

            document.getElementById('daySlider').value = currTime;
            document.getElementById('confirmedData').innerText = `Confirmed: ${totalsPerDate[dates[currTime]].confirmed.toLocaleString()}`;
            document.getElementById('activeData').innerText = `Active: ${totalsPerDate[dates[currTime]].active.toLocaleString()}`;
            document.getElementById('deathData').innerText = `Deaths: ${totalsPerDate[dates[currTime]].deaths.toLocaleString()}`;

            // top countries
            document.getElementById('country1').innerText = `(1) ${topCountriesPerDate[dates[currTime]][0][0]}: ${topCountriesPerDate[dates[currTime]][0][1].confirmed.toLocaleString()}`;
            document.getElementById('country2').innerText = `(2) ${topCountriesPerDate[dates[currTime]][1][0]}: ${topCountriesPerDate[dates[currTime]][1][1].confirmed.toLocaleString()}`;
            document.getElementById('country3').innerText = `(3) ${topCountriesPerDate[dates[currTime]][2][0]}: ${topCountriesPerDate[dates[currTime]][2][1].confirmed.toLocaleString()}`;
            document.getElementById('country4').innerText = `(4) ${topCountriesPerDate[dates[currTime]][3][0]}: ${topCountriesPerDate[dates[currTime]][3][1].confirmed.toLocaleString()}`;
            document.getElementById('country5').innerText = `(5) ${topCountriesPerDate[dates[currTime]][4][0]}: ${topCountriesPerDate[dates[currTime]][4][1].confirmed.toLocaleString()}`;
            document.getElementById('country6').innerText = `(6) ${topCountriesPerDate[dates[currTime]][5][0]}: ${topCountriesPerDate[dates[currTime]][5][1].confirmed.toLocaleString()}`;
            document.getElementById('country7').innerText = `(7) ${topCountriesPerDate[dates[currTime]][6][0]}: ${topCountriesPerDate[dates[currTime]][6][1].confirmed.toLocaleString()}`;
            document.getElementById('country8').innerText = `(8) ${topCountriesPerDate[dates[currTime]][7][0]}: ${topCountriesPerDate[dates[currTime]][7][1].confirmed.toLocaleString()}`;
            document.getElementById('country9').innerText = `(9) ${topCountriesPerDate[dates[currTime]][8][0]}: ${topCountriesPerDate[dates[currTime]][8][1].confirmed.toLocaleString()}`;
            document.getElementById('country10').innerText = `(10) ${topCountriesPerDate[dates[currTime]][9][0]}: ${topCountriesPerDate[dates[currTime]][9][1].confirmed.toLocaleString()}`;

            settime(globe, currTime)();
            currTime++;
        }, msDelay);
    }  

    function toggleCounties(box)
    {
        console.log(box.checked)
        if(box.checked)
        {
            console.log(document.url)
            let attempt = document.url || window.location.href;
            location.replace(attempt+'counties')
        }
        else
        {
            let attempt = document.url || window.location.href;
            let index = attempt.indexOf('counties')
            let newURL = attempt.slice(0, index)
            location.replace(newURL)
        }
    }   

    function globeContinue(formattedData)
    {
        let dateList = [];

        window.settime = function(globe, t) {
            return function() {
            new TWEEN.Tween(globe).to({time: t/formattedData.length},500).easing(TWEEN.Easing.Cubic.EaseOut).start();
            };
        };

        // console.time('add');
        for (i = 0; i < formattedData.length; i++) {
            // console.time('item'+i);
            globe.addData(formattedData[i][1], {format: 'legend', name: formattedData[i][0], animated: true});
            dateList.push(formattedData[i][0]);
            // console.timeEnd('item'+i);
        }
        // console.timeEnd('add')

        window.dates = dateList;
        window.maxDay = formattedData.length;

        document.getElementById('confirmedData').innerText = `Confirmed: ${window.totalsPerDate[window.dates[window.dates.length-1]].confirmed.toLocaleString()}`;
        document.getElementById('activeData').innerText = `Active: ${window.totalsPerDate[window.dates[window.dates.length-1]].active.toLocaleString()}`;
        document.getElementById('deathData').innerText = `Deaths: ${window.totalsPerDate[window.dates[window.dates.length-1]].deaths.toLocaleString()}`;
        
        for(let i = 0; i < 10; i++)
        {
            document.getElementById('country'+(i+1)).innerText = `(${(i+1)}) ${topCountriesPerDate[window.dates[window.dates.length-1]][i][0]}: ${topCountriesPerDate[window.dates[window.dates.length-1]][i][1].confirmed.toLocaleString()}`;
        }

        var currentInfo = document.getElementById('currentInfo');
        var daySlider = document.createElement('input');
        daySlider.type = 'range';
        daySlider.id = 'daySlider';
        daySlider.min = '0';
        daySlider.max = formattedData.length-1;
        daySlider.step = '1';
        daySlider.value = formattedData.length-1;
        daySlider.className = "slider";
        daySlider.addEventListener('input', function() {
            document.getElementById('currentDay').innerText = window.dates[Number(this.value)];

            settime(globe, Number(this.value))();

            document.getElementById('confirmedData').innerText = `Confirmed: ${window.totalsPerDate[window.dates[Number(this.value)]].confirmed.toLocaleString()}`;
            document.getElementById('activeData').innerText = `Active: ${window.totalsPerDate[window.dates[Number(this.value)]].active.toLocaleString()}`;
            document.getElementById('deathData').innerText = `Deaths: ${window.totalsPerDate[window.dates[Number(this.value)]].deaths.toLocaleString()}`;

            for(let i = 0; i < 10; i++)
            {
                document.getElementById('country'+(i+1)).innerText = `(${(i+1)}) ${topCountriesPerDate[window.dates[Number(this.value)]][i][0]}: ${topCountriesPerDate[window.dates[Number(this.value)]][i][1].confirmed.toLocaleString()}`;
            }
        });
        currentInfo.appendChild(daySlider);

        var currentDay = document.createElement('span');
        currentDay.id = 'currentDay';
        currentDay.innerText = dateList[formattedData.length-1];
        currentDay.style.padding = "10px";
        currentDay.style.fontWeight = "bold";
        currentDay.style.fontSize = "15px";
        currentInfo.appendChild(currentDay);

        // console.time('animate');
        globe.createPoints();
        settime(globe,formattedData.length-1)();
        globe.animate();
        document.body.style.backgroundImage = 'none';
        // console.timeEnd('animate');
    }
}