import { DataSource } from "typeorm"


export const dataSource : DataSource = new DataSource({

    type:'postgres',
})