import { connect } from "mongoose"
import config from "../config"

export const connectDb = async () => {
    return await connect(config.MONGO_HOST);
}
