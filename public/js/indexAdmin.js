$(function (e) {
  var itemsContainer = document.querySelector("#items");
  var itemsLoaded = [];
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyCeHQarGQpwF09lppxs5o_tZ36m_6YRtIM",
    authDomain: "vcard-profile.firebaseapp.com",
    databaseURL: "https://vcard-profile-default-rtdb.firebaseio.com",
    projectId: "vcard-profile",
    storageBucket: "vcard-profile.appspot.com",
    messagingSenderId: "775091731083",
    appId: "1:775091731083:web:9e53b859d711c65199328e",
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  var defaultDatabase = firebase.database();

  loadData();

  //agregamos el evento al formulario
  document
    .getElementById("upload")
    .addEventListener("change", handleFileSelect, false);
  //   document
  //     .getElementById("loadData")
  //     .addEventListener("click", updateData, false);
  /***
   * HELPERS FUNCTIONS
   *
   */
  var ExcelToJSON = function () {
    this.parseExcel = function (file) {
      var reader = new FileReader();

      reader.onload = function (e) {
        var data = e.target.result;
        var workbook = XLSX.read(data, {
          type: "binary",
        });
        workbook.SheetNames.forEach(function (sheetName) {
          // Here is your object
          var XL_row_object = XLSX.utils.sheet_to_row_object_array(
            workbook.Sheets[sheetName]
          );
          var json_object = JSON.stringify(XL_row_object);
          var items = JSON.parse(json_object);

          var newItems = {};
          Object.keys(items).map(function (id) {
            var item = items[id];
            var tokenNew = generateId(20);
            newItems[tokenNew] = { ...item, token: tokenNew };
            // newItems.push({...item, token: generateId(20) + "gtk" + id });
          });
          itemsLoaded = newItems;
          // console.log(itemsLoaded);
          updateData();
        });
      };
      reader.onerror = function (ex) {
        console.log(ex);
      };
      reader.readAsBinaryString(file);
    };
  };

  function loadData() {
    var htmlObject = ``;

    defaultDatabase
      .ref("hosts")
      .once("value")
      .then((snapshot) => {
        snapshot.forEach((childSnapshot) => {
          var childKey = childSnapshot.key;
          console.log(childKey);
          var item = childSnapshot.val();
          htmlObject += `
              <tr>
                  <td>${item.Nombre ? item.Nombre : ""}</td>
                  <td>${item.Puesto ? item.Puesto : ""}</td>
                  <td>${item["Teléfono"] ? item["Teléfono"] : ""}</td>
                  <td>${item["Extensión"] ? item["Extensión"] : ""}</td>
                  <td>${item.Resort ? item.Resort : ""}</td>
                  <td>${item.email ? item.email : ""}</td>
                  <td style='max-width:160px;overflow:hidden'>${
                    item.foto ? item.foto : ""
                  }
                  </td>
                  ${
                    item.token
                      ? "<td style='font-weight:bold' > <a class='linkPerfil' target='_blank' href='" +
                        window.location.origin +
                        "/anfitrion.html?token=" +
                        item.token +
                        "'>Ver Perfil</a><a style='margin-left:5px' class='linkPerfil' target='_blank' href='" +
                        window.location.origin +
                        "/QRgenerator.html?token=" +
                        item.token +
                        "'>QR</a></td>"
                      : ""
                  }
              </tr>
              `;
        });
        itemsContainer.innerHTML = htmlObject;
      });
  }

  function updateData() {
    defaultDatabase.ref("hosts").set(itemsLoaded, function () {
      alert("Datos Actualizados");
      location.reload();
    });
  }
  function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object
    var xl2json = new ExcelToJSON();
    xl2json.parseExcel(files[0]);
  }

  function dec2hex(dec) {
    return dec.toString(16).padStart(2, "0");
  }

  // generateId :: Integer -> String
  function generateId(len) {
    var arr = new Uint8Array((len || 40) / 2);
    window.crypto.getRandomValues(arr);
    return Array.from(arr, dec2hex).join("");
  }
});
