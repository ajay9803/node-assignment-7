import { NotFoundError } from "../error/not_found_error";
import { UnauthorizedError } from "../error/unauthorized_error";
import { User } from "../interfaces/user";
import { adminCheck } from "../utils/admin_check";
import BaseModel from "./base";

export class UserModel extends BaseModel {

  // create user
  static createUser = async (user: Omit<User, "id">) => {
    const userToCreate = {
      name: user.name,
      email: user.email,
      password: user.password,
      role_id: 2,
    };

    await this.queryBuilder().insert(userToCreate).table("users");
  };

  // fetch user by email
  static getUserByEmail = async (email: string) => {
    console.log("Find user by email.");

    const user = await this.queryBuilder()
      .select()
      .from("users")
      .where("email", email)
      .first();

    if (user) {
      console.log("Here are the permissions.");
      const permissions = await this.queryBuilder()
        .join(
          "permissions",
          "permissions.id",
          "roles_and_permissions.permission_id"
        )
        .table("roles_and_permissions")
        .select("permissions.permission_name")
        .where("role_id", user.roleId);

        let userPermissions: string[] = permissions.map((permission) => {
          return permission.permissionName;
        });

        console.log('permissions: ', userPermissions);

        return {...user, permissions: userPermissions};
    }

    console.log("The existing user is: ", user);
    return user;
  };

  // fetch user by id
  static getUserById = async (id: string) => {
    const user = await this.queryBuilder()
      .select()
      .from("users")
      .where("id", id)
      .first();

    console.log("The existing user is: ", user);
    return user;
  };

  // update user by id
  static updateUserById = async (
    id: string,

    // omit id and permissions - use necessary data
    theUser: Omit<User, "id" | "permissions">
  ) => {
    let updatedAt = new Date();
    console.log("The data is: ", id, theUser);

    const user = await this.queryBuilder()
      .select()
      .from("users")
      .where("id", id)
      .first();
    console.log("The fetched user is: ", user);

    if (user) {
      await this.queryBuilder()
        .update({ ...theUser, updated_at: updatedAt })
        .from("users")
        .where("id", id);
      return { ...user, ...theUser, updated_at: updatedAt };
    }

    return user;
  };

  // delete user by id
  static deleteUserById = async (id: string) => {
    // forbid admin from deleting itself
    if (adminCheck(id)) {
      throw new UnauthorizedError("Task forbidden.");
    }
    const existingUser = await this.queryBuilder()
      .select()
      .from("users")
      .where("id", id)
      .first();

    if (existingUser) {
      await this.queryBuilder().delete().from("users").where("id", id);
    }
  };
}

