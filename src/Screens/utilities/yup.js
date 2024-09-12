import * as yup from "yup";

const pwdRegex = new RegExp(
  "^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})"
);

export default {
  // Validate User while create account
  validateUser() {
    let schema = yup.object().shape({
      phone_number: yup.string().required("Please enter your phone number"),
      zip_code: yup.string().required("Please enter your zip code"),
      // city: yup.string().required("Please enter your city"),
      // state: yup.string().required("Please enter your state"),
      // country: yup.string().required("Please enter your country name"),
      street_address: yup.string().required("Please enter your street address"),
      email_id: yup
        .string()
        .required("Required email address")
        .email("Please enter a valid email address"),
      last_name: yup.string().required("Please enter your last name"),
      first_name: yup.string().required("Please enter your first name"),
    });
    return schema;
  },
  ValidateBillingAddress() {
    let schema = yup.object().shape({
      phone_number: yup.string().required("Please enter your phone number"),
      zip_code: yup.string().required("Please enter your zip code"),
      // apartment: yup.string().required("Please enter your apartment name"),
      // city: yup.string().required("Please enter your city"),
      // state: yup.string().required("Please enter your state"),
      // country: yup.string().required("Please enter your country name"),
      street_address: yup.string().required("Please enter your street address"),
      email_id: yup
        .string()
        .required("Required email address")
        .email("Please enter a valid email address"),
      last_name: yup.string().required("Please enter your last name"),
      first_name: yup.string().required("Please enter your first name"),
    });
    return schema;
  },
  validateShippingAddress() {
    let schema = yup.object().shape({
      phone_number: yup.string().required("Please enter your phone number"),
      zip_code: yup.string().required("Please enter your zip code"),
      // apartment: yup.string().required("Please enter your apartment name"),
      // city: yup.string().required("Please enter your city"),
      // state: yup.string().required("Please enter your state"),
      // country: yup.string().required("Please enter your country name"),
      street_address: yup.string().required("Please enter your street address"),
      last_name: yup.string().required("Please enter your last name"),
      first_name: yup.string().required("Please enter your first name"),
    });
    return schema;
  },
  validateCard() {
    let schema = yup.object().shape({
      security_code: yup.string().required("Please enter cvv").min(3),
      expiration_date: yup.string().required("Please enter expiration date").min(7),
      card_number: yup.string().required("Please enter your card number").min(16),
      card_holder_name: yup.string().required("Please enter your name on the card"),
    });
    return schema;
  },
  // Verify account
  validateVerifyAccount() {
    let schema = yup.object().shape({
      verification_otp: yup.string().required("Please enter verification code"),
    });
    return schema;
  },
  // Verify account
  validateForgotPassword() {
    let schema = yup.object().shape({
      email_id: yup
        .string()
        .required("Required email address")
        .email("Please enter a valid email address"),
    });
    return schema;
  },

  // Verify account
  validateVerifyForgotPassword() {
    let schema = yup.object().shape({
      reset_password_otp: yup
        .string()
        .required("The verification code is required"),
    });
    return schema;
  },

  // Verify account
  validateActNumber() {
    let schema = yup.object().shape({
      act_number: yup.string().required(" is required"),
    });
    return schema;
  },

  validatePerformer() {
    let schema = yup.object().shape({
      performer_name: yup.string().required("Performer Name is required"),
    });
    return schema;
  },

  // Verify set password
  validateSetPassword() {
    let schema = yup.object().shape({
      confirm_password: yup
        .string()
        .required("Required confirm password")
        .matches(pwdRegex, "Invalid password"),
      password: yup
        .string()
        .required("Required password")
        .matches(pwdRegex, "Invalid password"),
    });
    return schema;
  },

  // Verify set password
  validateQuantityAndStudio() {
    let schema = yup.object().shape({
      studio_name: yup.string().required("Required studio name"),
      package_quantity: yup.string().required("Required quantity"),
    });
    return schema;
  },

  // Verify set password
  validateEventSearch() {
    let schema = yup.object().shape({
      start_date: yup.string().required("Required date"),
      event_id: yup.string().required("Required event name"),
      producer_id: yup.string().required("Required producer name"),
    });
    return schema;
  },

  // Verify set password
  validateCreditCard() {
    let schema = yup.object().shape({
      start_date: yup.string().required("Required date"),
      event_id: yup.string().required("Required event name"),
      producer_id: yup.string().required("Required producer name"),
    });
    return schema;
  },

  // Verify login
  validateLogin() {
    let schema = yup.object().shape({
      password: yup
        .string()
        .required("Required password")
        .matches(pwdRegex, "Invalid password"),

      email_id: yup
        .string()
        .required("Required email address")
        .email("Please enter a valid email address"),
    });
    return schema;
  },

  credential(email, password) {
    let schema = yup.object().shape({
      password: yup
        .string()
        .required("Your password is required.")
        .matches(pwdRegex, "Your password is not valid."),
      email: yup
        .string()
        .required("The email address is required.")
        .email("The email address is not valid"),
    });

    return schema;
  },
  email() {
    let schema = yup.object().shape({
      email: yup
        .string()
        .required("The email address is required.")
        .email("The email address is not valid"),
    });

    return schema;
  },
  vcode(value) {
    let schema = yup.object().shape({
      code: yup
        .number()
        .min(100000)
        .max(999999)
        .required("The verification code is required."),
    });

    return schema;
  },
};
