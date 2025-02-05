import { faEraser, faRotateLeft, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { JobService } from "../../services/job.service.ts";
import { FormGroup, InputLabel, MenuItem, Select } from "@mui/material";
import { SkillService } from "../../../services/skill.service";
import { BenefitService } from "../../../services/benefit.service";
import { LevelService } from "../../../services/level.service";
function JobDetail({ item, cancel }: { item: any; cancel: any }) {
  const [skills, setSkills] = useState<any>([]);
  const [benefits, setBenefits] = useState<any>([]);
  const [levels, setLevels] = useState<string[]>([]);

  useEffect(() => {
    const fetchSkillsAndBenefits = async () => {
      try {
        const [skillsData, benefitsData, levelsData] = await Promise.all([
          SkillService.getAll(),
          BenefitService.getAll(),
          LevelService.getAll(),
        ]);

        setSkills(skillsData);
        setBenefits(benefitsData);
        setLevels(levelsData);
      } catch (error) {
        console.error('Failed to fetch skills or benefits', error);
      }
    };

    fetchSkillsAndBenefits();
  }, []);

  const initialValues = {
    title: item?.title || '',
    skillIds: item?.skillIds || [],
    startDate: item?.startDate
      ? ((date: string) => {
          const dateObj = new Date(date);
          return dateObj.toISOString().split('T')[0]; // Chuyển ngày về dạng yyyy-mm-dd
        })(item.startDate)
      : '',
    endDate: item?.endDate
      ? ((date: string) => {
          const dateObj = new Date(date);
          return dateObj.toISOString().split('T')[0]; // Chuyển ngày về dạng yyyy-mm-dd
        })(item.endDate)
      : '',
    level: item?.level || '',
    status: item?.status || 'DRAFT',
    workingAddress: item?.workingAddress || '',
    description: item?.description || '',
    benefitIds: item?.benefitIds || [],
    salaryFrom: item?.salaryFrom || 0,
    salaryTo: item?.salaryTo || 0,
  };

  const validationSchema = Yup.object({
    title: Yup.string()
      .required('Title is required')
      .min(2, 'Title must be between 2 and 255 characters')
      .max(255, 'Title must be between 2 and 255 characters'),
    skillIds: Yup.array().min(1, 'At least one skill is required'),
    startDate: Yup.date().required('Start date is required'),
    endDate: Yup.date()
      .required('End date is required')
      .min(Yup.ref('startDate'), 'End date must be after start date'),
    level: Yup.string().required('Level is required'),
    status: Yup.string().optional(),
    workingAddress: Yup.string().required('Working address is required'),
    description: Yup.string().optional(),
    benefitIds: Yup.array().min(1, 'At least one benefit is required'),
    salaryFrom: Yup.number()
      .required('Salary from is required')
      .min(0, 'Salary from must be greater than 0'),
    salaryTo: Yup.number()
      .required('Salary to is required')
      .min(0, 'Salary to must be greater than 0')
      .moreThan(
        Yup.ref('salaryFrom'),
        'Salary to must be greater than salary from',
      ),
  });

  const onSubmit = async (values: any) => {
    try {
      Object.assign(values, {
        startDate: new Date(values.startDate),
        endDate: new Date(values.endDate)
      });
      if (item) {
        const response = await JobService.update(item.id, values);
        if (response) cancel();
        else alert('Failed to update');
      } else {
        const response = await JobService.create(values);
        if (response) cancel();
        else alert('Failed to create');
      }
    } catch (error) {
      console.error('Failed to submit form', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <section>
      <div className="card border border-slate-300 rounded-md">
        <div className="card-header p-3">
          <h1 className="text-2xl font-bold">{item ? 'Edit' : 'Create'} Job</h1>
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          <Form>
            <div className="card-body border-y border-slate-300 p-3 flex flex-wrap">
              {/* Title */}
              <div className="form-group mb-3 w-1/2 p-2">
                <label htmlFor="title" className="block mb-2">
                  Title
                </label>
                <Field
                  name="title"
                  className="w-full p-2 border border-slate-300 rounded-md"
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-red-500"
                />
              </div>

              {/* Level */}
              <div className="form-group mb-3 w-1/2 p-2">
                <label htmlFor="level" className="block mb-2">
                  Level
                </label>
                <Field
                  as="select"
                  name="level"
                  className="w-full p-2 border border-slate-300 rounded-md"
                >
                  <option value="" label="Select level" />
                  {levels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="level"
                  component="div"
                  className="text-red-500"
                />
              </div>

              {/* Start Date */}
              <div className="form-group mb-3 w-1/2 p-2">
                <label htmlFor="startDate" className="block mb-2">
                  Start Date
                </label>
                <Field
                  type="date"
                  name="startDate"
                  className="w-full p-2 border border-slate-300 rounded-md"
                />
                <ErrorMessage
                  name="startDate"
                  component="div"
                  className="text-red-500"
                />
              </div>

              {/* End Date */}
              <div className="form-group mb-3 w-1/2 p-2">
                <label htmlFor="endDate" className="block mb-2">
                  End Date
                </label>
                <Field
                  type="date"
                  name="endDate"
                  className="w-full p-2 border border-slate-300 rounded-md"
                />
                <ErrorMessage
                  name="endDate"
                  component="div"
                  className="text-red-500"
                />
              </div>

              {/* Skills */}
              <FormGroup className="form-group mb-3 w-1/2 p-2">
                <InputLabel htmlFor="skillIds" className="block mb-2">
                  Skills
                </InputLabel>
                <Field
                  as={Select}
                  name="skillIds"
                  multiple
                  className="w-full p-2 border border-slate-300 rounded-md"
                >
                  {skills.map((skill: any) => (
                    <MenuItem key={skill.id} value={skill.id}>
                      {skill.name}
                    </MenuItem>
                  ))}
                </Field>
                <ErrorMessage
                  name="skillIds"
                  component="div"
                  className="text-red-500"
                />
              </FormGroup>

              {/* Benefits */}
              <FormGroup className="form-group mb-3 w-1/2 p-2">
                <InputLabel htmlFor="benefitIds" className="block mb-2">
                  Benefits
                </InputLabel>
                <Field
                  as={Select}
                  name="benefitIds"
                  multiple
                  className="w-full p-2 border border-slate-300 rounded-md"
                >
                  {benefits.map((benefit: any) => (
                    <MenuItem key={benefit.id} value={benefit.id}>
                      {benefit.name}
                    </MenuItem>
                  ))}
                </Field>
                <ErrorMessage
                  name="benefits"
                  component="div"
                  className="text-red-500"
                />
              </FormGroup>

              {/* Working Address */}
              <div className="form-group mb-3 w-1/2 p-2">
                <label htmlFor="workingAddress" className="block mb-2">
                  Working Address
                </label>
                <Field
                  name="workingAddress"
                  className="w-full p-2 border border-slate-300 rounded-md"
                />
                <ErrorMessage
                  name="workingAddress"
                  component="div"
                  className="text-red-500"
                />
              </div>

              {/* Description */}
              <div className="form-group mb-3 w-1/2 p-2">
                <label htmlFor="description" className="block mb-2">
                  Description
                </label>
                <Field
                  name="description"
                  as="textarea"
                  className="w-full p-2 border border-slate-300 rounded-md"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-red-500"
                />
              </div>

              {/* Salary From */}
              <div className="form-group mb-3 w-1/2 p-2">
                <label htmlFor="salaryFrom" className="block mb-2">
                  Salary From
                </label>
                <Field
                  name="salaryFrom"
                  type="number"
                  className="w-full p-2 border border-slate-300 rounded-md"
                />
                <ErrorMessage
                  name="salaryFrom"
                  component="div"
                  className="text-red-500"
                />
              </div>

              {/* Salary To */}
              <div className="form-group mb-3 w-1/2 p-2">
                <label htmlFor="salaryTo" className="block mb-2">
                  Salary To
                </label>
                <Field
                  name="salaryTo"
                  type="number"
                  className="w-full p-2 border border-slate-300 rounded-md"
                />
                <ErrorMessage
                  name="salaryTo"
                  component="div"
                  className="text-red-500"
                />
              </div>
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
                  type="button"
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

export default JobDetail;
