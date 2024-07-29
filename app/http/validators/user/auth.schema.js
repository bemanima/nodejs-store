const Joi = require("@hapi/joi");

const getOtpSchema = Joi.object({
  mobile: Joi.string()
    .length(11)
    .pattern(/^09[0-9]{9}$/)
    .error(new Error("شماره موبایل وارد شده نادرست است.")),
});
const checkOtpSchema = Joi.object({
  mobile: Joi.string()
    .length(11)
    .pattern(/^09[0-9]{9}$/)
    .error(new Error("شماره موبایل وارد شده نادرست است.")),

  code: Joi.string()
    .min(4)
    .max(5)
    .error(new Error("کد ارسال شده صحیح نمیباشد.")),
});

module.exports = { getOtpSchema, checkOtpSchema };
