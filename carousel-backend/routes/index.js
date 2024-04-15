const express = require("express");
const { getUsers,getUser, Register, Login, Logout, validate, VerifyEmail, SaveRole, 
    resendVerifyEmail,AdditionalInformation, forgotPassword,validateResetToken,resetPassword,InviteTeam,
    borrowerAdditionalInfo, 
    checkEmail,
    verifyIdentity} = require("../controllers/Users.js");
const   verifyToken  = require("../middleware/VerifyToken.js");
const refreshToken  = require("../controllers/RefreshToken.js");
const { check ,body, header } = require('express-validator');
const validator = require('validator'); // Import the validator module
 
const router = express.Router();
 
router.get('/user-data', verifyToken, getUsers);
router.get('/get-user/:slug',getUser);
router.post('/register',
    [
        body('first_name')
            .trim()
            .not()
            .isEmpty()
            .withMessage('Name must not be empty.')
            .isLength({ min: 3 })
            .withMessage('Name must be at least 3 characters long')
            .escape(),
        body('last_name')
            .trim()
            .not()
            .isEmpty()
            .withMessage('Name must not be empty.')
            .isLength({ min: 3 })
            .withMessage('Name must be at least 3 characters long')
            .escape(),
        body('email', 'Invalid email address.')
            .trim()
            .isEmail(),
        body('password')
            .trim()
            .isLength({ min: 8 })
            .withMessage('Password must be at least 8 characters long'),
    ],
    validate, Register);
router.post('/login',
    [
        body('email', 'Invalid email address.')
            .trim()
            .isEmail(),
        body('password', 'Incorrect Password').trim().isLength({ min: 4 }),
    ],
    validate, Login);
router.get('/token', refreshToken);
router.delete('/logout', Logout);
router.get('/verify-email/:id/:token', VerifyEmail);
router.get('/resend-verify-email/:id', resendVerifyEmail);
router.post('/save-role',
    [
        body('slug')
            .trim()
            .not()
            .isEmpty()
            .withMessage('Please enter slug.'),
        body('role')
            .not()
            .isEmpty()
            .withMessage('Please enter role.'),
    ],
    validate, SaveRole);
router.post('/additional-information',
    [
        body('slug')
            .trim()
            .not()
            .isEmpty()
            .withMessage('Please enter slug.'),
        body('buisness_name')
            .not()
            .isEmpty()
            .withMessage('Please enter business name.'),
        body('buisness_address')
            .not()
            .isEmpty()
            .withMessage('Please enter business address.'),
        body('buisness_license')
        .not()
        .isEmpty()
        .withMessage('Please enter business license.'),
    ],
    validate, AdditionalInformation);
router.post('/forgot-password', 
    [
        body('email')
            .trim()
            .not()
            .isEmpty()
            .withMessage('Please enter email address.'),
    ],validate, forgotPassword);
router.post('/validate-reset-token',
    [
        body('token')
            .trim()
            .not()
            .isEmpty()
            .withMessage('Please enter token.'),
    
    ],validate, validateResetToken);
router.post('/reset-password',  [
    body('token')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Please enter token.'),
    body('password')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Please enter password.'),
    // body('confirmPassword')
    //     .trim()
    //     .not()
    //     .isEmpty()
    //     .withMessage('Please enter confirm password.'),

    ],validate, resetPassword);
router.post('/invite-team',
    [
        body('slug')
            .trim()
            .not()
            .isEmpty()
            .withMessage('Please enter slug.'),
        body('emails')
            .isArray()
            .withMessage('Emails must be provided as an array')
            .custom((value, { req }) => {
                // Ensure each email in the array is valid
                for (let email of value) {
                    if (!validator.isEmail(email)) {
                        throw new Error('Invalid email address');
                    }
                }
                return true;
            }),
    ],
    validate, InviteTeam);

router.post('/additional-info',
    [
        body('first_name')
            .trim()
            .not()
            .isEmpty()
            .withMessage('Please enter first name.'),
        body('last_name')
            .not()
            .isEmpty()
            .withMessage('Please enter last name.'),
        body('street_address')
            .not()
            .isEmpty()
            .withMessage('Please enter stree address.'),
        body('city')
            .not()
            .isEmpty()
            .withMessage('Please enter city.'),
        body('state')
            .not()
            .isEmpty()
            .withMessage('Please enter state.'),
        body('zip_code')
            .not()
            .isEmpty()
            .withMessage('Please enter zip code.'),
    ],
    validate, borrowerAdditionalInfo);

router.post('/verify-identity',
[
    body('dob')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Please enter dob.'),
    body('ssn')
        .not()
        .isEmpty()
        .withMessage('Please enter ssn.'),
    body('phone_number')
        .not()
        .isEmpty()
        .withMessage('Please enter phone number.'),
    body('email')
        .not()
        .isEmpty()
        .withMessage('Please enter email.'),
],
validate, verifyIdentity);
router.post('/check-email-similarity',checkEmail)    
module.exports = router