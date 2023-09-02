import { useForm } from "react-hook-form";
import Button from "../../ui/Button";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import { useSignup } from "./useSignup";

function SignupForm() {
  const { formState, register, getValues, handleSubmit, reset } = useForm();
  const { errors } = formState;
  const { signup, isLoading } = useSignup();

  const onSubmit = ({ fullName, email, password }) => {
    signup(
      { fullName, email, password },
      {
        onSettled: reset,
      }
    );
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow label='Full name' errorMessage={errors?.fullName?.message}>
        <Input
          type='text'
          id='fullName'
          {...register("fullName", {
            required: "This is field is required",
          })}
          disabled={isLoading}
        />
      </FormRow>

      <FormRow label='Email address' errorMessage={errors?.email?.message}>
        <Input
          type='email'
          id='email'
          {...register("email", {
            required: "This is field is required",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Please provide a valid email address",
            },
          })}
          disabled={isLoading}
        />
      </FormRow>

      <FormRow
        label='Password (min 8 characters)'
        errorMessage={errors?.password?.message}
      >
        <Input
          type='password'
          id='password'
          {...register("password", {
            required: "This is field is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
          })}
          disabled={isLoading}
        />
      </FormRow>

      <FormRow
        label='Repeat password'
        errorMessage={errors?.passwordConfirm?.message}
      >
        <Input
          type='password'
          id='passwordConfirm'
          {...register("passwordConfirm", {
            required: "This is field is required",
            validate: (value) =>
              value === getValues().password || "Passwords need to match",
          })}
          disabled={isLoading}
        />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button
          variation='secondary'
          type='reset' // this is just for elements not error messages
          disabled={isLoading}
          onClick={reset}
        >
          Cancel
        </Button>
        <Button disabled={isLoading}>Create new user</Button>
      </FormRow>
    </Form>
  );
}

export default SignupForm;
