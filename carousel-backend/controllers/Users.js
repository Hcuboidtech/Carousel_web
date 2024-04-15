const Users =  require("../models/UserModel.js");
const InviteTeams =  require("../models/InviteTeamModel.js");
const AdditionalInfo =  require("../models/AdditionalInfo.js");

const Token = require("../models/token.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { validationResult, matchedData } = require('express-validator');
const { sendingMail } = require("../config/mailing.js");
const VerifyIdentity = require("../models/VerifyIdentity.js");

const validation_result = validationResult.withDefaults({
    formatter: (error) => error.msg,
});

const validate = (req, res, next) => {
    const errors = validation_result(req).mapped();
    if (Object.keys(errors).length) {
        return res.status(422).json({
            status: 422,
            errors,
        });
    }
    next();
};
 
const getUsers = async (req, res) => {
    try {
        const user = await Users.findOne({
            where: { email: req.email },
            attributes: ['id', 'first_name', 'last_name', 'slug', 'name', 'email', 'isVerified', 'role']
        });
        const inviteTeam = await InviteTeams.findAll({ where: { user_id: user.id } });
        let inviteTeamData = '';
        if(inviteTeam){
            inviteTeamData = inviteTeam;
        }
  
        if (!user) {
            return res.status(404).json({ errors: [{ msg: 'User not found' }] });
        }
  
        res.status(200).json({status:true,'user':user,inviteTeamData});
    } catch (error) {
      console.log(error);
      return res.status(400).json({ errors: [{ msg: 'Something went wrong' }] });
    }
  };
//AUTH USER DATA
const getUser = async(req, res) => {
    const { slug } = (req.params.slug); 
    try {
        const user = await Users.findOne({ where: { slug: req.params.slug } });
        if (user) {
            if(user.isVerified == 1){
                const inviteTeam = await InviteTeams.findAll({ where: { user_id: user.id } });
                let inviteTeamData = '';
                if(inviteTeam){
                    inviteTeamData = inviteTeam;
                }
                const borrowerAdditionalData = await AdditionalInfo.findOne({ where: { user_id: user.id } });
                let  borrowerAdditionalInfo = ''
                if(borrowerAdditionalData){
                    borrowerAdditionalInfo = borrowerAdditionalData
                }
                const borrowerVerifyData = await VerifyIdentity.findOne({ where: { user_id: user.id } });
                let  borrowerVerifyInfo = ''
                if(borrowerVerifyData){
                    borrowerVerifyInfo = borrowerVerifyData
                }
                return res.status(200).json({'user':user,inviteTeamData,borrowerAdditionalData,borrowerVerifyInfo});
            }else{
                const usertoken = await Token.findOne({
                    where: {
                      user_id: user.id,
                    },
                  });
                return res.status(401).send({status:false,user:user,usertoken:usertoken.token,
                    msg: "Please verify your account.",
                  });
            }
        }else{
          return res.status(401).send({status:false,user:'',
            msg: "We were unable to find a user!",
          });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({ errors: [{ msg: 'Something went wrong' }] });

    }
}

function generateRandomSlug(length) {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let randomSlug = '';
    for (let i = 0; i < length; i++) {
        randomSlug += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return randomSlug;
}
 
const Register = async(req, res, next) => {
    const { first_name,last_name, email, password, confirm_password } = (req.body);    
    if(password !== confirm_password) return res.status(400).json({msg: "Password and Confirm Password do not match"});
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    try {
        // Check if user exists
        let userObj = await Users.findOne({ 
            where: {
              email: email,
            },});
        if (userObj) {
            return res.status(400).send({status:false,msg:"User already exists"});
            return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
        }
        const randomSlug = generateRandomSlug(6); // Change the length as needed
        const user = await Users.create({
            first_name: first_name,
            last_name: last_name,
            name: first_name+' '+last_name,
            slug: randomSlug,
            email: email,
            password: hashPassword,
            isVerified:false
        });
        if (user) {
            let setToken = await Token.create({
              user_id: user.id,
              token: crypto.randomBytes(16).toString("hex"),
            });
      
            //if token is created, send the user a mail
            if (setToken) {
                // console.log(setToken);
            //     var origin = req.get('host');
            //${origin}/verify-email/${user.id}/${setToken.token}`}
                //SEND VERIFY EMAIL
                sendingMail({
                    from: "Carousel",
                    to: `${email}`,
                    subject: "Account Verification Link",
                    text: {'username':`${user.name}`,url:`${process.env.APP_URL}verify/${user.id}/${setToken.token}`},
                    html: { path: '/views/verifyEmail.html' }
                });
                //SEND ADMIN EMAIL
                sendingMail({
                    from: "Carousel",
                    to: `twnklbhati@gmail.com`,
                    subject: "New User Registred",
                    text: {'username':`${user.name}`,email:`${user.email}`},
                    html: { path: '/views/adminEmail.html' }
                });
                /* sendingMail({
                    from: "aws5.nyusoft@gmail.com",
                    to: `${email}`,
                    subject: "Account Verification Link",
                    text: `Hello, ${user.name} Please verify your email by
                        clicking this link :
                        http://localhost:3001/verify-email/${user.id}/${setToken.token} `,
                }); */
                // return res.status(201).send({ status:true,isMailSent: true, user: user,msg:"Registration Successful" });
            } else {
              return res.status(400).send({status:false,msg:"token not created"});
            }
            return res.status(201).send({ status:true,isMailSent: true, user: user,msg:"Registration Successful" });
            res.json({msg: "Registration Successful"});
        } else {
        return res.status(409).send({status:false,msg:"Details are not correct"});
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ status:false,msg: 'Server error' });
    }
}

const resendVerifyEmail = async(req, res) => {
    // const { id } = (req.body);    
    const id = req.params.id;
    try {
        const user = await Users.findOne({ where: { id: id } });

        if (user) {
            let setToken = await Token.create({
              user_id: user.id,
              token: crypto.randomBytes(16).toString("hex"),
            });
            sendingMail({
                from: "Carousel",
                to: `${user.email}`,
                subject: "Account Verification Link",
                text: {'username':`${user.name}`,url:`${process.env.APP_URL}verify/${user.id}/${setToken.token}`},
                html: { path: '/views/verifyEmail.html' }
            });
            return res.status(200).send({ status:true,isMailSent: true, user: user,msg:"Verification email sent Successful" });

        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ status:false,msg: 'Server error' });
    }
};

const VerifyEmail = async(req, res) => {
    const token = req.params.token;
    
    try {
    const usertoken = await Token.findOne({
        token,
        where: {
          user_id: req.params.id,
        },
      });
  
      //if token doesnt exist, send status of 400
      if (!usertoken) {
        return res.status(400).send({status:false,
          msg: "Your verification link may have expired. Please click on resend for verify your Email.",
        });
        //if token exist, find the user with that token
      } else {
        const user = await Users.findOne({ where: { id: req.params.id } });
        if (!user) {
          return res.status(401).send({status:false,
            msg: "We were unable to find a user for this verification. Please SignUp!",
          });
          //if user is already verified, tell the user to login
        } else if (user.isVerified) {
          return res
            .status(200)
            .send({status:true,
                user:user,msg:"User has been already verified. Please Login"});
          //if user is not verified, change the verified to true by updating the field
        } else {
          const updated = await Users.update(
            { isVerified: true },
            {
              where: {
                id: usertoken.user_id,
              },
            }
          );
          //if not updated send error message
          if (!updated) {
            return res.status(500).send({status:false, msg: err.message });
            //else send status of 200
          } else {
            return res
              .status(200)
              .send({status:true,
                user:user,msg:"Your account has been successfully verified"});
          }
        }
      }
    //   return res.redirect('/verification-success');
    } catch (error) {
      console.error(error);
      res.status(500).json({ status:false,msg: 'Internal server error' });
    }
}

const SaveRole = async(req,res) => {
    const { role,slug } = (req.body);    
    try {
        await Users.update({role: role},{
            where:{
                slug: slug
            }
        });
        const user = await Users.findOne({ where: { slug: slug } });
        return res.status(200).send({ status:true,user:user,msg:"Role saved Successfully" });

    } catch (error) {
        res.status(404).json({status:false,msg:"Something went wrong"});
    }
}

const AdditionalInformation = async(req,res) => {
    const { slug,buisness_name,buisness_address,buisness_license } = (req.body);    
    try {
        const user = await Users.findOne({ where: { slug: slug } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await user.update({
            buisness_name: buisness_name,
            buisness_address: buisness_address,
            buisness_license: buisness_license
        });
        return res.status(200).send({ status:true,msg:"Additional Info saved Successfully" });

    } catch (error) {
        res.status(404).json({status:false,msg:"Something went wrong"});
    }
}

const InviteTeam = async(req,res) => {
    const { slug,emails } = (req.body);    
    try {
        const user = await Users.findOne({ where: { slug: slug } });
        if (!user) {
            return res.status(404).json({ status:true,msg: 'User not found' });
        }
        await Promise.all(emails.map(async (email) => {
            await InviteTeams.create({
                email: email,
                user_id: user.id // Assuming you need to associate the invite with the user
            });

            // Sending email for each invite
            await sendingMail({
                from: "Carousel",
                to: email,
                subject: 'Join Us on Our Exciting New Website!',
                text:  {'username':`User`,url:`${process.env.APP_URL}`},
                html: { path: '/views/inviteTeam.html' }
            });
        }));
        const inviteTeam = await InviteTeams.findAll({ where: { user_id: user.id } });
        let inviteTeamData = '';
        if(inviteTeam){
            inviteTeamData = inviteTeam;
        }

        return res.status(200).send({ status:true,user:user,inviteTeamData, msg:"Invite team Successfully" });

    } catch (error) {
        res.status(404).json({status:false,msg:error.message});
    }
}

const Login = async(req, res) => {
    try {
        const user = await Users.findAll({
            where:{
                email: req.body.email
            }
        });
        const match = await bcrypt.compare(req.body.password, user[0].password);
        if(!match) return res.status(400).json({status:false,msg: "Wrong Password"});
        if(!user[0].isVerified) return res.status(400).json({status:false,msg: "Please verify your email address."});
        const inviteTeam = await InviteTeams.findAll({ where: { user_id: user[0].id } });
        let inviteTeamData = '';
        if(inviteTeam){
            inviteTeamData = inviteTeam;
        }
        const borrowerAdditionalData = await AdditionalInfo.findOne({ where: { user_id: user[0].id } });
        let  borrowerAdditionalInfo = ''
        if(borrowerAdditionalData){
            borrowerAdditionalInfo = borrowerAdditionalData
        }
        const borrowerVerifyData = await VerifyIdentity.findOne({ where: { user_id: user[0].id } });
        let  borrowerVerifyInfo = ''
        if(borrowerVerifyData){
            borrowerVerifyInfo = borrowerVerifyData
        }
        const userId = user[0].id;
        const name = user[0].name;
        const email = user[0].email;
        const accessToken = jwt.sign({userId, name, email}, process.env.ACCESS_TOKEN_SECRET,{
            expiresIn: '15s'
        });
        const refreshToken = jwt.sign({userId, name, email}, process.env.REFRESH_TOKEN_SECRET,{
            expiresIn: '1d'
        });
        await Users.update({refresh_token: refreshToken},{
            where:{
                id: userId
            }
        });
        res.cookie('refreshToken', refreshToken,{
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        return res.status(200).send({ status:true,accessToken,user:user[0],inviteTeamData,borrowerAdditionalInfo,borrowerVerifyInfo, msg:"Login Successfull" });
        // res.json({ accessToken });
    } catch (error) {
        res.status(404).json({status:false,msg:"Email not found"});
    }
}
function randomTokenString() {
    return crypto.randomBytes(40).toString('hex');
}
async function forgotPassword(req,res) {
    const { email } = (req.body);
    // var origin = req.get('host');
    var origin = `${process.env.APP_URL}`;
    const account = await Users.findOne({ where: { email } });

    // always return ok response to prevent email enumeration
    if(!account) return res.status(400).json({msg: "Email not found"});

    // create reset token that expires after 24 hours
    account.resetToken = randomTokenString();
    account.resetTokenExpires = new Date(Date.now() + 24*60*60*1000);
    await account.save();

    // send email
    await sendPasswordResetEmail(account, origin,res);
}

async function sendPasswordResetEmail(account, origin,res) {
    let message;
    if (origin) {
        const resetUrl = `${origin}reset-password/${account.resetToken}`;
        // const resetUrl = `${origin}/account/reset-password?token=${account.resetToken}`;
        message = resetUrl
        // message = `<p>Please click the below link to reset your password, the link will be valid for 1 day:</p>
        //            <p><a href="${resetUrl}">${resetUrl}</a></p>`;
    } else {
        message = account.resetToken;
        // message = `<p>Please use the below token to reset your password with the <code>/account/reset-password</code> api route:</p>
        //            <p><code>${account.resetToken}</code></p>`;
    }

    await sendingMail({
        from: "Carousel",
        to: account.email,
        subject: 'Reset Password',
        text: {'username':`${account.name}`,'message':`${message}`},
        html: { path: '/views/resetEmail.html' }

    });
    return res.status(200).send({ status:true,token:message, msg:"Reset Password Mal sent Successfull" });

}

async function resetPassword(req,res) {
    const { token, password } = (req.body);
    const account = await validateResetToken({ token });

    // update password and remove reset token
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    account.password = hashPassword;
    account.passwordReset = Date.now();
    account.resetToken = null;
    await account.save();
    return res.status(200).send({ status:true, msg:"Reset Password Successfull" });

}

async function validateResetToken({ token },res) {
    const account = await Users.findOne({
        where: {
            resetToken: token,
            // resetTokenExpires:  Date.now() 
        }
    });

    if (!account)  return res.status(400).json({status:false,msg: "Invalid token"});

    return account;
}
 
const Logout = async(req, res) => {
    const refreshToken = req.cookies.refreshToken;
    const token = req.cookies;
    if(!refreshToken) return res.status(204).send({ status: false, msg: "No refresh token provided" });
    const user = await Users.findAll({
        where:{
            refresh_token: refreshToken
        }
    });
    if(!user[0]) return res.status(204).send({ status: false, msg: "User not found with provided refresh token" });
    const userId = user[0].id;
    await Users.update({refresh_token: null},{
        where:{
            id: userId
        }
    });
    res.clearCookie('refreshToken');
    return res.status(200).send({status:true, msg:"Logout Successfull" });
    return res.sendStatus(200);
}

//BORROWER ADDITIONAL INFORMATION
const borrowerAdditionalInfo = async(req,res) => {
    const { slug,first_name,last_name,street_address,city,state,zip_code } = (req.body);    
    try {
        const user = await Users.findOne({ where: { slug: slug } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const randomSlug = generateRandomSlug(6); 
        /* const additionalData = await AdditionalInfo.findOne({ where: { user_id: user.id } });
        if (additionalData) {
            const additionalInfo = await AdditionalInfo.update({
                first_name: first_name,
                last_name: last_name,
                name: first_name+' '+last_name,
                street_address: street_address,
                city: city,
                state:state,
                zip_code:zip_code
            });
            return res.status(200).send({ status:true,msg:"Additional Info saved Successfully",additionalInfo });

        }else{ */
        const additionalInfo = await AdditionalInfo.create({
            user_id: user.id,
            first_name: first_name,
            last_name: last_name,
            name: first_name+' '+last_name,
            slug: randomSlug,
            street_address: street_address,
            city: city,
            state:state,
            zip_code:zip_code
        });
        return res.status(200).send({ status:true,msg:"Additional Info saved Successfully",additionalInfo });
        /* } */

    } catch (error) {
        res.status(404).json({status:false,msg:"Something went wrong"});
    }
}
//BORROWER VERIFY IDENTITY
const verifyIdentity = async(req,res) => {
    const { slug,dob,ssn,phone_number,email,userId,userToken,kbaToken } = (req.body);    
    try {
        const user = await Users.findOne({ where: { slug: slug } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const additionalInfo = await AdditionalInfo.findOne({ where: { user_id: user.id } });
        if (!additionalInfo) {
            return res.status(404).json({ message: 'Additional Info not found' });
        }

        const verifyIdentity = await VerifyIdentity.create({
            user_id: user.id,
            additional_info_id: additionalInfo.id,
            dob: dob,
            ssn: ssn,
            phone_number: phone_number,
            email: email,
            userId: userId,
            userToken: userToken,
            kbaToken: kbaToken,
        });
        return res.status(200).send({ status:true,msg:"Verify Identity saved Successfully",verifyIdentity });

    } catch (error) {
        res.status(404).json({status:false,msg:"Something went wrong"});
    }
}
//
// Assuming you have a function to retrieve registered email addresses from your database
const getRegisteredEmails = async () => {
    // Fetch registered email addresses from your database
    // For example:
    const registeredEmails = await Users.findAll({ attributes: ['email'] });
    return registeredEmails.map(user => user.email);
}
const checkEmail = async(req,res) => {
    const { email } = req.body;
    try {
      const registeredEmails = await getRegisteredEmails();
      // Check if the input email matches any of the registered email addresses
      const isSimilar = registeredEmails.includes(email);
      return res.status(200).send({ status:true,isSimilar });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({  status:false,error: 'Internal server error' });
    }
};
  
module.exports = {
    validation_result,
    validate,
    getUsers,
    getUser,
    Register,
    Login,
    VerifyEmail,
    resendVerifyEmail,
    SaveRole,
    AdditionalInformation,
    InviteTeam,
    forgotPassword,
    validateResetToken,
    resetPassword,
    borrowerAdditionalInfo,
    verifyIdentity,
    checkEmail,
    Logout
}