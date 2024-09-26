particlesJS('particles-js', {
    "particles": {
        "number": {
            "value": 75,
            "density": {
                "enable": true,
                "value_area": 1000
            }
        },
        "color": {
            "value": "#dadada"
        },
        "size": {
            "value": 3,
            "random": true
        },
        "line_linked": {
            "enable": false
        },
        "move": {
            "enable": true,
            "speed": 2.75,
            "direction": "none",
            "random": true,
            "out_mode": "out"
        }
    },
    "interactivity": {
        "detect_on": "canvas",
        "events": {
            "onhover": {
                "enable": false
            },
            "onclick": {
                "enable": false
            },
            "resize": true
        }
    },
    "retina_detect": true
  });
  
  const cursorDot = document.querySelector("[data-cursor-dot]");
  const cursorOut = document.querySelector("[data-cursor-out]");
  
  window.addEventListener("mousemove", function (e) {
      const posX = e.clientX;
      const posY = e.clientY;
  
      // Instantly move the inner dot
      cursorDot.style.left = `${posX}px`;
      cursorDot.style.top = `${posY}px`;
  
      // Animate the outer circle using transform
      cursorOut.style.transform = `translate(${posX-20}px, ${posY-20}px)`;
  });
  
  const loginBtn = document.querySelector("#login")
  const registerBtn = document.querySelector("#register")
  const loginForm = document.querySelector(".login-form")
  const registerForm = document.querySelector(".register-form")

  loginBtn.addEventListener('click', () => {
    loginBtn.style.backgroundColor = "#21264D";
    registerBtn.style.backgroundColor = "rgba(255, 255, 255, 0.2)";

    loginForm.style.left = "50%";
    registerForm.style.left = "-50%";

    loginForm.style.opacity = 1;
    registerForm.style.opacity = 0;

  })

  registerBtn.addEventListener('click', () => {
    loginBtn.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
    registerBtn.style.backgroundColor =  "#21264D";

    loginForm.style.left = "150%";
    registerForm.style.left = "50%";

    loginForm.style.opacity = 0;
    registerForm.style.opacity = 1;

  })

  const logInputField = document.getElementById('logPassword')
  const logInputIcon = document.getElementById('log-pass-icon')

  const regInputField = document.getElementById('regPassword')
  const regInputIcon = document.getElementById('reg-pass-icon')

  function myLogPassword(){
    if(logInputField.type === "password"){
        logInputField.type = "type";

        logInputIcon.name = "eye-off-outline";
        logInputIcon.style.cursor = "pointer";
    }

    else{
        logInputField.type = "password";

        logInputIcon.name = "eye-outline";
        logInputIcon.style.cursor = "pointer";
    }

  }
  
  function myRegPassword(){
    if(regInputField.type === "password"){
        regInputField.type = "type";

        regInputIcon.name = "eye-off-outline";
        regInputIcon.style.cursor = "pointer";
    }

    else{
        regInputField.type = "password";

        regInputIcon.name = "eye-outline";
        regInputIcon.style.cursor = "pointer";
    }

  }

  function changeIcon (value){
    if(value.length > 0){
        logInputIcon.name = "eye-outline";
        regInputIcon.name = "eye-outline";
    }
    else{
        logInputIcon.name = "lock-closed-out";
        regInputIcon.name = "lock-closed-out";
    }
  }
  