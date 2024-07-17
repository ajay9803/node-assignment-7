import { NotFoundError } from "../error/not_found_error";
import { UnauthorizedError } from "../error/unauthorized_error";
import { User } from "../interfaces/user";
import { adminCheck } from "../utils/admin_check";

// keep track of user's count to avoid duplicate user id's
let userCount = 1;

// initial admin and random user
export const users: User[] = [
  {
    id: "0",
    name: "Admin",
    email: "admin@gmail.com",
    password: "$2b$10$qU4R6tjzgsJIRYNEuzGSAO7cL2qDGg2.N4QMw0w2GXQvA1hM36R2W",
    permissions: [
      "users.create",
      "users.update",
      "users.delete",
      "users.fetch",
      "todos.create",
      "todos.update",
      "todos.delete",
      "todos.fetch",
    ],
  },
  {
    id: "1",
    name: "test 1",
    email: "test1@gmail.com",
    password: "$2b$10$qU4R6tjzgsJIRYNEuzGSAO7cL2qDGg2.N4QMw0w2GXQvA1hM36R2W",
    permissions: [
      "todos.create",
      "todos.update",
      "todos.delete",
      "todos.fetch",
    ],
  },
];

// push new user to users-list
export const createUser = (user: Omit<User, "id">) => {
  users.push({ id: `${userCount + 1}`, ...user });

  // increase user count in each user-creation
  userCount++;
};

// fetch user by id
export const getUserById = (id: string) => {
  return users.find((user) => user.id === id);
};

// fetch user by email
export const getUserByEmail = (email: string) => {
  return users.find((user) => user.email === email);
};

// update user by id
export const updateUserById = (
  id: string,

  // omit id and permissions - use necessary data
  theUser: Omit<User, "id" | "permissions">
) => {
  const user = users.find((user) => user.id === id);

  if (user) {
    user.email = theUser.email;
    user.name = theUser.name;
    user.password = theUser.password;
  }

  
  return user;
};

// delete user by id
export const deleteUserById = (id: string) => {
  const index = users.findIndex((user) => user.id === id);

  // forbid admin from deleting itself
  if (adminCheck(id)) {
    throw new UnauthorizedError("Task forbidden.");
  }
  if (index >= 0) {
    users.splice(index, 1);
  } else {
    throw new NotFoundError("No such user found.");
  }
};
