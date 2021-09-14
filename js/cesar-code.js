var dt;
var weathN;
var dailyN;
var aryJSON;
var objJSON;
var suma = 0;
var arr = [];
var claveAlm;
var lowAlumno;
var topAlmuno;
var chartIndex;
var abecedario;
var InicioChart;
var clvNow = "";
var clvOld = "";
var tablAlumnos;
var claveCifrada;
var promedio = 0;
var idAlumno = 0;
var colores = [];
var forecast = [];
var NombreAlm = [];
var countRotate = 0;
var ClavesAlumnos = [];
var Calificciones = [];
var reader = new FileReader();
var ctx = $("#chrtCalificaciones");
var abc = "ZYXWVUTSRQPOÑNMLKJIHGFEDCBABCDEFGHIJKLMNÑOPQRSTUVWXYZ";

function days(str) {
    switch (str) {
        case "Mon":
            return "Lun";
        case "Tue":
            return "Mar";
        case "Wed":
            return "Mié";
        case "Thu":
            return "Jue";
        case "Fri":
            return "Vie";
        case "Sat":
            return "Sáb";
        case "Sun":
            return "Dom";
        default:
            return "hoy";
    }
}

function month(str) {
    switch (str) {
        case "Jan":
            return "Ene";
        case "Feb":
            return "Feb";
        case "Mar":
            return "Mar";
        case "Apr":
            return "Abr";
        case "May":
            return "May";
        case "Jun":
            return "Jun";
        case "Jul":
            return "Jul";
        case "Aug":
            return "Aug";
        case "Sep":
            return "Sep";
        case "Oct":
            return "Oct";
        case "Nov":
            return "Nov";
        case "Dec":
            return "Dec";
        default:
            return "";
    }
}

function icons(data) {
    if (data == "01d") {
        $("#icon").addClass("fas fa-sun");
    } else if (data == "02d") {
        $("#icon").addClass("fas fa-cloud-sun");
    } else if (data == "01n") {
        $("#icon").addClass("fas fa-moon");
    } else if (data == "02n") {
        $("#icon").addClass("fas fa-cloud-moon");
    }

    if (data.substr(0, 2) == "03") {
        $("#icon").addClass("fas fa-cloud");
    } else if (data.substr(0, 2) == "04") {
        $("#icon").addClass("fas fa-cloud-meatball");
    } else if (data.substr(0, 2) == "09") {
        $("#icon").addClass("fas fa-cloud-rain");
    } else if (data.substr(0, 2) == "10") {
        $("#icon").addClass("fas fa-cloud-showers-heavy");
    } else if (data.substr(0, 2) == "11") {
        $("#icon").addClass("fas fa-poo-storm");
    } else if (data.substr(0, 2) == "13") {
        $("#icon").addClass("fas fa-snowflake");
    } else if (data.substr(0, 2) == "50") {
        $("#icon").addClass("fas fa-smog");
    }
}

function toCelsius(temp) {
    return Math.trunc(temp);
}

function getWeather() {
    var requestWeather = $.ajax({
        dataType: "json",
        url: "//api.openweathermap.org/data/2.5/weather",
        data: {
            id: 4004898,
            appid: "3d59b9e0875964a05db74e308b3d11d4",
            units: "metric",
            lang: "es",
        },
    });

    var requestForecast = $.ajax({
        dataType: "json",
        url: "//api.openweathermap.org/data/2.5/onecall",
        data: {
            lat: "33.44",
            lon: "-110.9667",
            appid: "3d59b9e0875964a05db74e308b3d11d4",
            exclude: "current,minutely,hourly,alerts",
            units: "metric",
            lang: "es",
        },
    });

    requestWeather.done(function (data) {
        weathN = data;
        sped = weathN.wind.speed;
        weatherD = weathN.weather[0];

        if (weathN.cod === "404") {
            $("#weather").css("display", "none");
        } else {
            $("#weather").css("display", "");
        }

        dt = new Date(weathN.dt * 1000).toString().split(" ");

        if (toCelsius(weathN.main.temp) >= 30) {
            $("#cardWeather").removeClass().addClass("hot");
        } else if (toCelsius(weathN.main.temp) >= 25) {
            $("#cardWeather").removeClass().addClass("warm");
        } else if (toCelsius(weathN.main.temp) >= 20) {
            $("#cardWeather").removeClass().addClass("cool");
        } else if (toCelsius(weathN.main.temp) <= 15) {
            $("#cardWeather").removeClass().addClass("cold");
        } else {
            $("#cardWeather").removeClass().addClass("default");
        }

        icons(weathN.weather[0].icon);
        $("#divFechaD").html(dt[2]);
        $("#divFechaM").html(dt[1]);
        $("#divFechaA").html(dt[3]);
        $("#divCiudad").html(weathN.name);
        $("#divFechaN").html(days(dt[0]));
        $("#divNubesP").html(weathN.clouds.all);
        $("#divEstado").html(weathN.sys.country);
        $("#divViento").html(Math.round(sped));
        $("#divHumed").html(weathN.main.humidity);
        $("#divPress").html(weathN.main.pressure);
        $("#divClima").html(weatherD.description);
        $("#divVisib").html(weathN.visibility / 1000);
        $("#divHoras").html(dt[4].substring(0, 5));
        $("#divTempr").html(toCelsius(weathN.main.temp));
        $("#divTempAlta").html(toCelsius(weathN.main.temp_max));
        $("#divTempBaja").html(toCelsius(weathN.main.temp_min));
        $("#divSensacion").html(toCelsius(weathN.main.feels_like));
    });

    requestForecast.done(function (data) {
        dailyN = data;
        len = dailyN.daily.length;

        for (var i = 1; i < len; i++) {
            forecast.push({
                date: days(new Date(dailyN.daily[i].dt * 1000).toString().split(" ")[0]),

                celsius: {
                    low: toCelsius(dailyN.daily[i].temp.min),
                    high: toCelsius(dailyN.daily[i].temp.max),
                },
            });
        }
        doForecast("celsius");
    });
}

