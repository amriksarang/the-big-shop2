import React, {useEffect, useState, useRef } from 'react';
import { FormData } from '../../interfaces/Forms';
import { v4 as uuid } from 'uuid';



const FormEditor: React.FC<FormData> = ({showCancel=true, formVisible=true, isAddAddress = false, keysAndLabels, data = null, skipFields, handleSubmit, handleCancel = () => {}, deleteOption = false}) => {
    const [formData, setFormData] = useState<any>(null);
    const [formErrors, setFormErrors] = useState<{}>(null!);
    const [editableFormData, setEditableFormData] = useState(null);
    const [itemNumberInArray, setItemNumberInArray] = useState<number>(null!);
    const [isEditDone, setIsEditDone] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const ref = useRef<HTMLFormElement | null>(null);

    const setUpEditFormData =  (index: number) => {
        setItemNumberInArray(index);
        setEditableFormData(formData[index]);
        setShowForm(true);
    }

    const initializeEMptyFormData = () => {       
        let obj: any = {};
        Object.keys(keysAndLabels).forEach(key => obj[key] = "");
        setEditableFormData(obj);
    }


    useEffect(() => {
        if(!formVisible){
            setShowForm(false);
        }else if(isAddAddress || (data instanceof Array && data.length === 0) || !data ){
            
            initializeEMptyFormData();
            setShowForm(true);
        }else{
            setShowForm(false);
        }
        setFormData(data);        
    }, [data, isAddAddress]);

    useEffect(() =>{
        if(isEditDone){
            handleSubmit(formData);
            setIsEditDone(false);
        }

    }, [formData]);


    const handleField = (e: React.ChangeEvent, k: string) => {
        setEditableFormData({...editableFormData as any, [k]: (e.target as HTMLInputElement).value})
    }

    useEffect(() => {
        if(isEditDone){
            let array = formData?.filter((item: any, index: number) => index !== itemNumberInArray);
            if(formData && itemNumberInArray >= 0 ) {// itemNumberInArray can be null which means this is the initial run of useEffect on first load
                if(editableFormData){
                    setFormData([...array, editableFormData]);
                } else {
                    setFormData(array);
                }
            }else if(formData){
                setFormData([...array, editableFormData]);
            }else{
                setFormData([editableFormData]);
            }

            setItemNumberInArray(null!);
            setEditableFormData(null);
        }
            
    },[isEditDone]);

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if(!handleFormErrors(setFormErrors))
            return;

            if(!formData ){//No form data was sent to this component. It means we have to create a new address and then its ID
                const id = uuid();
                setEditableFormData({...editableFormData as any, _id: id});
            }
            setIsEditDone(true);
            setShowForm(false);
    }

    const handleFormErrors = (callback: React.Dispatch<{}>) => {
        const form: HTMLFormElement = ref.current!;
        const errors: any = {};
        for(let i = 0; i < form.elements.length; i++){
            let element = form.elements[i] as HTMLFormElement
            if(element.type === "text") {
                if(element.value.trim() === "")
                    errors[element.id] = true;
            }
        };
        callback(errors);
        
        if(Object.keys(errors).length > 0)
            return false;
        else
            return true;

    }

    const cancelEdit = (e: React.UIEvent) => {
        e.preventDefault()
        setItemNumberInArray(null!);
        setEditableFormData(null);
        setShowForm(false);
        handleCancel();
    }

    const deleteFormItem = (index: number) => {
        setItemNumberInArray(index);
        setEditableFormData(null);
        setIsEditDone(true);
    }

    return <>
        
        {
           !isAddAddress && formData?.map( (item: any, index: number) => itemNumberInArray !== index && <div className="user-details" key={index}>
            <div className='user-addresses'>
                {
                    Object.entries(item).map( ([key, val ]) => 
                        key !== skipFields[key] && <p className="user-address-field">{keysAndLabels[key]}: {val}</p>
                    )
                }
            </div>
            <button className='button' onClick={(e) => setUpEditFormData(index)}>Edit</button>
            {deleteOption && <button className='button' onClick={(e) => deleteFormItem(index)}>Delete</button>}
        </div>)
        }
        
        {
            showForm && (<form ref={ref} className="user-detail-form">
            {
                editableFormData && Object.entries(editableFormData)?.map( 
                    ([key, val]: any[]) => 
                    key !== skipFields[key] && (<div className='form-item' key={key}>
                       
                        <label htmlFor={key} >{keysAndLabels[key]}</label>
                        <div>
                        <input id={key} type="text" value={val} onChange={(e: React.ChangeEvent) => handleField(e, key)} /><br/>
                        {(formErrors as any)?.[key] ? <p className="form-error-field">Required Field</p> : ""}
                        </div>
                    </div>)
                )
            }
            <button className='button' onClick={handleFormSubmit} style={{marginLeft: 0}} >Save</button>
            {showCancel && <button className='button' onClick={cancelEdit} style={{marginLeft: 0}}>Cancel</button>}
            </form>)
        }
    </>


}

export default FormEditor;
