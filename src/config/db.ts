import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL as string, {
  dialect: 'postgres',
  logging: false, 
});

export const connectDB = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connected successfully via Sequelize.');
    await sequelize.sync(); 
  } catch (error) {
    console.log('❌ Unable to connect to the PostgreSQL database:', error);
    process.exit(1); 
};
}
export default sequelize;
