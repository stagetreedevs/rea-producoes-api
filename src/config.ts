/* eslint-disable prettier/prettier */
import { environment } from "./environment";

export const config = () => ({
    port: Number(environment.PORT),
    url: environment.DB_URL
});