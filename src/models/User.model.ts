import { DataTypes, Model } from 'sequelize';
import sequelize from '@config/db';

class User extends Model {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public profilePicture?: string;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    profilePicture: { type: DataTypes.STRING, allowNull: true },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
  }
);

export default User;
