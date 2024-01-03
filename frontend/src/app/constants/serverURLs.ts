export class ServerURLs {
    public static readonly _MAIN = "http://localhost:5191/api/";
    public static readonly _AUTH = "http://localhost:5191/api/";

    public static readonly AUTH_LOGIN = this._AUTH + "Auth/Login";
    public static readonly AUTH_LOGIN_GOOGLE = this._AUTH + "Auth/LoginWithGoogle";
    public static readonly AUTH_LOGIN_FACEBOOK = this._AUTH + "Auth/LoginWithFacebook";
    public static readonly AUTH_REGISTER = this._AUTH + "Auth/CreateUser";
    public static readonly AUTH_REFRESH_TOKEN = this._AUTH + "Auth/RefreshToken/";
    public static readonly AUTH_LOGOUT = this._AUTH + "Auth/Logout";

    public static readonly CATEGORY_GET_ALL = this._MAIN + "Category";

    public static readonly EVENT_GET_ALL = this._MAIN + "Event/";
    public static readonly EVENT_CREATE = this._MAIN + "Event/create";

    public static readonly FILE_GET_ORGANISATION_LOGO = this._MAIN + "File/organisation/";
    public static readonly FILE_GET_EVENT_LOGO = this._MAIN + "File/event/";

    public static readonly ORGANISATION_GET_ALL = this._MAIN + "Organisation/";
    public static readonly ORGANISATION_CREATE = this._MAIN + "Organisation/create";
    public static readonly ORGANISATION_GET_BY_ID = this._MAIN + "Organisation/";

    public static readonly USER_GET_BY_ID = this._MAIN + "User/Get/";
    public static readonly USER_UPDATE = this._MAIN + "User/Update";

    public static readonly ROLE_GET_BY_USER_AND_ORG = this._MAIN + "Role/Get/";
    public static readonly ROLE_GET_ALL_BY_ORG = this._MAIN + "Role/GetAllForOrganisation/";
}
