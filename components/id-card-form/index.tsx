"use client";

import { useState } from "react";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { CiCalendarDate } from "react-icons/ci";
import { FaCity, FaRegAddressBook } from "react-icons/fa";
import { MdOutlineRealEstateAgent } from "react-icons/md";
import { TbZip } from "react-icons/tb";

import TextField from '../text-field';
import CheckBox from "../checkBox";
import Button from "../button";
import { IDDetails, setIdDetails } from "@/redux/slices/drugTest";
import { IDSchema } from "@/utils/validations";

const IDCardForm = () => {
    const dispatch = useDispatch();
    const router = useRouter();

    const [checked, setChecked] = useState(false);

    const initialValues: IDDetails = {
        first_name: "",
        last_name: "",
        date_of_birth: "",
        address: "",
        city: "",
        state: "",
        zipcode: "",
    }

    const handleCheck = () => {
        setChecked(!checked)
    };

    const onSubmit = async (values: IDDetails) => {
        try {
            dispatch(setIdDetails(values));
            router.push('/identity-profile/sample-facial-capture');
        } catch (error) {
            toast.error("Something went wrong");
            console.error(error);
        }
    };
    return (
        <div className="test-items-wrap-desktop_" style={{ background: 'white', height: '100%' }}>
            <Formik
                initialValues={initialValues}
                validationSchema={IDSchema}
                onSubmit={onSubmit}
            >
                {({ values, errors, touched, isSubmitting }) => (
                    <Form>
                        <TextField
                            type="text"
                            placeholder="First name"
                            value={values.first_name}
                            startIcon={
                                <Image
                                    src="/icons/user.svg"
                                    alt="image"
                                    width={24}
                                    height={24}
                                    loading="lazy"
                                />
                            }
                            name="first_name"
                            errors={errors}
                            touched={touched}
                        />
                        <TextField
                            type="text"
                            placeholder="Last Name"
                            value={values.last_name}
                            startIcon={
                                <Image
                                    src="/icons/user.svg"
                                    alt="image"
                                    width={24}
                                    height={24}
                                    loading="lazy"
                                />
                            }
                            name="last_name"
                            errors={errors}
                            touched={touched}
                        />
                        <TextField
                            type="text"
                            placeholder="Date of Birth"
                            value={values.date_of_birth}
                            startIcon={<CiCalendarDate color="#009cf9" size={24} />}
                            name="date_of_birth"
                            errors={errors}
                            touched={touched}
                        />
                        <TextField
                            type="text"
                            placeholder="Address"
                            value={values.address}
                            startIcon={<FaRegAddressBook color="#009cf9" size={24} />}
                            name="address"
                            errors={errors}
                            touched={touched}
                        />
                        <TextField
                            type="text"
                            placeholder="City"
                            value={values.city}
                            startIcon={<FaCity color="#009cf9" size={24} />}
                            name="city"
                            errors={errors}
                            touched={touched}
                        />
                        <TextField
                            type="text"
                            placeholder="State"
                            value={values.state}
                            startIcon={<MdOutlineRealEstateAgent color="#009cf9" size={24} />}
                            name="state"
                            errors={errors}
                            touched={touched}
                        />
                        <TextField
                            type="text"
                            placeholder="Zipcode"
                            value={values.zipcode}
                            startIcon={<TbZip color="#009cf9" size={24} />}
                            name="zipcode"
                            errors={errors}
                            touched={touched}
                        />
                        <div className="check-wrap">
                            <div>
                                <CheckBox
                                    label={"I confirm that the information supplied above is correct and matches what is on my government issued ID."}
                                    checked={checked}
                                    onChange={handleCheck}
                                />
                            </div>
                        </div>
                        <Button blue disabled={!checked} type="submit" style={{ width: '12rem', height: '3rem' }}>
                            {!checked ? "Please Confirm..." : "Confirm"}
                        </Button>
                    </Form>
                )}
            </Formik>
        </div>
    )
};

export default IDCardForm;