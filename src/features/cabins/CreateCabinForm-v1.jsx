import Input from "../../ui/Input";
import Form from "../../ui/Form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";
import FormRow from "../../ui/FormRow";

import { createCabin } from "../../services/apiCabins";
import { useForm } from "react-hook-form";

function CreateCabinForm({ cabinToEdit }) {
  const { register, handleSubmit, reset, getValues, formState } = useForm();
  const { errors } = formState;

  const queryClient = useQueryClient();
  const { isLoading: isCreating, mutate } = useMutation({
    mutationFn: createCabin,
    onSuccess: () => {
      toast.success("cabin successfully created");

      queryClient.invalidateQueries({
        queryKey: ["cabins"],
      });

      //resetting the form only when it was successful and encapsulated to where the mutation is already happening
      reset();
    },
    onError: (err) => toast.error(err.message),
  });

  function onSubmit(data) {
    // creating a new object data with the image
    const newDataObject = { ...data, image: data.image[0] };
    mutate(newDataObject);
  }

  function onError(err) {
    // console.log(err);
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit, onError)}>
      <FormRow label='Cabin name' errorMessage={errors?.name?.message}>
        <Input
          type='text'
          id='name'
          disabled={isCreating}
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
          disabled={isCreating}
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
          disabled={isCreating}
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
          disabled={isCreating}
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
        disabled={isCreating}
      >
        <Textarea
          type='number'
          id='description'
          disabled={isCreating}
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
            required: "This field is required",
          })}
        />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button variation='secondary' type='reset'>
          Cancel
        </Button>
        <Button disabled={isCreating}>Add cabin</Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
