const nodemailer = require("nodemailer");
var handlebars = require('handlebars');
var fs = require('fs');
var path = require("path");

module.exports.sendingMail = async({from, to, subject, text,html}) =>{

  try {
    var parentDir = path.normalize(__dirname+"/..");
    var readHTMLFile = function(path, callback) {
    fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
        if (err) {
           callback(err);                 
        }
        else {
            callback(null, html);
        }
      });
    };
  //asign createTransport method in nodemailer to a variable
  //service: to determine which email platform to use
  //auth contains the senders email and password which are all saved in the .env
  const Transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 587,
      // service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    readHTMLFile(parentDir + html.path, function(err, html) {
      if (err) {
         console.log('error reading file', err);
         return;
      }
      var template = handlebars.compile(html);
      var replacements = {
           username: text.username ?? '',
           url: text.url ?? '',
           email: text.email ?? '',
           message: text.message ?? ''

      };
      var htmlToSend = template(replacements);
      var mailOptions = {
          from: from,
          to : to,
          subject : subject,
          html : htmlToSend
       };
       return Transporter.sendMail(mailOptions) 
  });
      //return the Transporter variable which has the sendMail method to send the mail
      //which is within the mailOptions
    // return await Transporter.sendMail(mailOptions) 
  } catch (error) {
    console.log(error)
  }
    
}