function doForecast(unit) {
    var i = 0;
    var weeks;
    leng = forecast.length;
    for (i; i < leng - 1; i++) {
        date = forecast[i].date;
        lows = forecast[i][unit].low;
        high = forecast[i][unit].high;
        weeks = '<div class="col-4 col-sm-4 text-center px-1">' + '<div class="cont-temps">' + '<p class="fz-12 fw-500 c-d0 m-0">' + date + "</p>" + '<p class="fz-18 fw-600 m-0">' + lows + "°</p>" + '<p class="fz-16 fw-500 c-d0 m-0">' + high + "°</p>" + "</div>" + "</div>";
        arr.push(weeks);
    }
    $("#forecast").append(arr);
}

function generarNumero(numero) {
    return (Math.random() * numero).toFixed(0);
}

function cifradoCesar(clv, movimineto) {
    clvNow = "";
    clvOld = "";
    claveCifrada = "";

    for (let i = 0; i < clv.length; i++) {
        chartIndex = clv.charAt(i);
        InicioChart = abc.indexOf(chartIndex);

        InicioChart += movimineto;
        clvNow += abc.charAt(InicioChart);
    }
    claveCifrada = clvNow;
}

const ExcelToJSON = function () {
    this.parseExcel = function (alumnosFile) {
        reader.onload = function (event) {
            var alumnosFile = event.target.result;
            var workbook = XLSX.read(alumnosFile, {
                type: "binary",
            });
            workbook.SheetNames.forEach(function (sheetName) {
                rows = workbook.Sheets[sheetName];
                aryJSON = XLSX.utils.sheet_to_row_object_array(rows);
                objJSON = JSON.stringify(aryJSON);

                for (let i = 0; i < aryJSON.length; i++) {
                    idAlumno++;
                    hoy = new Date();
                    anyo = hoy.getFullYear();

                    keys = Object.entries(aryJSON[i]);
                    fecha = keys[3][1];
                    Grado = keys[4][1];
                    Grupo = keys[5][1];
                    Nombres = keys[0][1];
                    ApellidoM = keys[1][1];
                    ApellidoP = keys[2][1];
                    Calificacion = keys[6][1];

                    fch = fecha.split("/");
                    nom = String(Nombres).substring(0, 2);
                    names = String(ApellidoM).substring(0, 1);
                    ape = String(ApellidoM).substr(ApellidoM.length - 2);
                    cumple = parseInt(anyo) - parseInt((year = fch[2]));
                    Edad = cumple;
                    NomLts = nom.toUpperCase();
                    ApeLts = ape.toUpperCase();
                    clave = NomLts + ApeLts;
                    rspt = cifradoCesar(clave, 3);
                    ClaveA = claveCifrada + Edad;
                    GrupoCompleto = Grado + "° " + Grupo;
                    Califi = parseFloat(Calificacion).toFixed(2);
                    Calificciones.push(parseFloat(Calificacion));
                    NombreCompleto = ApellidoP + " " + ApellidoM + " " + Nombres;
                    NombreAbr = ApellidoP + " " + names + ". " + Nombres;
                    NombreAlm.push(NombreAbr);

                    const tr = $('<tr class="shadow border-row align-td"><td class="align-td"></td><td class="visible-td">' + ApellidoP + '</td><td class="align-td">' + NombreCompleto + '</td><td class="align-td">' + fecha + '</td><td class="align-td">' + GrupoCompleto + '</td><td class="align-td">' + Califi + '</td><td class="align-td">' + ClaveA + '</td></tr>');
                    tablAlumnos.row.add(tr[0]).draw(false);
                }

                tablAlumnos.order([2, "asc"]).draw();
                max = Math.max.apply(null, Calificciones);
                min = Math.min.apply(null, Calificciones);
                strMax = String(max.toFixed(2));
                strMin = String(min.toFixed(2));
                tablaD = tablAlumnos.rows().data();
                for (let p = 0; p < Calificciones.length; p++) {
                    const puntos = Calificciones[p];
                    console.log(puntos);
                    if (suma == 0) {
                        suma = puntos;
                    } else {
                        suma = suma + puntos;
                    }
                }
                total = suma.toFixed(2);
                promedio = parseFloat(total)/Calificciones.length;
                
                console.log(total, promedio.toFixed(2));
                $("#txtPromedio").html(promedio.toFixed(2));

                for (let z = 0; z < tablaD.length; z++) {
                    rowTabla = tablaD[z];
                    rowTabla.forEach((rowDetalle) => {
                        rowTop = rowDetalle.includes(strMax);
                        rowLow = rowDetalle.includes(strMin);
                        if (rowTop == true) {
                            topAlmuno = rowTabla[4];
                            $("#txtTop").html(topAlmuno);
                        }

                        if (rowLow == true) {
                            lowAlumno = rowTabla[4];
                            $("#txtLow").html(lowAlumno);
                        }
                    });
                }

                for (var i = 0; i < 10; i++) {
                    var color = "(" + generarNumero(255) + "," + generarNumero(255) + "," + generarNumero(255) + ", 0.65)";
                    colores.push("rgba" + color);
                }
                var pr = JSON.stringify(NombreAlm);
                console.log(pr);
                console.log(colores);
                var chartClif = new Chart(ctx, {
                    type: "bar",
                    data: {
                        labels: NombreAlm,
                        datasets: [
                            {
                                data: Calificciones,
                                backgroundColor: colores,
                            },
                        ],
                    },
                    options: {
                        title: {
                            display: true,
                            text: "Calificaciones",
                        },
                        responsive: true,
                        legend: false,
                        scales: {
                            xAxes: [
                                {
                                    ticks: {
                                        maxRotation: 90,
                                        minRotation: 80,
                                    },
                                    gridLines: {
                                        offsetGridLines: true,
                                    },
                                },
                            ],
                            yAxes: [
                                {
                                    ticks: {
                                        beginAtZero: true,
                                    },
                                },
                            ],
                        },
                    },
                });
            });
        };

        reader.onerror = function (ex) {
            console.log("Archivo no soportado");
        };

        reader.readAsBinaryString(alumnosFile);
        $("#divGrafica").removeClass("hidden");
        $("#fileClip").removeClass("this").addClass("one");
        $("#fileClip").html('<i class="fas fa-paperclip"></i> ' + nombreArchivo + "");
    };
};
$(document).ready(function () {
    jQuery.noConflict();

    tablAlumnos = $("#tblAlumnos")
        .DataTable({
            dom: '<"row"<"col-12 col-md-6 col-lg-4 text-center align-self-center mb-3"B><"col-12 col-md-6 col-lg-4 ml-auto align-self-center mb-3"f>><"row"<"col-sm-12"tr>><"row mt-3"<"col-sm-12 col-md-6 align-self-center"i><"col-sm-12 col-md-6 ml-auto align-self-center"p>>',
            responsive: {
                details: {
                    targets: [0],
                    type: "column",
                    orderable: false,
                },
            },
            processing: true,
            autoWidth: true,
            pageLength: 3,
            order: [[2, "Asc"]],
            columnDefs: [
                {
                    targets: [0],
                    orderable: false,
                    className: "control",
                },
                {
                    targets: [1],
                    visible: false,
                    orderable: false,
                    className: "noVisible",
                },
                {
                    targets: [2, 3, 4, 5, 6],
                    className: "text-center",
                },
            ],
            lengthMenu: [
                [3, 5, 10, 25, 50, -1],
                ["3", "5", "10", "25", "50", "Todo"],
            ],
            buttons: [
                {
                    extend: "pageLength",
                    className: "btn btn-outline-primary btn-sm num-pag",
                },
                {
                    extend: "colvis",
                    text: '<i class="far fa-eye-slash"></i>',
                    className: "btn btn-outline-primary btn-sm show-column",
                    columns: ":not(.noVisible)",
                },
                {
                    extend: "collection",
                    text: '<i class="fas fa-download"></i>',
                    className: "btn btn-outline-primary btn-sm expor-table",
                    buttons: [
                        {
                            extend: "copy",
                            exportOptions: {
                                columns: [2, 3, 4, 5, 6],
                            },
                        },
                        {
                            extend: "excel",
                            exportOptions: {
                                columns: [2, 3, 4, 5, 6],
                            },
                        },
                        {
                            extend: "csv",
                            exportOptions: {
                                columns: [2, 3, 4, 5, 6],
                            },
                        },
                        {
                            extend: "print",
                            exportOptions: {
                                columns: [2, 3, 4, 5, 6],
                            },
                        },
                    ],
                },
            ],
            language: {
                sProcessing: "Procesando...",
                sLengthMenu: "Mostrar _MENU_ registros",
                spageLength: "Mostrar _MENU_ registros",
                sZeroRecords: "No se encontraron resultados",
                sEmptyTable: "No exiten registros",
                sInfo: "Registros del _START_ al _END_ de _TOTAL_ registros",
                sInfoEmpty: "",
                sInfoFiltered: "(filtrado de un total de _MAX_ registros)",
                sInfoPostFix: "",
                sSearch: "",
                sUrl: "",
                sInfoThousands: ",",
                sLoadingRecords: "Cargando...",
                oPaginate: {
                    sFirst: "Primero",
                    sLast: "Último",
                    sNext: "Siguiente",
                    sPrevious: "Anterior",
                },
                oAria: {
                    sSortAscending: ": Activar para ordenar la columna de manera ascendente",
                    sSortDescending: ": Activar para ordenar la columna de manera descendente",
                },
                buttons: {
                    copy: "Copiar",
                    colvis: "Columnas",
                    print: "Imprimir",
                    pageLength: {
                        _: "Mostrar  %d ",
                        "-1": "Todo",
                    },
                },
            },
        })
        .columns.adjust();
    $("#tblAlumnos_filter_filter input").attr("placeholder", "Buscar");
    
    $.ajax({
        dataType: "json",
        url: "//api.openweathermap.org/data/2.5/onecall?lon=-110.9667&lat=33.44&appid=3d59b9e0875964a05db74e308b3d11d4&exclude=minutely,hourly,daily,alerts&units=imperial&lang=es",
    }).then(getWeather());

    doForecast("celsius");

    $(document).on("click", "#btn-celsius", function (event) {
        event.preventDefault();
        doForecast("celsius");
        $("#btn-celsius").addClass("c-d0 active");
    });

    $(document).on("change", "#btnArchivo", function (evt) {
        evt.preventDefault();
        archivo = "";
        idAlumno = 0;
        countRotate = 0;
        archivo = evt.target.files;
        nombreArchivo = archivo[0].name;
        var newExcelJson = new ExcelToJSON();
        newExcelJson.parseExcel(archivo[0]);

        $("#spCountRt").add("hidden");
    });

    $(document).on("click", "#btnRotate", function (event) {
        event.preventDefault();

        var data = tablAlumnos.rows().data();
        data.each(function (value, i) {
            row = i;
            col = 3;
            idA = i + 1;
            countRotate++;
            colValue = value[col];
            console.log(row, colValue);
            $("#spCountRt").html(countRotate);
            $("#spCountRt").removeClass("hidden");

            var output = String(colValue).split("");
            console.log(output);

            var clv = colValue.substring(0, 4);
            var old = colValue.substr(colValue.length - 2);
            var arrayTable = Array.from(clv);

            function rotate(ary, n) {
                l = ary.length;
                pull = ary.slice(n, l);
                push = ary.slice(0, n);

                return pull.concat(push);
            }

            console.log(rotate(arrayTable, 1));
            rtnarrayTable = rotate(arrayTable, 1);
            strarrayTable = rtnarrayTable.toString();
            splarrayTable = strarrayTable.replace(/,/g, "");
            aryTable = splarrayTable;
            comb = aryTable + old;
            tablAlumnos.cell({ row: i, column: col }).data(comb);
        });
    });

    Chart.defaults.global.defaultFontSize = 10;
    Chart.defaults.global.defaultFontFamily = "sans-serif";
});
