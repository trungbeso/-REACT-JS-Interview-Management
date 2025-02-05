import {
  faEraser,
  faRotateLeft,
  faSave,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';

import { useEffect, useState } from 'react';
import { DepartmentService } from '../../../services/department.service.ts';
import { RoleService } from '../../../services/role.service.ts';
import {
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
} from '@mui/material';
import { toast } from 'react-toastify';
import { EmployeeService } from '../../../services/employee.service.ts';

function CreateEmployee({ item, cancel }: { item: any; cancel: any }) {
  const [departments, setDepartment] = useState([]);
  const [roles, setRoles] = useState([]);
  const [gender, setGender] = useState([
    { value: true, label: 'Male' },
    { value: false, label: 'Female' },
  ]);
  const [active, setActive] = useState([
    { value: true, label: 'Active' },
    { value: false, label: 'InActive' },
  ]);

  useEffect(() => {
    async function fetchData() {
      try {
        const departmentsData = await DepartmentService.getAll();
        const rolesData = await RoleService.getAll();

        setDepartment(departmentsData);
        setRoles(rolesData);
      } catch (e) {
        console.error('Error during fetchData:', e);
        toast.error('Error during get user data !');
      }
    }
    fetchData();
  }, []);


  const initialValues = {
    fullName: item && item.fullName ? item.fullName : '',
    phoneNumber: item && item.phoneNumber ? item.phoneNumber : '',
    email: item && item.email ? item.email : '',
    departmentId: item && item.departmentId ? item.departmentId : '',
    roleIds: item && item.roleIds ? item.roleIds : [],
    dateOfBirth: item && item.dateOfBirth? item.dateOfBirth : '',
    address: item && item.address ? item.address : '',
    gender: item && item.gender ? item.gender : true,
    active: item && item.active ? item.active : true,
  };


  const validationSchema = Yup.object({
    fullName: Yup.string()
      .required('Name is required')
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must be at most 50 characters'),
    phoneNumber: Yup.string()
      .matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g, 'Your Phone Number Not Valid')
      .required('Phone Number is required')
      .max(15, 'Your Phone Number Is Way Too Long'),
    email: Yup.string()
      .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g, 'Your Email Not Valid')
      .required('Email is required')
      .max(100, 'Email is required'),
    departmentId: Yup.string().required('Department is required'),
    roleIds: Yup.array().min(0, 'role not null'),
    dateOfBirth: Yup.string().required('Date of birth is required'),
    address: Yup.string().required('Address is required'),
    gender: Yup.string().required('Gender is required'),
    active: Yup.string().required('Status is required'),
  });

  const onSubmit = async (values: any) => {
    const data = { ...values, gender: values.gender === 'true' };

    try {
      if (item) {
        const response = await EmployeeService.update(item.id, values);

        if (response) {
          cancel();
          toast.success('User information have been updated !');
        } else {
          alert('Failed to update');
          toast.error('Failed to update User information !');
        }
      } else {
        const response = await EmployeeService.create(values);

        if (response) {
          cancel();
          toast.success('New user have been created !');
        } else {
          alert('Failed to create');
          toast.error('Failed to create User information !');
        }
      }
    } catch (e) {
      console.error('Error during saveEmployee:', e);
      toast.error('Failed to save user information !');
    }
  };

  return (
    <section>
      {/* Search */}
      <div className="card border border-slate-300 rounded-md">
        <div className="card-header p-3">
          <h1 className="text-2xl font-bold">
            {item ? 'Edit' : 'Create'} Employee
          </h1>
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          <Form>
            <div className="card-body border-y border-slate-200 p-6 ">
              {/*---*/}
              <div className="flex justify-between gap-20 mb-4">
                <div className="form-group w-full ">
                  <label htmlFor="fullName" className="block mb-2 space-x-2">
                    Full Name&nbsp;<i className="text-red-600 text-xl">*</i>
                  </label>
                  <Field
                    name="fullName"
                    className="w-full p-2 border border-slate-400 rounded-md bg-gray-100 placeholder:text-black dark:bg-gray-600 dark:placeholder:text-gray-100 placeholder:text-md"
                    type="text"
                    id="fullName"
                    placeholder="Enter Your Full Name"
                  />
                  <ErrorMessage
                    name="fullName"
                    component="div"
                    className="text-red-500"
                  />
                </div>
                {/*---*/}
                {item && (
                  <div className="form-group w-full ">
                    <label htmlFor="fullName" className="block mb-2 space-x-2">
                      Password&nbsp;<i className="text-red-600 text-xl">*</i>
                    </label>
                    <Field
                      name="password"
                      className="w-full p-2 border border-slate-400 rounded-md bg-gray-100 dark:bg-gray-600 dark:placeholder:text-gray-100 placeholder:text-md"
                      type="text"
                      id="password"
                      placeholder="Enter Your Password"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                )}
                {/*---*/}

                <div className="form-group w-full ">
                  <label htmlFor="email" className="block mb-2 space-x-2">
                    Email&nbsp;<i className="text-red-600 text-xl">*</i>
                  </label>
                  <Field
                    name="email"
                    className="w-full p-2 border border-slate-400 rounded-md bg-gray-100 placeholder:text-black  dark:bg-gray-600 dark:placeholder:text-gray-100 placeholder:text-md"
                    type="email"
                    id="email"
                    placeholder="Enter Your Email"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500"
                  />
                </div>
              </div>
              {/*---*/}
              <div className="flex justify-between gap-20 mb-4">
                <div className="form-group w-full ">
                  <label htmlFor="phoneNumber" className="block mb-2 space-x-2">
                    Phone Number&nbsp;
                    <i className="text-red-600 text-xl">*</i>
                  </label>
                  <Field
                    name="phoneNumber"
                    className="w-full p-2 border border-slate-400 rounded-md bg-gray-100 placeholder:text-black  dark:bg-gray-600 dark:placeholder:text-gray-100"
                    type="text"
                    id="phoneNumber"
                    placeholder="Enter Your Phone Number"
                  />
                  <ErrorMessage
                    name="phoneNumber"
                    component="div"
                    className="text-red-500"
                  />
                </div>
                {/*---*/}
                <div className="form-group w-full ">
                  <label
                    htmlFor="departmentId"
                    className="block mb-2 space-x-2"
                  >
                    Department&nbsp;<i className="text-red-600 text-xl">*</i>
                  </label>
                  <Field
                    as="select"
                    name="departmentId"
                    className="w-full p-3 border border-slate-400 rounded-md bg-gray-100 placeholder:text-black  dark:bg-gray-600 dark:placeholder:text-gray-100 placeholder:text-md"
                    id="departmentId"
                  >
                    <option value="">Choose A Department</option>
                    {departments?.map((department) => (
                      <option key={department.id} value={department.id}>
                        {department.name}
                      </option>
                    ))}
                    ;
                  </Field>

                  <ErrorMessage
                    name="departmentId"
                    component="div"
                    className="text-red-500"
                  />
                </div>
              </div>
              {/*---*/}
              <div className="flex justify-between gap-20 mb-4 ">
                <div className="form-group w-full">
                  <label htmlFor="role" className="block space-x-2">
                    Role&nbsp;<i className="text-red-600 text-xl">*</i>
                  </label>
                  <FormControl fullWidth variant="outlined" margin="normal">
                    <Field
                      as={Select}
                      name="roleIds"
                      labelId="role-label"
                      multiple
                      className="bg-gray-100 text-black dark:bg-gray-700 dark:text-white"
                      sx={{
                        '& .MuiSelect-select': {
                          backgroundColor: 'inherit',
                          color: 'inherit',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#94A3B8',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#94A3B8',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#94A3B8',
                        },
                      }}
                    >
                      {roles?.map((role) => (
                        <MenuItem
                          key={role.id}
                          value={role.id}
                          className="text-white"
                        >
                          {role.name}
                        </MenuItem>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="roleIds"
                      component={FormHelperText}
                      className="text-red-500"
                    />
                  </FormControl>
                </div>
                {/*---*/}
                <div className="form-group w-full ">
                  <label
                    htmlFor="dateOfBirth"
                    className="block mb-2 space-x-2 py-1"
                  >
                    Date Of Birth&nbsp;
                    <i className="text-red-600 text-xl">*</i>
                  </label>
                  <Field
                    name="dateOfBirth"
                    className="w-full p-3 border border-slate-400 rounded-md bg-gray-100 placeholder:text-black  dark:bg-gray-600 dark:placeholder:text-gray-100 placeholder:text-md"
                    type="date"
                    id="dateOfBirth"
                  />
                  <ErrorMessage
                    name="dateOfBirth"
                    component="div"
                    className="text-red-500"
                  />
                </div>
              </div>
              {/*---*/}
              <div className="flex justify-between gap-20 mb-4">
                <div className="form-group w-full ">
                  <label htmlFor="address" className="block mb-2 space-x-2">
                    Address&nbsp;
                    <i className="text-red-600 text-xl">*</i>
                  </label>
                  <Field
                    name="address"
                    className="w-full p-2 border border-slate-400 rounded-md bg-gray-100 placeholder:text-black  dark:bg-gray-600 dark:placeholder:text-gray-100 placeholder:text-md"
                    type="text"
                    id="address"
                    placeholder="Enter Your Address"
                  />
                  <ErrorMessage
                    name="address"
                    component="div"
                    className="text-red-500"
                  />
                </div>
                {/*---*/}
                <div className="form-group w-full ">
                  <label htmlFor="gender" className="block mb-2 space-x-2">
                    Gender&nbsp;<i className="text-red-600 text-xl">*</i>
                  </label>
                  <Field
                    as="select"
                    name="gender"
                    className="w-full p-2 border border-slate-400 rounded-md bg-gray-100 placeholder:text-black  dark:bg-gray-600 dark:placeholder:text-gray-100 placeholder:text-md"
                    id="gender"
                  >
                    <option value="">Choose Gender</option>
                    {gender?.map((gender) => (
                      <option key={gender.value} value={gender.value}>
                        {gender.label}
                      </option>
                    ))}
                    ;
                  </Field>
                  <ErrorMessage
                    name="gender"
                    component="div"
                    className="text-red-500"
                  />
                </div>
                <div className="form-group w-full ">
                  <label htmlFor="active" className="block mb-2 space-x-2">
                    Status&nbsp;<i className="text-red-600 text-xl">*</i>
                  </label>
                  <Field
                    as="select"
                    name="active"
                    className="w-full p-2 border border-slate-400 bg-gray-100 rounded-md dark:bg-gray-600 dark:placeholder:text-gray-100 placeholder:text-md"
                    id="active"
                  >
                    <option value="">Choose Status</option>
                    {active?.map((active) => (
                      <option key={active.value} value={active.value}>
                        {active.label}
                      </option>
                    ))}
                    ;
                  </Field>
                  <ErrorMessage
                    name="active"
                    component="div"
                    className="text-red-500"
                  />
                </div>
              </div>
              {/*  end card body */}
            </div>
            <div className="card-footer p-3 flex justify-between text-white">
              <button
                type="button"
                onClick={cancel}
                className="p-2 px-4 bg-slate-100 hover:bg-slate-300 text-black rounded-full"
              >
                <FontAwesomeIcon icon={faRotateLeft} className="mr-2" />
                Cancel
              </button>
              <div className="search-actions space-x-3">
                <button
                  type="reset"
                  className="p-2 px-4 bg-slate-100 hover:bg-slate-200 rounded-full text-black"
                >
                  <FontAwesomeIcon icon={faEraser} className="mr-2" />
                  Clear
                </button>
                <button
                  type="submit"
                  className="p-2 px-4 bg-blue-500 hover:bg-blue-600 rounded-full"
                >
                  <FontAwesomeIcon icon={faSave} className="mr-2" />
                  Save
                </button>
              </div>
            </div>
          </Form>
        </Formik>
      </div>
    </section>
  );
}

export default CreateEmployee;
