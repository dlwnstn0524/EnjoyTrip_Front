window.onload = function() {

  const session = JSON.parse(localStorage.getItem("isLogin"));
  console.log(session);
  if (session == true) {
    const wrapper = document.querySelector("#loginstate");
    wrapper.setAttribute("style", "display:flex");
    const wrapper1 = document.querySelector("#logoutstate");
    wrapper1.setAttribute("style", "display:none");
  } else {
    const wrapper = document.querySelector("#logoutstate");
    wrapper.setAttribute("style", "display:flex");
    const wrapper1 = document.querySelector("#loginstate");
    wrapper1.setAttribute("style", "display:none");
  }
}
  


function login() {
  const inputId = document.querySelector("#userid").value;
  const inputPw = document.querySelector("#passWord").value;
  console.log(inputId);
  console.log(inputPw);

  const data = JSON.parse(localStorage.getItem("register"));
  const id = data.userid;
  const pw = data.passWord;

  console.log(id);
  console.log(pw);
  if (inputId === id && inputPw === pw) {
    alert("로그인 성공!");
    window.location.href = 'main.html';
    localStorage.setItem("isLogin", JSON.stringify(true));
    const wrapper = document.querySelector("#loginstate");
    wrapper.setAttribute("style", "display:block");
    wrapper = document.querySelector("#logoutstate");
    wrapper.setAttribute("style", "display:none");
  } else {
    alert("아이디 비밀번호를 확인해주세요");
  }
}

function logout() {
  localStorage.setItem("isLogin", JSON.stringify(false));
  return;
}