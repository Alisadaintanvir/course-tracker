import bycrypt from "bcryptjs";

export const hashPassword = async (password: string) => {
  const salt = await bycrypt.genSalt(10);
  return await bycrypt.hash(password, salt);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
) => {
  return await bycrypt.compare(password, hashedPassword);
};
