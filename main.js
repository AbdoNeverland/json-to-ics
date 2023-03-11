//create by ABdoneverland
//this script allows you to convert alx planning to ics file, you can find json data in intranet
const char2separate = '\r\n';
const ics_headers = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID://AbdoNeverland//v0.0.1//", "X-WR-CALNAME:alx", "NAME:alx", "CALSCALE:GREGORIAN", ""].join(char2separate);
function getJsDate(AlxDate) {
    // for example 25-6-2023 will be 06/25/2023
    var dt_array = AlxDate.split("-");
    return new Date(dt_array[1] + "/" + dt_array[0] + "/" + dt_array[2]);
}
function getIcsDate(jsdate) {
    //get valide ics date from js Date for DTSTART and DTEND: exp DTSTART:20230105   (no time)
    var dics = jsdate.toJSON().replace(/[\-\:]/g, "");
    return dics.substr(0, dics.length - 5) + "Z";
}
function calculateEndDate(jsStart_date, nb_days) {
    var end_date = new Date();
    end_date.setDate(jsStart_date.getDate() + nb_days);
    return end_date;
}
function splitString(text2split, maxLength, charAsEndOfLine, charExpLastLine) {
    var splited = "";
    var nb_parts = text2split.length / maxLength;
    var _maxLength = text2split.length > maxLength ? maxLength : text2split.length;
    for (var i = 0; i < nb_parts; i++) {
        splited += text2split.substr(i * maxLength, maxLength);
        if (i < nb_parts - 1) splited += charAsEndOfLine + charExpLastLine;
    }
    return splited;
}
function generateEvent(id, AlxStart_date, duration, progress, text) {
    //var start_date=new Date(adaptDate(start_date_text));
    var start_date = getIcsDate(getJsDate(AlxStart_date));
    var end_date = getIcsDate(calculateEndDate(getJsDate(AlxStart_date), duration));
    var oneEvent = ["BEGIN:VEVENT", "UID:" + id, "DTSTAMP:" + getIcsDate(new Date()), "DTSTART:" + start_date,
        "DTEND:" + end_date, "DESCRIPTION:" + splitString(text, 30, char2separate, " "),
        "SUMMARY:" + splitString(text, 30, char2separate, " "), "END:VEVENT", ""];
    return oneEvent.join(char2separate)
}
function pushTextToBeDownloaded(filename, text) {
    var aLink = document.getElementById("aLink");
    aLink.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    aLink.setAttribute('download', filename);
    document.getElementById("downloadDiv").style.display = "block";
}
function convertJson(json_data) {
    //convert json string to ics
    ics = ics_headers;
    for (i = 0; i < json_data.data.length; i++) {
        if (json_data.data[i].id != undefined && json_data.data[i].start_date != undefined &&
            json_data.data[i].duration != undefined && json_data.data[i].text != undefined && parseInt(json_data.data[i].duration) < 100)
            ics += generateEvent(json_data.data[i].id, json_data.data[i].start_date, json_data.data[i].duration, 0.5, json_data.data[i].text);
    }
    ics += "END:VCALENDAR";
    pushTextToBeDownloaded("alx.ics", ics);
}
async function getFileContent(event) {
    const content = await event.target.files.item(0).text();
    convertJson(JSON.parse(content));
}




