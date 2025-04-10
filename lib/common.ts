import User from "./modals/User";

export async function isSuperuser(userId: any) {

    const user = await User.findById(userId)
    console.log(user)
    return user
}