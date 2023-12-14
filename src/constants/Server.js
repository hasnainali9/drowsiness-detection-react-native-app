const BASE_URL="https://drowsinessdetector.tech/api"
const DETECTION_URL="http://20.11.16.238"

export default SERVER ={
    GOOGLE_MAP_KEY:"AIzaSyBSyIcZejKyhF-3psZI-ICFTPik9pq-Zjo",
    DEMO_MODE:false,
    BASE_URL:BASE_URL,
    DETECTION_URL:DETECTION_URL,
    RECORDING_PROCESSING_URL:`${DETECTION_URL}/detect_drowsiness`,
    LOGIN_URL:`${BASE_URL}/user/login`,
    SIGNUP_URL:`${BASE_URL}/user/register`,
    USER_PROFILE:`${BASE_URL}/user/profile`,
    UDATE_USER_PROFILE:`${BASE_URL}/user/profile/update/account`,
    UDATE_USER_PASSWORD_PROFILE:`${BASE_URL}/user/profile/update/password`,
    DELETE_USER_PROFILE:`${BASE_URL}/user/profile/request/delete`,
    FAQS_LIST:`${BASE_URL}/user/settings/faqs`,
    ABOUT_US:`${BASE_URL}/user/settings/aboutus`,
    TERMS:`${BASE_URL}/user/settings/terms`,
    PRIVACY:`${BASE_URL}/user/settings/privacy`,
    SOS:{
        LIST:`${BASE_URL}/user/sos`,
        CREATE:`${BASE_URL}/user/sos`,
        UPDATE:`${BASE_URL}/user/sos`,
        DELETE:`${BASE_URL}/user/sos`,
    },
    RideRequest:{
        LIST:`${BASE_URL}/user/ride/request`,
        CREATE:`${BASE_URL}/user/ride/request`,
        UPDATE:`${BASE_URL}/user/ride/request`,
        DELETE:`${BASE_URL}/user/ride/request`,
        DETECTION:`${BASE_URL}/user/ride/request/drownies/detect`,

    },
}