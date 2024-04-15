const express = require("express");
const { getUsers,getUser, Register, Login, Logout, validate, VerifyEmail, SaveRole, 
    resendVerifyEmail,AdditionalInformation, forgotPassword,validateResetToken,resetPassword,InviteTeam } = require("../controllers/Users.js");
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
module.exports = router
// export default router

/* import { Router } from 'express';
import { body, header } from 'express-validator';
import controller, { validate, fetchUserByEmailOrID } from '../controllers/controller.js';

const routes = Router({ strict: true });

// Token Validation Rule
const tokenValidation = (isRefresh = false) => {
    let refreshText = isRefresh ? 'Refresh' : 'Authorization';

    return [
        header('Authorization', `Please provide your ${refreshText} token`)
            .exists()
            .not()
            .isEmpty()
            .custom((value, { req }) => {
                if (!value.startsWith('Bearer') || !value.split(' ')[1]) {
                    throw new Error(`Invalid ${refreshText} token`);
                }
                if (isRefresh) {
                    req.headers.refresh_token = value.split(' ')[1];
                    return true;
                }
                req.headers.access_token = value.split(' ')[1];
                return true;
            }),
    ];
};

// Register a new User
routes.post(
    '/signup',
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
            .isEmail()
            .custom(async (email) => {
                const isExist = await fetchUserByEmailOrID(email);
                if (isExist.length)
                    throw new Error(
                        'A user already exists with this e-mail address'
                    );
                return true;
            }),
        body('password')
            .trim()
            .isLength({ min: 4 })
            .withMessage('Password must be at least 4 characters long'),
    ],
    validate,
    controller.signup
);

// Login user through email and password
routes.post(
    '/login',
    [
        body('email', 'Invalid email address.')
            .trim()
            .isEmail()
            .custom(async (email, { req }) => {
                const isExist = await fetchUserByEmailOrID(email);
                if (isExist.length === 0)
                    throw new Error('Your email is not registered.');
                req.body.user = isExist[0];
                return true;
            }),
        body('password', 'Incorrect Password').trim().isLength({ min: 4 }),
    ],
    validate,
    controller.login
);

// Get the user data by providing the access token
routes.get('/profile', tokenValidation(), validate, controller.getUser);

// Get new access and refresh token by providing the refresh token
routes.get(
    '/refresh',
    tokenValidation(true),
    validate,
    controller.refreshToken
);

export default routes;
 */