import Input from "../../ui/Input";
import Form from "../../ui/Form";

import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";
import FormRow from "../../ui/FormRow";

import { useForm } from "react-hook-form";
import { useCreateCabin } from "./useCreateCabin";
import { useEditCabin } from "./useEditCabin";

function CreateCabinForm({ onCloseModal, cabinToEdit = {} }) {
  const { id: editId, ...editValue } = cabinToEdit;
  const isEditSession = Boolean(editId);

  const { register, handleSubmit, reset, getValues, formState } = useForm({
    defaultValues: isEditSession ? editValue : {},
  });
  const { errors } = formState;

  const { isCreating, createCabin } = useCreateCabin();
  const { isEditing, editCabin } = useEditCabin();

  const isWorking = isCreating || isEditing;

  function onSubmit(data) {
    const image = typeof data.image === "string" ? data.image : data.image[0];

    if (isEditSession)
      editCabin(
        { newCabinData: { ...data, image }, id: editId },
        {
          onSuccess: (data) => reset(),
        }
      );
    else
      createCabin(
        { ...data, image },
        {
          //? react query has thought of this to have some options and this function has access to newly created data
          onSuccess: (data) => reset(),
        }
      );

    onCloseModal?.();
  }

  function onError(err) {
    // console.log(err);
  }

  return (
    <Form
      onSubmit={handleSubmit(onSubmit, onError)}
      type={onCloseModal ? "modal" : "regular"}
    >
      <FormRow label='Cabin name' errorMessage={errors?.name?.message}>
        <Input
          type='text'
          id='name'
          disabled={isWorking}
          {...register("name", {
            required: "This field is required",
          })}
        />
      </FormRow>
      <FormRow
        label='Maximum capacity'
        errorMessage={errors?.maxCapacity?.message}
      >
        <Input
          type='number'
          id='maxCapacity'
          disabled={isWorking}
          {...register("maxCapacity", {
            required: "This field is required",
            min: {
              value: 1,
              message: "Capacity should be at least 1",
            },
          })}
        />
      </FormRow>

      <FormRow
        label='Regular price'
        errorMessage={errors?.regularPrice?.message}
      >
        <Input
          type='number'
          id='regularPrice'
          disabled={isWorking}
          {...register("regularPrice", {
            required: "This field is required",
            min: {
              value: 1,
              message: "Capacity should be at least 1",
            },
          })}
        />
      </FormRow>

      <FormRow label='Discount' errorMessage={errors?.disconut?.message}>
        <Input
          type='number'
          id='disconut'
          defaultValue={0}
          disabled={isWorking}
          {...register("disconut", {
            required: "This field is required",
            validate: (value) =>
              value <= getValues().regularPrice ||
              `Discount should be less than regular price: ${
                getValues().regularPrice
              }`,
          })}
        />
      </FormRow>

      <FormRow
        label='Description for website'
        errorMessage={errors?.description?.message}
      >
        <Textarea
          type='number'
          id='description'
          disabled={isWorking}
          defaultValue=''
          {...register("description", {
            required: "This field is required",
          })}
        />
      </FormRow>

      <FormRow label='Cabin photo' errorMessage={errors?.image?.message}>
        <FileInput
          id='image'
          accept='image/*'
          {...register("image", {
            required: isEditSession ? false : "This field is required",
          })}
        />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button
          variation='secondary'
          type='reset'
          onClick={() => onCloseModal?.()}
        >
          Cancel
        </Button>
        <Button disabled={isWorking}>
          {isEditSession ? "Edit cabin" : "Create new cabin"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
