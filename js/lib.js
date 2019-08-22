'use strict';

const textErrorHandler = (field, check, errorMessage, emptyMessage) => {
    const fieldError = field.parentElement.getElementsByTagName('span')[0];
    if(check.test(field.value))
        field.setCustomValidity('');
    else
        field.setCustomValidity(errorMessage);
    if(!field.validity.valid) {
        if(field.value === '') {
            fieldError.setAttribute('data-error','');
            fieldError.textContent = emptyMessage;
        }
        else {
            fieldError.textContent = '';
            fieldError.setAttribute('data-error',errorMessage);
        }
    }
    else {
        fieldError.setAttribute('data-error','');
        fieldError.textContent = '';
    }
};

const xhrFail = () => { console.log('XMLHttpRequest Failed.'); };
const postFormJSON = (xhr,form,data,success,error) => {
    xhr.open('post', form.action, true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr.send(JSON.stringify(data));
    xhr.onload = success;
    xhr.onerror = error;
};

const getFormData = (form,exceptions) => {
    const data = {};
    for (let i = 0, ii = form.length; i < ii; ++i) {
        let input = form[i];
        if (input.name && !exceptions.includes(input.name)) {
            data[input.name] = input.value;
        }
    }
    return data;
};