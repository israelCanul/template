class Card {
  constructor(props) {
    this.props = props;

    // Your web app's Firebase configuration

    this.createQR = this.createQR.bind(this);
    this.createLinkvCard = this.createLinkvCard.bind(this);
    this.createContactBtn = this.createContactBtn.bind(this);
    this.fillFields = this.fillFields.bind(this);

    this.createLinkvCard();
    this.createContactBtn();
    this.createQR();
    this.fillFields();
  }

  fillFields() {
    let that = this;
    var names = document.querySelectorAll(".fullName");
    Object.keys(names).map(function (id) {
      let item = names[id];
      item.innerText = that.props.name + " " + that.props.lastName;
    });
    var phone = document.querySelectorAll(".workPhone");
    Object.keys(phone).map(function (id) {
      let item = phone[id];
      item.innerText = that.props.workPhone;
      item.setAttribute("href", "tel:" + that.props.workPhone);
    });
    var email = document.querySelectorAll(".workEmail");
    Object.keys(email).map(function (id) {
      let item = email[id];
      item.innerText = that.props.workEmail;
      item.setAttribute(
        "href",
        "mailto:" + that.props.workEmail + "?Subject=Contact Us"
      );
    });
    var phone = document.querySelectorAll(".phone");
    Object.keys(phone).map(function (id) {
      let item = phone[id];
      item.innerText = that.props.phone;
      item.setAttribute("href", "tel:" + that.props.phone);
    });
    var email = document.querySelectorAll(".email");
    Object.keys(email).map(function (id) {
      let item = email[id];
      item.innerText = that.props.email;
      item.setAttribute(
        "href",
        "mailto:" + that.props.email + "?Subject=Contact Us"
      );
    });
    var image = document.querySelectorAll(".avatar");
    Object.keys(image).map(function (id) {
      let item = image[id];
      if (that.props.avatar) {
        item.setAttribute("src", that.props.avatar);
      } else {
        item.setAttribute(
          "src",
          "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
        );
      }
    });
    var carrer = document.querySelectorAll(".carrer");
    Object.keys(carrer).map(function (id) {
      let item = carrer[id];
      if (that.props.carrer) {
        item.innerText = that.props.carrer;
      } else {
        item.innerText = "Royal Resorts Anfitrion";
      }
    });
  }
  createContactBtn() {
    var linkContact = document.createElement("a");
    linkContact.className = "lnk";
    linkContact.innerText = "Contact Me";
    linkContact.setAttribute(
      "href",
      "mailto:" + this.props.workEmail + "?Subject=Contact Us"
    );
    document.querySelector("#vcardLink").appendChild(linkContact);
  }
  createLinkvCard() {
    var fooBar = vCard.create(vCard.Version.FOUR);
    fooBar.addFormattedname(this.props.name + " " + this.props.lastName);
    fooBar.addEmail(this.props.email, vCard.Type.HOME);
    fooBar.addEmail(this.props.workEmail, vCard.Type.WORK);
    fooBar.addPhone(this.props.phone, vCard.Type.HOME);
    fooBar.addPhone(this.props.workPhone, vCard.Type.WORK);

    var link = vCard.export(fooBar, "vCard", false); // use parameter true to force download
    link.className = "lnk";
    link.setAttribute(
      "download",
      this.props.name + "-" + this.props.lastName + "-contact.vcf"
    );
    document.querySelector("#vcardLink").appendChild(link);
  }
  createQR() {
    var qr = new JSQR();

    var code = new qr.Code();
    code.encodeMode = code.ENCODE_MODE.BYTE;
    code.version = code.DEFAULT;
    code.errorCorrection = code.ERROR_CORRECTION.H;

    var input = new qr.Input();
    input.dataType = input.DATA_TYPE.VCARD;
    input.data = {
      version: "3.0",
      type: "person",
      firstName: this.props.name,
      middleName: "",
      lastName: this.props.lastName,
      organization: "RoyalResorts",
      title: "",
      home: {
        eMail: this.props.email,
        street: "",
        phone: this.props.phone,
        fax: "",
        city: "",
        zip: "",
        state: "",
        url: "",
        country: "",
      },
      work: {
        eMail: this.props.workEmail,
        street: "",
        phone: this.props.workPhone,
        fax: "",
        city: "",
        zip: "",
        state: "",
        url: "",
        country: "",
      },
      mobilePhone: "",
      birthday: null,
    };
    // var matrix = new qr.Matrix(input, code);
    // var canvas = document.createElement("canvas");
    // canvas.setAttribute("width", matrix.pixelWidth);
    // canvas.setAttribute("height", matrix.pixelWidth);
    // canvas.getContext("2d").fillStyle = "rgb(0,0,0)";
    // matrix.draw(canvas, 0, 0);
    // document.querySelector("#QR").appendChild(canvas);
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
      console.log(snapshot.val());
      var person = snapshot.val();
      var vcard = new Card({
        name: person.Nombre,
        lastName: "",
        email: person.email,
        phone: person["Teléfono"],
        workEmail: person.email,
        workPhone: person["Teléfono"],
        avatar: person.foto
          ? person.foto
          : "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
        carrer: person.Puesto,
      });
    });
};
