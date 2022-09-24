import * as Yup from 'yup';

const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const resourceSchema = Yup.object().shape({
    name: Yup.string().min(2).max(200).required('Name is Required'),
    headline: Yup.string().min(2).max(200).required('Headline is Required'),
    description: Yup.string(2).min(3),
    logo: Yup.string().min(2).max(255).required('Logo is Required'),
    resourceCategoryId: Yup.number().max(200).required('Resource Category is Required'),
    orgId: Yup.number().max(200).required('Organization ID is Required'),
    contactName: Yup.string().min(2).max(200).required('Contact name is Required'),
    contactEmail: Yup.string().min(2).email('Enter a valid email').max(50).required('Required'),
    phone: Yup.string()
        .required('required')
        .matches(phoneRegExp, 'Phone number is not valid')
        .min(10, 'Too short')
        .max(10, 'Too long'),
});

export default resourceSchema;
