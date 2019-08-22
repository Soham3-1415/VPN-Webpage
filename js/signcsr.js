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

const genp12 = () => {
    const data = getFormData(form,['csr']);
    const xhr = new XMLHttpRequest();
    const success = () => {
        const response = JSON.parse(xhr.responseText);
        if(response.error) { console.log(response.error); }
        else {
            console.log(response.response);
            const pkcs12ByteCharacters = atob(response.pkcs12);
            const pkcs12ByteNumbers = new Array(pkcs12ByteCharacters.length);
            for(let i = 0; i < pkcs12ByteCharacters.length; i++)
                pkcs12ByteNumbers[i] = pkcs12ByteCharacters.charCodeAt(i);
            const pkcs12 = new Uint8Array(pkcs12ByteNumbers);
            downloadFile(pkcs12,'applciation/x-pkcs12','client.p12');
        }
    };
    postFormJSON(xhr,{action: '/api/v1/genp12'},data,success,xhrFail);
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
    postFormJSON(xhr,form,data,success,xhrFail);
};

form.onsubmit = () =>  {
    event.preventDefault();
    if(!form.checkValidity()) { return; }
    solvechallenge();
};