import * as Realm from "realm-web";

export const getDatabase = async (app: any) => {
    if (!app.currentUser) {
        await app.logIn(Realm.Credentials.anonymous());
    }
    return await app.currentUser?.mongoClient("mongodb-atlas");
}

export const testEmail = (email: string) => {
	let regex = /^[\w\d\._]+@[a-zA-Z_]+?\.[a-zA-Z]{2,20}$/;

	if (!regex.test(email)) {
		return false;
	}

	return true;
};

export const isPropertyNullOrUndefinedOrEmpty = (obj: any, key: string): boolean => {
	if (!(key in obj) || typeof obj[key] == "undefined") {
		return true;
	}
	if (obj[key] === 0) {
		return false;
	}

	return false;
};

export const convertStringToInt = (param: string | number): number => {
	let value = param;
    let intValue: number;
	if (typeof value === "string") {
		value = value.replace(",", "");
		intValue = parseFloat(value);
        return intValue;
	}
	return value;
};

export const handleAuthenticationError = (err: any): string => {
	let errorMessage = "";
	const handleUnknownError = () => {
        errorMessage = "Something went wrong with a Realm login or signup request.";
		console.warn(errorMessage);
	};
    
    const { error, statusCode } = err;
    const errorType = statusCode || error;

    switch (errorType) {
        case 401:
            // Invalid password
            errorMessage = "Invalid Username/Password";
            break;
        case "name already in use":
        case 409:
            // Email is already registered
            errorMessage = "Email already in use";
            break;
        case "password must be between 6 and 128 characters":
        case 400:
            // Invalid password - must be between 6 and 128 characters
            errorMessage = "Password must be between 6 and 128 characters";
            break;
        default:
            // In theory you won't ever hit this default, but if an error message/code without a case ever comes up it will fall back to this.
            handleUnknownError();
            break;
    }
	
	return errorMessage;
};
