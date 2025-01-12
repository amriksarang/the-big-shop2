import { GeneralObject } from "./User"
export interface FormData{
    keysAndLabels?: any , 
    isAddAddress?: Boolean,
    data?: any, 
    skipFields: any, 
    handleSubmit: (data: GeneralObject<any>) => void,
    handleCancel?: () => void, 
    deleteOption?: Boolean,
    formVisible?: Boolean,
    showCancel?: Boolean
}
