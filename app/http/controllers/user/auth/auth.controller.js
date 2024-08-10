const createHttpError = require("http-errors");
const {
  getOtpSchema,
  checkOtpSchema,
} = require("../../../validators/user/auth.schema");
const {
  randomNumberGenerator,
  signAccessToken,
  verifyRefreshToken,
  signRefreshToken,
} = require("../../../../utils/functions");
const { EXPIRES_IN, USER_ROLE } = require("../../../../utils/constants");
const Controller = require("../../controller");
const { UserModel } = require("../../../../models/users");

class UserAuthController extends Controller {
  async getOtp(req, res, next) {
    try {
      await getOtpSchema.validateAsync(req.body);
      const { mobile } = req.body;
      const code = randomNumberGenerator();
      const result = await this.saveUser(mobile, code);

      if (!result) throw createHttpError.Unauthorized("ورود شما انجام نشد");
      return res.status(200).send({
        data: {
          statusCode: 200,
          message: "کد اعتبارسنجی برای شما با موفقیت ارسال شد",
          code,
          mobile,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async checkOtp(req, res, next) {
    try {
      await checkOtpSchema.validateAsync(req.body);
      const { mobile, code } = req.body;

      const user = await UserModel.findOne({ mobile });

      if (!user)
        throw createHttpError.NotFound("کاربری با این مشخصات وجود ندارد.");
      console.log(user.otp.code, code);
      if (user.otp.code !== Number(code))
        throw createHttpError.Unauthorized("کد ارسال شده صحیح نمیباشد.");

      const now = Date.now();

      if (Number(user.otp.expiresIn) < now)
        throw createHttpError.Unauthorized("کد شما منقضی شده است");

      const accessToken = await signAccessToken(user._id);
      const refreshToken = await signRefreshToken(user._id);
      return res.json({
        data: {
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const mobile = await verifyRefreshToken(refreshToken);
      const user = await UserModel.findOne({ mobile });
      const accessToken = await signAccessToken(user._id);
      const newRefreshToken = await signRefreshToken(user._id);

      return res.json({
        data: {
          accessToken,
          refreshToken: newRefreshToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async saveUser(mobile, code) {
    const otp = {
      code,
      expiresIn: EXPIRES_IN,
    };
    console.log(otp);
    const result = await this.checkExistUser(mobile);

    if (result) {
      return !!(await this.updateUser(mobile, otp));
    }
    return !!(await UserModel.create({
      mobile,
      otp,
      roles: [USER_ROLE],
    }));
  }

  async checkExistUser(mobile) {
    const user = await UserModel.findOne({ mobile });
    return !!user;
  }

  async updateUser(mobile, objectData = {}) {
    Object.keys(objectData).keys((key) => {
      if (["", " ", "0", 0, null, undefined, NaN].includes(objectData[key]))
        delete objectData[key];
    });

    const updateResult = await UserModel.updateOne(
      {
        mobile,
      },
      {
        $set: {
          otp: objectData,
        },
      }
    );

    return !!updateResult.modifiedCount;
  }
}

module.exports = {
  UserAuthController: new UserAuthController(),
};
