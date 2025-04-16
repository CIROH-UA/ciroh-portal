import ReCAPTCHA from "react-google-recaptcha";
import useRecaptcha from './useRecaptcha';


export default function Captcha() {
  const { recaptchaRef, handleRecaptcha } = useRecaptcha();
  return (
      <ReCAPTCHA
        ref={recaptchaRef}
        sitekey="6LeJ3xkrAAAAAIjntSFWy7lv0mRgR0WHBBs6qp56"
        onChange={handleRecaptcha}
      />
  );
}
