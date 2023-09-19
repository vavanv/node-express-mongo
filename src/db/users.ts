import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  authentication: {
    password: { type: String, required: true, select: false },
    salt: { type: String, required: true, select: false },
    sessionToken: { type: String, select: false },
  },
});

export const UserModel = mongoose.model('User', UserSchema);

export const getUsers = () => {
  return UserModel.find();
};

export const getUserByEmailWithAuthentication = (email: string) => {
  return UserModel.findOne({ email }).select('+authentication.salt +authentication.password');
};

export const getUserByEmail = (email: string) => {
  return UserModel.findOne({ email });
};

export const getUserBySessionToken = (sessionToken: string) => {
  return UserModel.findOne({ 'authentication.sessionToken': sessionToken });
};
export const getUserById = (id: string) => {
  return UserModel.findById(id);
};

export const createUser = (values: Record<string, any>) => {
  return new UserModel(values).save().then(user => user.toObject());
};
export const deleteUser = (id: string) => {
  return UserModel.findByIdAndDelete({ _id: id });
};

export const updateUser = (id: string, values: Record<string, any>) => {
  return UserModel.findByIdAndUpdate({ _id: id }, values, { new: true });
};
