"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.resetPasswordValidators = exports.emailValidators = exports.loginValidators = exports.registerValidators = void 0;
const express_validator_1 = require("express-validator");
const CustomResponse_1 = require("utils/CustomResponse");
// Storing validator-chains as arrays may cause bugs; hence, we return them via a function
const registerValidators = () => [
    (0, express_validator_1.body)('username')
        .isLength({ min: 4, max: 30 }).withMessage('Username must be 4-30 characters long')
        .trim().notEmpty().escape().withMessage('Username Required'),
    (0, express_validator_1.body)('alias')
        .isLength({ min: 4, max: 30 }).withMessage('Alias must be 4-30 characters long')
        .trim().notEmpty().escape().withMessage('Alias Required'),
    (0, express_validator_1.body)('email')
        .isEmail().withMessage('Must be a valid Email')
        .trim().notEmpty().escape().withMessage('Email Required'),
    (0, express_validator_1.body)('password')
        .isAlphanumeric().withMessage("Only numbers and alphabets are allowed")
        .isLength({ min: 6, max: 20 }).withMessage('Password must be 6-20 characters long')
        .notEmpty().escape().withMessage('Password Required'),
];
exports.registerValidators = registerValidators;
const loginValidators = () => [
    (0, express_validator_1.body)('username')
        .isLength({ min: 4, max: 30 }).withMessage('Username must be 4-30 characters long')
        .trim().notEmpty().escape().withMessage('Username Required'),
    (0, express_validator_1.body)('password')
        .trim().notEmpty().escape().withMessage('Password Required')
];
exports.loginValidators = loginValidators;
const emailValidators = () => [
    (0, express_validator_1.body)('email')
        .isEmail().withMessage('Must be a valid Email')
        .trim().notEmpty().escape().withMessage('Email Required')
];
exports.emailValidators = emailValidators;
const resetPasswordValidators = () => [
    (0, express_validator_1.body)('password')
        .isAlphanumeric().withMessage("Only numbers and alphabets are allowed")
        .isLength({ min: 6, max: 20 }).withMessage('Password must be 6-20 characters long')
        .notEmpty().escape().withMessage('Password Required'),
    (0, express_validator_1.body)('confirmPassword')
        .custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Both passwords must be the same');
        }
        return true;
    })
        .notEmpty().escape().withMessage('Confirm Password Required')
];
exports.resetPasswordValidators = resetPasswordValidators;
const validate = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        req.matchedData = (0, express_validator_1.matchedData)(req);
        return next();
    }
    const valdiationErrors = {};
    errors.array().map(err => {
        if (err.type === 'field') {
            valdiationErrors[err.path] = err.msg;
        }
    });
    return (0, CustomResponse_1.errorResponse)(res, { status: 422, errors: valdiationErrors });
};
exports.validate = validate;
