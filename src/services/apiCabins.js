import supabase, { supabaseUrl } from "./supabase";

export async function getCabins() {
  const { data, error } = await supabase.from("cabins").select("*");

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded");
  }

  return data;
}

export async function createEditCabin(newCabin, id) {
  const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);

  // creating a name for the image - replacing all slashes as supabase creates folders which we don't want
  const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll(
    "/",
    ""
  );

  // if it has image already we keep it if not we create a new path as the input value will change when a new image is selected
  const imagePath = hasImagePath
    ? newCabin.image
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  let query = supabase.from("cabins");

  // A. create the cabin if there is no id
  if (!id) query = query.insert([{ ...newCabin, image: imagePath }]);

  // B. Editing if there is an id
  if (id) query = query.update({ ...newCabin, image: imagePath }).eq("id", id);

  const { data, error } = await query
    .select() // passes the newly created data
    .single();

  if (error) {
    throw new Error(
      id ? "Cabin could not be updated" : "Cabin could not be created"
    );
  }

  // 2. if successful upload the image

  if (hasImagePath) return data; // not to upload again when uploaded before

  const { error: storageError } = await supabase.storage
    .from("cabin-images")
    .upload(imageName, newCabin.image);

  // 3. delete the cabin if there was an error uploading corresponding image
  if (storageError) {
    await supabase.from("cabins").delete().eq("id", data.id);
    // console.log(storageError);
    throw new Error(
      "Cabin image could not be uploaded and the cabin was not created."
    );
  }

  return data;
}

export async function deleteCabin(id) {
  const { data, error } = await supabase.from("cabins").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Cabin could not be deleted");
  }

  return data;
}
