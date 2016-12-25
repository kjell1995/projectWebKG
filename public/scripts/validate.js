function validateForm() {
    var check = 0;
    var email = document.forms["signupform"]["Email"].value;
    var firstname = document.forms["signupform"]["Firstname"].value;
    var lastname = document.forms["signupform"]["Lastname"].value;
    var username = document.forms["signupform"]["Username"].value;
    var password1 = document.forms["signupform"]["password"].value;
    var password2 = document.forms["signupform"]["password2"].value;
    var message = "";
    var mailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;

    if (email == "" || firstname == "" || lastname == "" || username == "" || password1 == "" || password2 == "") {
      message += "Not all fields are completed! <br>";
      check = 1;
    }

    if(!passwordRegex.test(password1)){
        message += "Weak Password! <br>";
        check = 1;
    }
    else if(password1 != password2){
        message += "You must enter the same password twice! <br>";
        check = 1;
    }

    if(!mailRegex.test(email)){
      message += "You must enter a valid mail address! <br>";
      document.getElementById('fieldEmail').value = "";
      check = 1
    }

      if(email == ""){
        document.getElementById('labelEmail').style.color = "red";
      }
      else{
        document.getElementById('labelEmail').style.color = "black";
      }
      if(firstname == ""){
        document.getElementById('labelFirstname').style.color = "red";
      }
      else{
        document.getElementById('labelFirstname').style.color = "black";
      }
      if(lastname == ""){
        document.getElementById('labelLastname').style.color = "red";
      }
      else{
        document.getElementById('labelLastname').style.color = "black";
      }
      if(username == ""){
        document.getElementById('labelUsername').style.color = "red";
      }
      else{
        document.getElementById('labelUsername').style.color = "black";
      }
      if(password1 == ""){
        document.getElementById('labelPassword').style.color = "red";
      }
      else{
        document.getElementById('labelPassword').style.color = "black";
      }
      if(password2 == ""){
        document.getElementById('labelPassword2').style.color = "red";
      }
      else{
        document.getElementById('labelPassword2').style.color = "black";
      }

    if(check != 0){
      document.getElementById('fieldPassword').value = "";
      document.getElementById('fieldPassword2').value = "";
      var x = document.getElementById('hiddenMessage').innerHTML = message + "<br>";
      alert("Please fill in all the fields correct!");
      return false;
    }
}
