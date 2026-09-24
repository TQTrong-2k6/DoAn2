const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);


function Validator(formSelector){
    let _this = this
    let formRules = {};

    function getParent(element, selector){
        do{
            if(element.parentElement.matches(selector)){
                return element.parentElement;
            }
            element = element.parentElement;
        }while(element.parentElement);
    }


    /*
    *Quy ước tạo rule:
     - Nếu có lỗi thì return `error message`
     - Nếu không có lỗi thì return `undefined`
    */
    let ValidatorRule = {
        required: value => {
            return value ? undefined : 'Vui lòng nhập trường này'
        },
        email: value => {
            const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : 'Vui lòng nhập email'
        },
        min: min => {
            return value => {
                return value.length >= min ? undefined : `Vui lòng nhập ít nhất ${min} ký tự`
            }
        },
        max: max => {
            return value => {
                return value.length <= max ? undefined : `Vui lòng nhập tối đa ${max} ký tự`
            }
        }
    };

    //Lấy ra form element trong DOM theo `formSelector`
    const formElement = $(formSelector);

    //Chỉ xử lý khi có element trong DOM
    if(formElement){
        let inputs = formElement.querySelectorAll('[name][rules]');

        for(let input of inputs){
            let rules = input.getAttribute('rules').split('|')

            for(let rule of rules){
                let ruleInfo;
                let isRuleHasValue = rule.includes(':')

                if(isRuleHasValue){
                    ruleInfo = rule.split(':');

                    rule = ruleInfo[0];
                }

                let ruleFunc = ValidatorRule[rule]
                
                if(isRuleHasValue){
                    ruleFunc = ruleFunc(ruleInfo[1])

                }

                if(Array.isArray(formRules[input.name])){
                     formRules[input.name].push(ruleFunc);
                }else{
                    formRules[input.name] = [ruleFunc]
                }
            }

            //Lắng nghe sự kiện để validate(blur, change, ...)
            input.onblur = handleValidate;
            input.oninput = handleClearError;
        }
    }

    //Hàm thực hiện validate
    function handleValidate(e){
        let rules = formRules[e.target.name];
        let errorMessage; 

        for(let rule of rules){
            errorMessage =  rule(e.target.value);
            if(errorMessage) break;
        }

            //Nếu có lỗi thì hiển thị message lỗi
        if(errorMessage){
            let formGroup = getParent(e.target, '.form-group')

            if(formGroup){
                formGroup.classList.add('invalid')

                let formMessage = formGroup.querySelector('.form-message')

                if(formMessage){
                    formMessage.innerText = errorMessage
                }
            }
        }

        return !errorMessage;
    }

    //Hàm clear mesage lỗi
    function handleClearError(e){
        let formGroup = getParent(e.target, '.form-group')

        if(formGroup.classList.contains('invalid')){
            formGroup.classList.remove('invalid');

            let formMessage = formGroup.querySelector('.form-message')

                if(formMessage){
                    formMessage.innerText = '';
                }
        }
    }

    //Xử lý hành vi submin form
    formElement.onsubmit = function(e){
        e.preventDefault();
        let inputs = formElement.querySelectorAll('[name][rules]');

        let isValid = true;
        for(let input of inputs){
            if (!handleValidate({target: input})){
                isValid = false;
            }
        }

        //Khi không có lỗi thì submit form
        if(isValid){
            if(typeof _this.onSubmit === 'function'){
                const enableInputs = formElement.querySelectorAll('[name]:not([disabled])');

                const formValues = Array.from(enableInputs).reduce((values, input) => {
                    switch(input.type){
                        case 'radio':
                            values[input.name] = formElement.querySelector(`input[name="${input.name}"]:checked`).value;
                            break;
                        case 'checkbox':
                            if(!input.matches(':checked')){
                                values[input.name] = '';
                                return values;
                            };
                            if(!Array.isArray(values[input.name])){
                                values[input.name] = [];
                            }
                            values[input.name].push(input.value);
                            break;
                        case 'file':
                            values[input.name] = input.files;
                            break;
                        default:
                            values[input.name] = input.value;
                    }
                        
                    return values; 
                }, {});

                _this.onSubmit(formValues)
            }else{
                formElement.submit();
            }
        }
    }
}