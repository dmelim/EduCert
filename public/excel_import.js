    var globalJsonObject;
    $(document).ready(function(){
        $("#fileUpload").change(function(evt){
              var selectedFile = evt.target.files[0];
            var reader = new FileReader();
            reader.onload = function(event) {
                var data = event.target.result;
                var workbook = XLSX.read(data, {
                    type: 'binary'
                });
                workbook.SheetNames.forEach(function(sheetName) {
              
                    var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                    var json_object = JSON.stringify(XL_row_object);
                    globalJsonObject = XL_row_object;
                    console.log(globalJsonObject);
                    console.log(json_object);
                    document.getElementById("jsonObject").innerHTML = json_object;
                    

                })
            };

            reader.onerror = function(event) {
                console.error("File could not be read! Code " + event.target.error.code);
            };

            reader.readAsBinaryString(selectedFile);
        });
    });


$("button").click(function(e) {
    e.preventDefault();
    // Este ciclo garante que o node não fique muito consfuso com o objeto, envia um de cada vez e depois a chegada é processado. Eventualmente deverá ser necessário ter que ver como fazer isto melhor
    for (let i = 0; i< globalJsonObject.length; i++){
        const a = JSON.stringify(globalJsonObject[i]);
        $.post("http://localhost:3000/excel_import", a);
    }
    //$.post("http://localhost:3000/excel_import", a).done(function(data){alert(`Data ${data}`);});
});