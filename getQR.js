import { saveAs } from "file-saver";
class Generator {
  constructor(props) {
    this.props = props;
    console.log(this.props);
    this.getQR = this.getQR.bind(this);
    this.getImageQR = this.getImageQR.bind(this);

    this.getQR();

    var that = this;
    document
      .querySelector("#descargaQR")
      .addEventListener("click", function (e) {
        e.preventDefault();
        that.getImageQR();
      });
  }
  getImageQR() {
    var image = document.querySelector("#qrcode").querySelector("img");
    var qrimageurl = image.getAttribute("src");
    saveAs(qrimageurl, this.props.Nombre + ".jpg");
  }
  getQR() {
    new QRCode(
      document.getElementById("qrcode"),
      window.location.origin + "/anfitrion.html?token=" + this.props.token
    );
  }
}
function findGetParameter(parameterName) {
  var result = null,
    tmp = [];
  location.search
    .substr(1)
    .split("&")
    .forEach(function (item) {
      tmp = item.split("=");
      if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    });
  return result;
}
window.onload = function () {
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

  var id = findGetParameter("token");

  defaultDatabase
    .ref("hosts/" + id)
    .once("value")
    .then((snapshot) => {
      var person = snapshot.val();
      console.log(person);
      var vcard = new Generator(person);
    });
};
