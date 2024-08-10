const {
  UserAuthController,
} = require("../../http/controllers/user/auth/auth.controller");

const router = require("express").Router();
/**
 * @swagger
 * tags:
 *  name: UserAuth
 *  description: User auth routes
 *
 * /user/get-otp:
 *    post:
 *          summary: Get user phone and send otp code
 *          description: One time password (OTP)
 *          tags: [UserAuth]
 *          parameters:
 *          -           name: mobile
 *                      description: fa-IRI phoneNumber
 *                      in: formData
 *                      required: true
 *                      type: string
 *                      value: ""
 *          responses:
 *                    '201':
 *                        description: Success
 *                    '400':
 *                        description: Bad request
 *                    '401':
 *                        description: Unauthorization
 *                    '500':
 *                        description: Internal server error
 *
 * /user/check-otp:
 *    post:
 *          summary: Check user otp and generate token
 *          description: Generate token
 *          tags: [UserAuth]
 *          parameters:
 *          -           name: mobile
 *                      description: fa-IRI phoneNumber
 *                      in: formData
 *                      required: true
 *                      type: string
 *                      value: ""
 *          -           name: code
 *                      description: Otp code
 *                      in: formData
 *                      required: true
 *                      type: string
 *                      value: ""
 *          responses:
 *                    '201':
 *                        description: Success
 *                    '400':
 *                        description: Bad request
 *                    '401':
 *                        description: Unauthorization
 *                    '500':
 *                        description: Internal server error
 * /user/refresh-token:
 *    post:
 *          summary: Send refresh token for get new token and refresh token
 *          description: Generate refresh token
 *          tags: [UserAuth]
 *          parameters:
 *          -           in: body
 *                      required: true
 *                      type: string
 *                      name: refreshToken
 *          responses:
 *              200:
 *                    description: success
 */
router.post("/get-otp", UserAuthController.getOtp);
router.post("/check-otp", UserAuthController.checkOtp);
router.post("/refresh-token", UserAuthController.refreshToken);

module.exports = {
  UserAuthRoutes: router,
};
