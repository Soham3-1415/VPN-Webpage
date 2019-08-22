'use strict';
const form = document.getElementById('form');
const email = document.getElementById('email');
const code = document.getElementById('code');
const file = document.getElementById('file');
const submit = document.getElementById('submit');

const queryString = window.location.search.replace(/^\?/, '');
queryString.split(/&/).forEach(function(keyValuePair) {
    let paramName = keyValuePair.replace(/=.*$/, "");
    if(paramName === 'email')
        email.value = keyValuePair.replace(/^[^=]*=/, "");
});

email.addEventListener('input', () => { return textErrorHandler(email, /^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please enter a valid email address.', ''); }, false);
code.addEventListener('input', () => { return textErrorHandler(code, /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/, 'Please enter a valid code.', ''); }, false);
// file.addEventListener('input', () => {
//     const getCertCodeError = file.parentElement.getElementsByTagName('span')[0];
//     if (file.value === '') {
//         getCertCodeError.innerText = 'Leave empty if you want to request a new certificate.';
//         submit.innerText = 'Generate';
//     }
//     else {
//         submit.innerText = 'Sign';
//     }
// }, false);

const genp12 = () => {

};

const signcert = () => {

};

const solvechallenge = () => {
    const data = getFormData(form,['csr']);
    const xhr = new XMLHttpRequest();
    const success = () => {
        const response = JSON.parse(xhr.responseText);
        if(response.error) { console.log(response.error); }
        else {
            console.log(response.response);
            if (file.value === '')
                genp12();
            else
                signcert();
        }
    };
    const fail = () => {
        console.log(xhr.responseText);
    };
    return postFormJSON(xhr,form,data,success,xhrFail());
};

form.onsubmit = () =>  {
    event.preventDefault();
    if(!form.checkValidity()) { return; }
    solvechallenge();
};