import Joi from "joi";


let validate = (data, schema) => {
    const options = { abortEarly: false };
    const { error } = schema.validate(data, options);
    if (!error) return null;

    const errors = {};
    for (let item of error.details) errors[item.path[0]] = item.message;
    return errors;
};

let validateProperty = ({ name, value }, schema) => {
    const obj = { [name]: value };

    const options = { abortEarly: false };
    const { error } = schema.validate(obj, options);
    if (!error) return null;

    for (let item of error.details) {
        if(item.path[0] === name) {
            return item.message;
        }
    }
    return null;

};

export default {
    validate,
    validateProperty
};

