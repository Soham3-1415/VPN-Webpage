'use strict';
const form = document.getElementById('form');
const email = document.getElementById('email');
const code = document.getElementById('code');
const submit = document.getElementById('submit');

email.addEventListener('input', () => { return textErrorHandler(email, /^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please enter a valid email address.', 'A verification email will be sent to this address.'); }, false);
code.addEventListener('input', () => { return textErrorHandler(code, /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/, 'Please enter a valid code.', 'Leave empty if you want to request a new certificate.'); }, false);
code.addEventListener('input', () => {
    const getCertCodeError = code.parentElement.getElementsByTagName('span')[0];
    if (code.value === '') {
        getCertCodeError.innerText = 'Leave empty if you want to request a new certificate.';
        submit.innerText = 'Request';
    }
    else {
        submit.innerText = 'Download';
    }
}, false);

function signup(token) {
    const data = getFormData(form,['code']);
    data.captcha = token;
    const xhr = new XMLHttpRequest();
    const success = () => {
        const response = JSON.parse(xhr.responseText);
        if(response.error) { console.log(response.error); }
        else {
            console.log(response.response);
            location.href = `/signcsr.html?email=${data.email}`;
        }
    };
    postFormJSON(xhr,form,data,success,xhrFail());
}

const getcert = () =>  {
    const data = getFormData(form,[]);
    const xhr = new XMLHttpRequest();
    const success = () => {
        const response = JSON.parse(xhr.responseText);
        if(response.error) { console.log(response.error); }
        else {
            console.log(response.cert); //TODO
        }
    };
    postFormJSON(xhr,{action: '/api/v1/getcert'},data,success,xhrFail());
};

form.onsubmit = () =>  {
    event.preventDefault();
    if(!form.checkValidity()) { return; }
    if(code.value === '')
        grecaptcha.execute();
    else
        getcert();
};