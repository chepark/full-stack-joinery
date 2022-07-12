import { useState } from "react";

const useProjectForm = () => {
  const [values, setValues] = useState({
    category: "",
    techStack: [],
    roles: [],
    startDate: null,
    endDate: null,
    contact: "",
    title: "",
    content: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (name, inputValue) => {
    setValues({ ...values, [name]: inputValue });

    validate({ [name]: inputValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const project = values;

    const response = await fetch("http://localhost:4000/api/projects", {
      method: "POST",
      body: JSON.stringify(project),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = await response.json();

    if (!response.ok) {
      console.log("Erros in POST request.", json.error);
    }

    if (response.ok) {
      setValues({
        category: "",
        techStack: [],
        roles: [],
        startDate: null,
        endDate: null,
        contact: "",
        title: "",
        content: "",
      });
    }
  };

  const handleCancel = () => {};

  const compareDates = (tempErrors, option) => {
    let today = new Date();
    today = today.getTime();

    const startDateInMilliSeconds = values.startDate?.getTime() || 0;
    const endDateInMilliSeconds = values.endDate?.getTime() || 0;

    if (option === "startDate")
      tempErrors.startDate =
        startDateInMilliSeconds < today ? "Should be greater than today." : "";

    if (option === "endDate")
      tempErrors.endDate =
        endDateInMilliSeconds < startDateInMilliSeconds
          ? "Should be greater than start date."
          : "";
  };

  const validate = (fieldValues = values) => {
    let tempErrors = {};

    if ("category" in fieldValues)
      tempErrors.category =
        fieldValues.category === "" ? "Required field." : "";

    if ("techStack" in fieldValues)
      tempErrors.techStack =
        fieldValues.techStack?.length === 0 ? "Required field." : "";

    // edit
    if ("startDate" in fieldValues) {
      compareDates(tempErrors, "startDate");
    }

    //edit
    if ("endDate" in fieldValues) compareDates(tempErrors, "endDate");

    if ("contact" in fieldValues)
      tempErrors.contact = fieldValues.contact === "" ? "Required field." : "";

    if ("title" in fieldValues)
      tempErrors.title = fieldValues.title === "" ? "Required field." : "";

    if ("content" in fieldValues) {
      tempErrors.content = fieldValues.content === 0 ? "Required field." : "";
    }
    setErrors(tempErrors);

    if (fieldValues === values) {
      return Object.values(tempErrors).every((x) => x === "");
    }
  };

  return {
    errors,
    values,
    setValues,
    handleChange,
    handleSubmit,
    handleCancel,
    validate,
  };
};

export default useProjectForm;
