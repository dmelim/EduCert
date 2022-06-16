// função de jquery que prepara o documento para ser iniciado assim que o browser estiver preparado para JS
$(document).ready(function() {
    notary_init();
});

/* função para ler/selecionar o ficheiro, Uma função callback é uma 
função passada a outra função como argumento, que é então invocado dentro da 
função externa para completar algum tipo de rotina ou ação.*/

function hashForFile(callback) {
    // Traz o input, de tipo ficheiro, do html para a função, e cria uma variável 
    input = document.getElementById("certificate");
    /* this.files[0] é um objeto criado pelo jquery, files é uma propriedade que permite criar uma lista 
    com os ficheiros de determinado input, neste caso é criado uma variável, que guarda o input.files[0]
    o primeiro elemento deste array, sendo que estes objetos são sobrepostos, logo a lista não passa de 1 elemento
    este if/else verifica se existe algum ficheiro, se existe corre o código no else  
    */
    if (!input.files[0]) {
        alert("Please select a file first");
    }
    else {
        // sobrepõe a variável file
        file = input.files[0];
        // FileReader.onload - A handler for the FileReader.load_event event. This event is triggered each time the reading operation is successfully completed.
        fr = new FileReader();
        // Executa uma função quando o ficheiro é lido
        fr.onload = function (e) {
            /* The FileReader result property returns the file's contents. 
            This property is only valid after the read operation is complete, and the format of the data depends on which of the methods was 
            used to initiate the read operation. 
             */
            content = e.target.result;
            /* cria um objeto js-sha, com a encryptação desejada(SHA-256) e o tipo do input (Arraybuffer), um arraubuffer é "Basically ArrayBuffer is used to keep 
            binary data. It can be the binary data of an image for example. ArrayBuffer can be used to get data of jpg image (RGB bytes) and produce a 
            png out of it by adding alpha byte (i.e. RGBA)." 
            */ 
            var shaObj = new jsSHA("SHA-256", "ARRAYBUFFER");
            // You can then stream in input using the update object function, calling it multiple times if needed.
            shaObj.update(content);
            // Finally, simply call getHash with the output type as a parameter (B64, HEX, BYTES, ARRAYBUFFER, or UINT8ARRAY)., sendo que o hash final fica um string com 0x no início
            var hash = "0x" + shaObj.getHash("HEX");
            /*  By convention in node, the first argument to a callback is usually used to indicate an error. 
            If it's something other than null, the operation was unsuccessful for some reason -- probably something that the callee cannot recover 
            from but that the caller can recover from. Any other arguments after the first are used as return values from the operation 
            (success messages, retrieval, etc.). This is purely by convention and there is nothing to stop you from writing a function 
            that passes success as the first argument to a callback. If you plan to write a library that is adopted by other node users, 
            you will probably want to stick with convention unless you have a very good reason not to.
            */
            callback(null, hash);
        };
        /* The FileReader interface's readAsArrayBuffer() method is used to start reading the contents of a 
        specified Blob or File. When the read operation is finished, the readyState becomes DONE, and the 
        loadend is triggered. At that time, the result attribute contains an ArrayBuffer representing the file's data.*/
        fr.readAsArrayBuffer(file);
    }
};

function send () {
    hashForFile(function (err, hash) {
        notary_send(hash, function(err, tx) {
            $("#responseText").html("<p>Hash Value Submited with Sucess to Fantom Network.</p>"
                + "<p>Hash Value: " + hash +"</p>"
                + "<p>Transaction ID: " + tx +"</p>"
                + "<p>The Contract has the following adress: " + address +"</p>"
                + "<p><b>The information can take some time to be avaliable</b></p>"
            );
        });
    });
};

function find () {
    hashForFile(function (err, hash) {
        notary_find(hash, function(err, resultObj) {
            if (resultObj.blockNumber != 0) {
                var ipc = ""; 
                if (resultObj.messageSender == "0xACd7A7dCaA6A5d786d7D88aD00F8BF4371219b66") {
                    ipc = "IPC";
                }
                else {
                    ipc = "Not IPC";
                }
                $("#responseText").html("<p>We found your document hash in the fantom Network!</p>"
                    + "<p>Hash Value: " + hash + "</p>"
                    + "<p>Block No.: " + resultObj.blockNumber + "</p>"
                    + "<p>Signing Date: " + resultObj.mineTime + "</p>"
                    + "<p>Signed by: " + ipc + "(" + resultObj.messageSender + ")" + "</p>"
                );
            } else {
                $("#responseText").html("<p>We didn't found your document hash in the fantom Network!</p>"
                    + "<p>Hash Value: " + hash + "</p>"
                );
            }
        });
    });
};