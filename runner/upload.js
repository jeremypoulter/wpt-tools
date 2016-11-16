// Random file name
var randName = function () {
    var res = [];
    var MAX = 6;
    var i;
    var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
                 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
                 'k', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u',
                 'v', 'w', 'x', 'y', 'z'];
    for (i = 0; i < MAX; i++) {
        res[i] = chars[Math.floor((Math.random() * chars.length) % chars.length)];
    }
    return res.join('');
}


// Ajax
var ajax = function (url, method, data, onComplete, onError)
{
    var self = this;

    // Get the Ajax object
    var xhr = new XMLHttpRequest();

    // This function is invoked when the call finishes
    xhr.onreadystatechange = function ()
    {
        if (xhr.readyState == 4)
        {
            // This is a skel of what func needs to do
            if (xhr.status == 200)
            {
                if (onComplete) {
                    onComplete(JSON.parse(xhr.responseText));
                }
            }
            else
            {
                if (onError) {
                    onError();
                }
            }
        }
    }

    // The ajax call itself
    xhr.open(method, url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(data, data.length);
}
